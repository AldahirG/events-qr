import { useColorScheme } from 'react-native';

export const lightColors = {
  mode: 'light',
  primary: '#007bff',
  secondary: '#6c757d',
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#343a40',
  mutedText: '#6c757d',
  border: '#dee2e6',
  header: '#e9ecef',
  placeholder: '#adb5bd',
};

export const darkColors = {
  mode: 'dark',
  primary: '#0d6efd',
  secondary: '#adb5bd',
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  mutedText: '#ced4da',
  border: '#333',
  header: '#1c1c1c',
  placeholder: '#6c757d',
};

export const useThemeColors = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
};
