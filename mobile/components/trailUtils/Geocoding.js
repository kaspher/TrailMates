import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '@env';

const getAddressFromCoordinates = async (longitude, latitude) => {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${PUBLIC_MAPBOX_ACCESS_TOKEN}&language=pl`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      let street = null;
      let city = null;

      data.features.forEach((feature) => {
        if (
          feature.place_type.includes("address") ||
          feature.place_type.includes("street")
        ) {
          street = feature.text;
        }
        if (feature.place_type.includes("place")) {
          city = feature.text;
        }
      });

      if (!street && data.features[0]) {
        street = data.features[0].text;
      }

      if (!city && data.features[0].context) {
        const cityContext = data.features[0].context.find((item) =>
          item.id.startsWith("place")
        );
        if (cityContext) {
          city = cityContext.text;
        }
      }

      const result = {
        street: street || 'Nieznana ulica',
        city: city || 'Nieznane miasto'
      };
      return result;
    }
    return {
      street: 'Nieznana ulica',
      city: 'Nieznane miasto'
    };
  } catch (error) {
    return {
      street: 'Nieznana ulica',
      city: 'Nieznane miasto'
    };
  }
};

export { getAddressFromCoordinates }; 