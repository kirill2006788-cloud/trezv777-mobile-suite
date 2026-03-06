import { BadRequestException, Body, Controller, Get, Headers, Post, Query, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { DriversService } from './drivers.service';
import { OrdersService } from './orders.service';
import { RedisService } from './redis.service';

@Controller('driver')
export class DriversController {
  constructor(
    private readonly drivers: DriversService,
    private readonly orders: OrdersService,
    private readonly redis: RedisService,
  ) {}

  private pushTokenKey(phone: string) {
    return `driver:push_token:${phone}`;
  }

  private requireDriverPhone(auth?: string) {
    const token = auth?.replace(/^Bearer\s+/i, '').trim();
    if (!token) throw new UnauthorizedException('Driver token required');
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new UnauthorizedException('Server configuration error');
    const payload = jwt.verify(token, secret) as any;
    if (!payload || payload.role !== 'driver' || typeof payload.phone !== 'string' || !payload.phone.trim()) {
      throw new UnauthorizedException('Driver token required');
    }
    return payload.phone.trim();
  }

  @Get('profile')
  async getProfile(@Query('phone') phone?: string) {
    const raw = (phone || '').trim();
    const digits = raw.replace(/\D/g, '');
    const normalized = digits || raw;
    if (!normalized) throw new BadRequestException('phone required');
    const profile = await this.drivers.getProfile(normalized);
    const bonus = await this.drivers.getBonus(normalized);
    const rating = await this.orders.getDriverRating(normalized);
    const earnings = await this.orders.getDriverEarnings(normalized);
    const stats = await this.orders.getDriverStats(normalized);
    const baseProfile = profile && typeof profile === 'object' ? (profile as Record<string, unknown>) : {};
    const blocked = await this.redis.client.exists(`driver:block:${normalized}`);
    const earningsLimit = Number(await this.redis.client.get('settings:earnings_limit') || 15000);
    const safeProfile = {
      ...baseProfile,
      rating: rating.avg,
      ratingCount: rating.count,
      earnedRub: Math.round(Number(earnings.net || 0)),
      earnedGross: Math.round(Number(earnings.gross || 0)),
      earnedCommission: Math.round(Number(earnings.commission || 0)),
      earnedPaid: Math.round(Number(earnings.paid || 0)),
      earnedAvailable: Math.round(Number(earnings.available || 0)),
      acceptedOrders: stats.acceptedOrders,
      trips: stats.trips,
      blocked: blocked === 1,
      earningsLimit,
      limitReached: Number(earnings.net || 0) >= earningsLimit,
    };
    return { ok: true, profile: safeProfile, bonus };
  }

  @Get('trips')
  async getTrips(@Query('phone') phone?: string, @Query('limit') limitRaw?: string) {
    const raw = (phone || '').trim();
    const digits = raw.replace(/\D/g, '');
    const normalized = digits || raw;
    if (!normalized) throw new BadRequestException('phone required');
    const limit = Math.min(100, Math.max(1, Number(limitRaw) || 50));
    const orders = await this.orders.listOrdersForDriver(normalized, limit);
    const trips = orders
      .filter((o) => o.status === 'completed' || o.status === 'started' || o.status === 'accepted' || o.status === 'enroute' || o.status === 'arrived')
      .map((o) => ({
        id: o.id,
        status: o.status,
        fromAddress: o.fromAddress || '',
        toAddress: o.toAddress || '',
        priceFrom: o.priceFrom || 0,
        priceFinal: o.priceFinal || 0,
        startedAt: o.startedAt || o.acceptedAt || o.createdAt,
        completedAt: o.completedAt || null,
        tripMinutes: o.tripMinutes || 0,
        serviceIndex: o.serviceIndex || 0,
      }));
    return { ok: true, trips };
  }

  @Post('profile')
  async saveProfile(
    @Body()
    body: {
      phone?: string;
      fullName?: string;
      inn?: string;
      passport?: string;
      avatarBase64?: string | null;
      passportFrontBase64?: string | null;
      passportRegBase64?: string | null;
      selfieBase64?: string | null;
      docsSigned?: boolean;
      registrationStatus?: string;
      referralCount?: number;
      referralCode?: string;
    },
  ) {
    const rawPhone = (body.phone || '').trim();
    const phoneDigits = rawPhone.replace(/\D/g, '');
    const phone = phoneDigits || rawPhone;
    if (!phone) throw new BadRequestException('phone required');
    const referralCode = (body.referralCode || '').toString().trim().replace(/\D/g, '');
    const existing = await this.drivers.getProfile(phone);
    if (referralCode && referralCode !== phone && !(existing as any)?.referralCode) {
      const refProfile = await this.drivers.getProfile(referralCode);
      if (refProfile) {
        const nextCount = Math.max(0, Number((refProfile as any).referralCount || 0)) + 1;
        (refProfile as any).referralCount = nextCount;
        await this.drivers.saveProfile(referralCode, refProfile as Record<string, unknown>);
        if (nextCount % 3 === 0) {
          await this.drivers.addBonus(referralCode, 500);
        }
      }
    }
    const profile = {
      phone,
      fullName: (body.fullName || '').toString(),
      inn: (body.inn || '').toString(),
      passport: (body.passport || '').toString(),
      avatarBase64: body.avatarBase64 ?? (existing as any)?.avatarBase64 ?? null,
      passportFrontBase64: body.passportFrontBase64 ?? (existing as any)?.passportFrontBase64 ?? null,
      passportRegBase64: body.passportRegBase64 ?? (existing as any)?.passportRegBase64 ?? null,
      selfieBase64: body.selfieBase64 ?? (existing as any)?.selfieBase64 ?? null,
      docsSigned: Boolean(body.docsSigned),
      registrationStatus: (body.registrationStatus || '').toString() || 'incomplete',
      referralCount: Number.isFinite(Number(body.referralCount)) ? Number(body.referralCount) : 0,
      referralCode: referralCode || (existing as any)?.referralCode || undefined,
      updatedAt: new Date().toISOString(),
    };
    await this.drivers.saveProfile(phone, profile);
    return { ok: true, profile };
  }

  @Post('push-token')
  async savePushToken(
    @Headers('authorization') auth?: string,
    @Body() body?: { token?: string; platform?: string },
  ) {
    const phone = this.requireDriverPhone(auth);
    const token = (body?.token || '').toString().trim();
    if (!token) {
      await this.redis.client.del(this.pushTokenKey(phone));
      return { ok: true, deleted: true };
    }

    const payload = {
      token,
      platform: (body?.platform || 'ios').toString(),
      updatedAt: new Date().toISOString(),
    };
    await this.redis.client.set(this.pushTokenKey(phone), JSON.stringify(payload));
    return { ok: true };
  }
}
