import React from 'react';
import { Card, Text, Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default function EventoCard({ nombre, onSelect }) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">{nombre}</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={onSelect}>
          Seleccionar
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
});
