# TrailMates

TrailMates to projekt składający się z trzech głównych aplikacji:

- **Backend (.NET Core)**
- **Frontend (React)**
- **Aplikacja mobilna (React Native + EXPO (Android))**

---

## Wymagania wstępne

Upewnij się, że masz zainstalowane następujące narzędzia i oprogramowanie:

- [**.NET Core 8 SDK**](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [**Node.js**](https://nodejs.org/) (npm jest dołączony)
- [**Java SDK 17**](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html) – wymagany do budowania aplikacji mobilnej
- Android Emulator lub fizyczne urządzenie z systemem Android
- [**Expo CLI**](https://docs.expo.dev/workflow/expo-cli/)

---

## Konfiguracja środowiska

**Przed instalacją czegokolwiek wykonaj poniższe kroki:**

1. **Plik konfiguracyjny dla aplikacji backendowej**

   - W katalogu `/backend/TrailMates.Api` utwórz plik `appsettings.personal.json` i skonfiguruj w nim niezbędne zmienne środowiskowe.

   _Przykładowy plik konfiguracyjny:_

   ```json
   {
     "Jwt": {
       "Secret": "key-for-encryption",
       "Issuer": "trail-mates-backend",
       "Audience": "developers",
       "ExpirationInMinutes": 60
     },
     "AWS": {
       "Profile": "default",
       "Region": "eu-north-1",
       "AccessKey": "access-key",
       "SecretKey": "secret-key"
     },
     "AWSProfilePictures": {
       "BucketName": "bucket-name",
       "CloudfrontUrl": "domain.cloudfront.net"
     },
     "AWSPostsPictures": {
       "BucketName": "bucket-name",
       "CloudfrontUrl": "domain.cloudfront.net"
     }
   }
   ```

2. **Plik konfiguracyjny dla aplikacji frontendowej i mobilnej:**

   - W katalogu `/frontend` oraz `/mobile` utwórz plik `.env.local` i skonfiguruj w nim niezbędne zmienne środowiskowe.

   _Przykładowy plik konfiguracyjny (frontend):_

   ```javascript
    REACT_APP_MAPBOX_ACCESS_TOKEN=pk.ey...
    REACT_APP_CLOUDFRONT_DOMAIN_NAME_AVATARS=https://domain.cloudfront.net/
    REACT_APP_CLOUDFRONT_DOMAIN_NAME_POSTS=https://domain.cloudfront.net/
   ```

   _Przykładowy plik konfiguracyjny (mobile):_

   ```javascript
    PUBLIC_MAPBOX_ACCESS_TOKEN=pk.ey...
    REACT_APP_CLOUDFRONT_DOMAIN_NAME_AVATARS=https://domain.cloudfront.net/
    REACT_APP_CLOUDFRONT_DOMAIN_NAME_POSTS=https://domain.cloudfront.net/
   ```

3. **Plik z sekretami dla Androida:**
   - W katalogu `/mobile/android` utwórz plik `secrets.properties` i dodaj odpowiednie dane konfiguracyjne (np. klucze API, hasła).

     _Przykładowy plik konfiguracyjny secrets.properties (mobile/android):_
     
     ```javascript
     MAPBOX_DOWNLOADS_TOKEN=sk.ey...
     ```

---

## Uruchomienie projektu

### 1. Backend (.NET Core)

Po upewnieniu się, że projekt zawiera plik `appsettings.personal.json`, uruchom serwer poleceniem:

```bash
dotnet run --launch-settings "https"
```

### 2. Frontend (React)

Po upewnieniu się, że projekt zawiera plik `.env.local`, zainstaluj zależności

```bash
npm install
```

i uruchom aplikację

```bash
npm start
```

### 3. Aplikacja Mobilna (React Native + Expo)

Po upewnieniu się, że projekt zawiera plik `.env.local`, w folderze `/mobile` zainstaluj zależności oraz wykonaj prebuild projektu Expo

```bash
npm install
```

```bash
npx expo prebuild
```

następnie przejdź do katalogu `/mobile/android` i wykonaj

```bash
./gradlew clean
```

oraz

```bash
./gradlew assembleDebug
```

na koniec w katalogu `/mobile` uruchom aplikację

```bash
npm run android
```
