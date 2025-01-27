# Używamy obrazu z preinstalowanym Android SDK
FROM cimg/android:2023.08-node

# Ustawienie katalogu roboczego
WORKDIR /app

# Zmiana właściciela katalogu na użytkownika circleci
RUN sudo chown -R circleci:circleci /app

# Instalacja globalnych zależności
RUN sudo npm install -g expo-cli
ENV ANDROID_ADB_SERVER_ADDRESS="host.docker.internal"

# Kopiowanie plików package.json i package-lock.json
COPY --chown=circleci:circleci package*.json ./

# Instalacja zależności
RUN npm install

# Kopiowanie reszty kodu źródłowego
COPY --chown=circleci:circleci . .

# Kopiowanie pliku konfiguracyjnego
COPY --chown=circleci:circleci app.json .
COPY --chown=circleci:circleci metro.config.js .
COPY --chown=circleci:circleci tailwind.config.js .

# Ustawienie zmiennych środowiskowych
ENV NODE_ENV=development
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=localhost
ENV PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
ENV REACT_APP_CLOUDFRONT_DOMAIN_NAME_POSTS=your_cloudfront_domain
ENV REACT_APP_CLOUDFRONT_DOMAIN_NAME_AVATARS=your_cloudfront_domain

# Eksponowanie portu dla Metro bundler
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Komenda startowa
CMD ["npm", "start"] 