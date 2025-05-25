import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet, ImageBackground, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../utils/config';  // Importar la URL base desde config.js

const Login = ({ navigation }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!user || !password) {
      Toast.show({
        type: 'error',
        text1: 'Campos vacíos',
        text2: 'Por favor, llena todos los campos.',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, password }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        Toast.show({
          type: 'success',
          text1: 'Login Exitoso',
        });
        navigation.navigate('Main');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error en el login',
          text2: data.message || 'Revisa tus credenciales',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error en el servidor',
        text2: 'Hubo un problema en la conexión',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/banner.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Halloween Fest Logo */}
        <Image
          source={require('../../assets/images/HF-LOGO-2024.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Gestión de Asistentes a Eventos</Text>
        <View style={styles.inputContainer}>
          <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            value={user}
            onChangeText={setUser}
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
        </View>
        <Pressable>
          <Text style={styles.forgotPassword}>Ingresa los Datos Para Continuar</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </Pressable>
        <Toast />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#53103c', // Container background color
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '85%',
  },
  logo: {
    width: 250,
    height: 150,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
  },
  input: {
    flex: 1,
    padding: 10,
    color: '#333',
  },
  inputIcon: {
    marginRight: 10,
  },
  forgotPassword: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8a2466', // Button color
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Login;
