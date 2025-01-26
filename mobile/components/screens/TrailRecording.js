const startTracking = async () => {
  if (location) {
    try {
      setCoordinates([]);

      await Location.startLocationUpdatesAsync(BACKGROUND_TRACKING_TASK, {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5,
        timeInterval: 3000,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "Nagrywanie trasy",
          notificationBody: "Trasa jest nagrywana w tle",
          notificationColor: "#386641",
        },
        pausesUpdatesAutomatically: false,
        activityType: Location.ActivityType.Fitness,
        deferredUpdatesInterval: 3000,
        deferredUpdatesDistance: 5,
      });

      global.setCoordinates = setCoordinates;

      setIsTracking(true);
      setRecordingStartTime(new Date().getTime());
      setCoordinates([{
        order: 1,
        latitude: location.latitude,
        longitude: location.longitude
      }]);
    } catch (error) {
      console.error('Błąd startowania śledzenia:', error);
      setAlertMessage('Nie można rozpocząć śledzenia');
    }
  } else {
    setAlertMessage('Nie można rozpocząć nagrywania - brak lokalizacji');
  }
}; 