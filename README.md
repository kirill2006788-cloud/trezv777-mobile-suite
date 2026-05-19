# 🚕 Trezv777 Mobile Suite

<p align="center">
  <b>Flutter • iOS/Android • Realtime Taxi Workflow • Production Delivery</b>
</p>

<p align="center">
  <a href="https://www.trezv777.ru/">www.trezv777.ru</a> • Built from scratch for company operations
</p>

<p align="center">
  <a href="https://apps.apple.com/us/app/трезвый-водитель-ноль-промилле/id6765466281">
    <img src="https://img.shields.io/badge/App_Store-000000?style=for-the-badge&logo=app-store&logoColor=white" alt="App Store">
  </a>
  <a href="https://play.google.com/store/apps/details?id=ru.nolpromille.driver&pcampaignid=web_share">
    <img src="https://img.shields.io/badge/Google_Play-000000?style=for-the-badge&logo=google-play&logoColor=white" alt="Google Play">
  </a>
</p>

---

## 📱 Download

| App | Platform | Link |
|-----|----------|------|
| **Driver App** | iOS | [App Store](https://apps.apple.com/us/app/трезвый-водитель-ноль-промилле/id6765466281) |
| **Driver App** | Android | [Google Play](https://play.google.com/store/apps/details?id=ru.nolpromille.driver&pcampaignid=web_share) |

---

## ✨ Features

### Client App (`app`)
- ✅ OTP Authorization
- ✅ Map-based location selection with geocoding
- ✅ Route calculation, ETA, cost preview
- ✅ Order creation with comments, preferences, tariffs, bonuses/promocodes
- ✅ Real-time order status and driver tracking
- ✅ Trip history, order rating, profile scenarios

### Driver App (`prosto_taxi_driver`)
- ✅ Secure authorization and API calls
- ✅ Real-time order receiving (Socket.IO)
- ✅ Complete trip status cycle: incoming → accepted → enroute → arrived → started → completed
- ✅ Pre-orders, reminders, push notifications, sound and vibration
- ✅ Driver blocking/subscription logic
- ✅ Map, route to client and destination, live ETA updates

---

## 🛠 Tech Stack

- **Framework:** Flutter 3.16+
- **State Management:** BLoC / Provider
- **Real-time:** Socket.IO
- **Maps:** Yandex Maps / Google Maps
- **Backend:** REST API
- **Architecture:** Clean Architecture

---

## 📂 Project Structure

```
trezv777-mobile-suite/
├── app/                    # Client application
│   ├── lib/
│   │   ├── core/          # Core utilities
│   │   ├── data/          # Data layer
│   │   ├── domain/        # Business logic
│   │   └── presentation/  # UI layer
│   └── pubspec.yaml
│
├── prosto_taxi_driver/     # Driver application
│   ├── lib/
│   │   ├── core/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   └── pubspec.yaml
│
└── docs/                   # Documentation
    └── screenshots/
```

---

## 🔧 Getting Started

```bash
# Clone repository
git clone https://github.com/kirill2006788-cloud/trezv777-mobile-suite.git
cd trezv777-mobile-suite

# Install dependencies
flutter pub get

# Run client app
cd app
flutter run

# Run driver app
cd prosto_taxi_driver
flutter run
```

---

## 🏗 Key Technical Challenges

- **Real-time synchronization** between two roles (client/driver) without status discrepancies
- **Network resilience:** reconnect, fallback scenarios, state reinitialization
- **Complex order state machine** with active state persistence and recovery
- **Geo logic and routing:** geolocation, ETA, coordinate updates, navigation behavior
- **Production security:** secrets via env/secrets files, no hardcoded keys in public repo
- **Release preparation:** Android/iOS configs, CI pipeline and infrastructure build

---

## 👨‍💻 What I Built

- Designed architecture and key scenarios
- Implemented full client application from scratch
- Implemented full driver application from scratch
- Integrated real-time communication (Socket.IO)
- Implemented complex state machine for order processing
- Set up CI/CD pipeline for automated builds
- Deployed to App Store and Google Play

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/kirill2006788-cloud">Kirill</a></p>
  <p>© 2024 Trezv777 Mobile Suite</p>
</div>
