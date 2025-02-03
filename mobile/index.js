import { registerRootComponent } from "expo";
import { PUBLIC_MAPBOX_ACCESS_TOKEN } from "@env";
import MapboxGL from "@rnmapbox/maps";

import App from "./App";

MapboxGL.setAccessToken(PUBLIC_MAPBOX_ACCESS_TOKEN);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
