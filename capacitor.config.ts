import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "br.com.sorocabarefrescos", //iOS
  // appId: 'br.com.mobiup.sorocabarefrescos', //Android
  appName: "Orbitta",
  webDir: "www",
  server: {
    androidScheme: "https",
    iosScheme: "https",
  },
  ios: {
    // contentInset: 'automatic',
  },
};

export default config;
