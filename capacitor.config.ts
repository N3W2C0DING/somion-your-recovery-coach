import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.somion.coach",
  appName: "Somion",
  webDir: "dist",
  server: {
    androidScheme: "https",
    iosScheme: "https",
  },
  ios: {
    scheme: "Somion",
    contentInset: "always",
    preferredContentMode: "mobile",
    backgroundColor: "#0a1020",
  },
  plugins: {
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#0a1020",
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1500,
      backgroundColor: "#0a1020",
      showSpinner: false,
    },
  },
};

export default config;
