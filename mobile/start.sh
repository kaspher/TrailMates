#!/bin/bash

# Uruchom emulator w tle
emulator -avd Pixel_API_33 -no-audio -no-window &

# Poczekaj na uruchomienie emulatora
echo "Waiting for emulator to start..."
adb wait-for-device

# Uruchom expo
npm start 