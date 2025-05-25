import AsyncStorage from '@react-native-async-storage/async-storage';

const EVENTO_KEY = 'eventoSeleccionado';

export const getEventoSeleccionado = async () => {
  try {
    const evento = await AsyncStorage.getItem(EVENTO_KEY);
    return evento || null;
  } catch (error) {
    console.error('Error al obtener evento seleccionado:', error);
    return null;
  }
};

export const setEventoSeleccionado = async (evento) => {
  try {
    await AsyncStorage.setItem(EVENTO_KEY, evento);
  } catch (error) {
    console.error('Error al guardar evento seleccionado:', error);
  }
};

export const clearEventoSeleccionado = async () => {
  try {
    await AsyncStorage.removeItem(EVENTO_KEY);
  } catch (error) {
    console.error('Error al limpiar evento seleccionado:', error);
  }
};
