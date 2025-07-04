import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Linking,
  ScrollView,
} from 'react-native';
import { getEventoSeleccionado } from '../../utils/storage';
import { BASE_URL } from '../../utils/config';
import ReportTable from '../../components/ReportTable';

const Assistences = () => {
  const [assistances, setAssistances] = useState([]);
  const [confirmedAssistances, setConfirmedAssistances] = useState([]);
  const [assistancesByPrograma, setAssistancesByPrograma] = useState([]);
  const [confirmedAssistancesByPrograma, setConfirmedAssistancesByPrograma] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const conferencista = await getEventoSeleccionado();
      if (!conferencista) return;
      setEventoSeleccionado(conferencista);

      const endpoints = [
        { url: '/estadisticas/nombre-invito', setter: setAssistances },
        { url: '/estadisticas/nombre-invito/confirmados', setter: setConfirmedAssistances },
        { url: '/estadisticas/programa-interes', setter: setAssistancesByPrograma },
        { url: '/estadisticas/programa-interes/confirmados', setter: setConfirmedAssistancesByPrograma },
      ];

      for (const { url, setter } of endpoints) {
        const response = await fetch(
          `${BASE_URL}/registros${url}?conferencista=${encodeURIComponent(conferencista)}`
        );
        const data = await response.json();
        setter(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    if (!eventoSeleccionado) return;
    const url = `${BASE_URL}/registros/export/excel?conferencista=${encodeURIComponent(eventoSeleccionado)}`;
    Linking.openURL(url);
  };

  const renderFooter = (data) => {
    const total = Array.isArray(data)
      ? data.reduce((acc, item) => acc + (Number(item.cantidad_registros || item.total) || 0), 0)
      : 0;
    return (
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Total</Text>
        <Text style={styles.footerTextRight}>{total}</Text>
      </View>
    );
  };

  const renderRow = (labelKey, valueKey = 'total') => ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item[labelKey] || 'Sin dato'}</Text>
      <Text style={[styles.cell, styles.cellRight]}>{item[valueKey]}</Text>
    </View>
  );

  return (
    <ImageBackground source={require('../../assets/images/banner.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Reportes</Text>

        <TouchableOpacity style={styles.button} onPress={fetchData} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Buscar'}</Text>
        </TouchableOpacity>

        <ReportTable
          title="Asistencias por Invitador"
          data={assistances}
          renderItem={renderRow('Nombre_invito')}
          renderFooter={() => renderFooter(assistances)}
        />

        <ReportTable
          title="Asistencias Confirmadas"
          data={confirmedAssistances}
          renderItem={renderRow('Nombre_invito')}
          renderFooter={() => renderFooter(confirmedAssistances)}
        />

        <ReportTable
          title="Asistencias por Programa"
          data={assistancesByPrograma}
          renderItem={renderRow('programaInteres')}
          renderFooter={() => renderFooter(assistancesByPrograma)}
        />

        <ReportTable
          title="Asistencias Confirmadas por Programa"
          data={confirmedAssistancesByPrograma}
          renderItem={renderRow('programaInteres', 'total')}
          renderFooter={() => renderFooter(confirmedAssistancesByPrograma)}
          emptyMessage="No hay asistencias confirmadas por programa disponibles."
        />

        <TouchableOpacity style={[styles.button, styles.exportButton]} onPress={downloadExcel}>
          <Text style={styles.buttonText}>Exportar a Excel</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  exportButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  cell: {
    flex: 1,
    textAlign: 'left',
    color: '#495057',
    fontSize: 14,
  },
  cellRight: {
    textAlign: 'right',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    backgroundColor: '#e9ecef',
  },
  footerText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#212529',
  },
  footerTextRight: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#212529',
  },
});

export default Assistences;
