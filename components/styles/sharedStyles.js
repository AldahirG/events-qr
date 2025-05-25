// sharedStyles.js
import { StyleSheet } from 'react-native';

export const getSharedStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    title: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
    },
  });
