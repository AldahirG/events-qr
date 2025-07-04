import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: 'QrApp',
  slug: 'QrApp',
  scheme: 'QrApp',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#4B9CD3',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    package: 'com.aldahirg.QrApp',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/images/uninterlogoicon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  extra: {
    BASE_URL: process.env.BASE_URL,
    eas: {
      projectId: '9d7dac40-ae38-4c6e-bd37-be8e70470483',
    },
  },
  plugins: [
    [
      'expo-camera',
      {
        cameraPermission: 'Permite que QrApp acceda a la cámara',
        microphonePermission: 'Permite que QrApp acceda al micrófono',
        recordAudioAndroid: false,
      },
    ],
    'expo-router',
    'expo-web-browser',
  ],
});
