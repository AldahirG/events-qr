import React from 'react';
import { Portal, Dialog, Button, Paragraph } from 'react-native-paper';

export default function ConfirmDialog({ visible, onDismiss, onConfirm, message }) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Content>
          <Paragraph>{message}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button onPress={onConfirm}>Aceptar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
