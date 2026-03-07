# iOS / Xcode / TestFlight — инструкция

Два приложения для сборки и загрузки в TestFlight:

| Приложение | Папка проекта | Название в App Store |
|------------|---------------|----------------------|
| **Клиент** | `app` (архив: `Trezvyi_voditel_Nol_Promille_client.zip`) | Трезвый водитель Ноль Промилле |
| **Водитель** | `prosto_taxi_driver` (архив: `Nol_Promille_voditel_driver.zip`) | Ноль Промилле водитель |

---

## 1. Подготовка на Mac (VM или реальный Mac)

1. Установите **Xcode** из App Store и откройте его один раз (принять лицензию).
2. Установите **Flutter**:  
   https://docs.flutter.dev/get-started/install/macos  
   После установки выполните `flutter doctor` и при необходимости `flutter doctor --android-licenses` (для iOS достаточно, чтобы в выводе был галочкой пункт по Xcode).

---

## 2. Распаковка и открытие проекта в Xcode

### Клиентское приложение (Трезвый водитель Ноль Промилле)

```bash
# Распаковать архив
unzip Trezvyi_voditel_Nol_Promille_client.zip
cd app

# Установить зависимости Flutter
flutter pub get

# Открыть проект в Xcode (обязательно .xcworkspace, не .xcodeproj)
open ios/Runner.xcworkspace
```

### Приложение для водителя (Ноль Промилле водитель)

```bash
unzip Nol_Promille_voditel_driver.zip
cd prosto_taxi_driver

flutter pub get
open ios/Runner.xcworkspace
```

В Xcode откроется проект Runner. Дальше — подписание и сборка.

---

## 3. Настройка подписи в Xcode

1. В левой панели выберите **Runner** (синяя иконка проекта).
2. Выберите таргет **Runner** и вкладку **Signing & Capabilities**.
3. Укажите **Team** (ваш Apple Developer аккаунт). При необходимости нажмите **Add Account** и войдите в Apple ID.
4. Если Xcode предложит **Automatically manage signing** — включите эту опцию.
5. Убедитесь, что **Bundle Identifier** уникален (например `ru.yourapp.client` и `ru.yourapp.driver` для двух приложений).

---

## 4. Сборка и запуск на симуляторе/устройстве

- **Симулятор**: вверху выберите устройство (например iPhone 15), нажмите **Run** (▶).
- **Реальное устройство**: подключите iPhone, выберите его в списке устройств, нажмите **Run**. При первом запуске на устройстве может понадобиться: **Настройки → Основные → VPN и управление устройством** → доверие разработчику.

Через Flutter (вместо запуска из Xcode):

```bash
flutter run
# или для release
flutter run --release
```

---

## 5. Сборка для TestFlight (Archive + загрузка)

1. В Xcode выберите целевое устройство **Any iOS Device (arm64)** (не симулятор).
2. Меню **Product → Archive**.
3. После сборки откроется **Organizer** с архивом. Выберите его и нажмите **Distribute App**.
4. Выберите **App Store Connect** → **Upload** → далее по шагам (подписание оставить по умолчанию).
5. После успешной загрузки зайдите в [App Store Connect](https://appstoreconnect.apple.com) → ваше приложение → **TestFlight**. Через 5–15 минут сборка появится в разделе для тестировщиков.

Важно: для загрузки в App Store Connect нужен платный аккаунт **Apple Developer Program**.

---

## 6. Сборка через Flutter (альтернатива)

Из папки проекта (`app` или `prosto_taxi_driver`):

```bash
flutter build ipa
```

Готовый `.ipa` будет в `build/ios/ipa/`. Его можно загрузить в App Store Connect через **Transporter** (из App Store) или через Xcode Organizer (вкладка **Distribute App** → загрузка ранее собранного IPA).

---

## 7. Если появятся изменения в коде

После правок в коде на Windows (или где ведёте разработку):

1. Заново соберите архивы. В PowerShell из корня проекта (папка `2048`):
   ```powershell
   cd c:\Users\user\CascadeProjects\2048
   .\deploy_ios\create_ios_zips.ps1
   ```
   Первый запуск может занять несколько минут (архивация больших проектов).
2. Скопируйте новые zip-файлы на Mac, распакуйте в новую папку и повторите шаги 2–5.

---

## Краткий чеклист

- [ ] Xcode установлен, лицензия принята  
- [ ] Flutter установлен, `flutter doctor` в порядке  
- [ ] Архив распакован, выполнен `flutter pub get`  
- [ ] В Xcode открыт `ios/Runner.xcworkspace`  
- [ ] В Xcode настроены Team и Signing  
- [ ] Для TestFlight: выбран **Any iOS Device**, выполнен **Product → Archive**, затем **Distribute App → App Store Connect → Upload**
