import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { BASE_URL } from '../../utils/config.js';
import { getEventoSeleccionado } from '../../utils/storage';
import { useThemeColors } from '../../theme/colors';


const List = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const colors = useThemeColors();

  useEffect(() => {
    fetchUsers();
      console.log('BASE_URL ACTUAL:', BASE_URL);

  }, []);

  const normalizeText = (text) => {
    return text
      ? text.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      : '';
  };

  const fetchUsers = async () => {
    try {
      const conferencista = await getEventoSeleccionado();
      if (!conferencista) return;

      const response = await fetch(
        `${BASE_URL}/registros?conferencista=${encodeURIComponent(conferencista)}`
      );

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filteredUsers = users.filter((user) =>
    normalizeText(user?.nombre).includes(normalizeText(search))
  );

  return (
    <ImageBackground
      source={require('../../assets/images/banner.jpg')}
      style={[styles.background, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.header, { color: colors.text }]}>Registros</Text>

        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.mutedText} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar usuarios"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={colors.placeholder}
          />
        </View>

        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.primary }]}
          onPress={fetchUsers}
        >
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>

        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <TouchableOpacity
              key={user.idregistro_conferencias}
              style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigation.navigate('ShowInfo', { data: user })}
            >
              <Text style={[styles.userName, { color: colors.text }]}>
                {user?.nombre?.trim() || 'Sin nombre'}
              </Text>
              <Text style={[styles.userDetails, { color: colors.mutedText }]}>
                {user?.telefono || 'Sin teléfono'} • {user?.correo?.toLowerCase() || 'Sin correo'}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={[styles.noResultsText, { color: colors.mutedText }]}>
            No se encontraron usuarios
          </Text>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    fontSize: 14,
  },
  searchButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userCard: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userDetails: {
    fontSize: 14,
    marginTop: 4,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default List;
