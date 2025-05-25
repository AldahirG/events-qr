// components/ScannerOverlay.jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ScannerOverlay({ color = '#007bff' }) {
  return <View style={[styles.overlay, { borderColor: color }]} />;
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderWidth: 3,
    borderRadius: 12,
    zIndex: 10,
  },
});
