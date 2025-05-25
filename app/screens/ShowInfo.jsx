import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MotiView } from "moti";

import { BASE_URL } from '../../utils/config';
import { getEventoSeleccionado } from '../../utils/storage';
import { useThemeColors } from '../../theme/colors';
import { opcionesInvito } from '../../constants/opcionesInvito';


const ShowInfo = ({ route }) => {
  const { data } = route.params;
  const navigation = useNavigation();
  const colors = useThemeColors();

  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState(data.nombre || "");
  const [correo, setCorreo] = useState(data.correo || "");
  const [telefono, setTelefono] = useState(data.telefono || "");
  const [nivelEstudios] = useState(data.Nivel_Estudios || "");
  const [nombreInvito, setNombreInvito] = useState(data.Nombre_invito || "");
  const [escProc, setEscProc] = useState(data.escProc || "");
  const [programaInteres, setProgramaInteres] = useState(data.programaInteres || "");
  const [asistio, setAsistio] = useState(data.asistio || "NO");
  const [errores, setErrores] = useState({});

  const confirmAttendance = async () => {
    setLoading(true);
    setErrores({});
    try {
      const conferencista = await getEventoSeleccionado();
      if (!conferencista) throw new Error("No hay evento seleccionado");

      const newErrors = {};
      if (!nombre.trim()) newErrors.nombre = true;
      if (!telefono.trim()) newErrors.telefono = true;

      if (correo.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo.trim())) {
          newErrors.correo = true;
          Toast.show({
            type: "error",
            text1: "Correo inválido",
            text2: "Introduce un correo válido.",
          });
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrores(newErrors);
        Toast.show({
          type: "error",
          text1: "Faltan campos obligatorios",
          text2: "Nombre y teléfono son requeridos.",
        });
        return;
      }

      const response = await fetch(
       `${BASE_URL}/registros/${data.idregistro_conferencias}?conferencista=${encodeURIComponent(conferencista)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            correo,
            telefono,
            Nivel_Estudios: nivelEstudios,
            Nombre_invito: nombreInvito,
            escProc: escProc.toUpperCase(),
            programaInteres,
            asistio,
          }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el registro.");

      Toast.show({
        type: "success",
        text1: "Actualización exitosa",
        text2: "El registro fue actualizado correctamente.",
      });

      setTimeout(() => navigation.navigate("Home"), 2000);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const animatedInput = (child, index) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 80, type: "timing" }}
      key={index}
    >
      {child}
    </MotiView>
  );

  return (
    <ImageBackground
      source={require("../../assets/images/banner.jpg")}
      style={styles.background}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      >
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 100 }}>
          <Text style={[styles.header, { color: colors.primary }]}>
            Información de Registro
          </Text>
        </MotiView>

        {animatedInput(<InfoBox label="Nombre" value={nombre} editable={false} />, 0)}
        {animatedInput(
          <InfoBox
            label="Correo"
            value={correo}
            onChangeText={setCorreo}
            error={errores.correo}
          />,
          1
        )}
        {animatedInput(
          <InfoBox
            label="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            error={errores.telefono}
          />,
          2
        )}
        {animatedInput(<InfoBox label="Nivel de Estudios" value={nivelEstudios} editable={false} />, 3)}
        {animatedInput(
          <InfoBox
            label="Escuela de Procedencia"
            value={escProc}
            onChangeText={(v) => setEscProc(v.toUpperCase())}
          />,
          4
        )}
        {animatedInput(
          <InfoBox
            label="Programa de Interés"
            value={programaInteres}
            onChangeText={setProgramaInteres}
          />,
          5
        )}

        {animatedInput(
          <>
            <Text style={[styles.label, { color: colors.text }]}>¿Quién te invitó?</Text>
            <View style={[styles.pickerContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Picker selectedValue={nombreInvito} onValueChange={setNombreInvito} style={{ color: colors.text }}>
                {opcionesInvito.map((item) => (
                  <Picker.Item key={item.value} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View>
          </>,
          6
        )}

        {animatedInput(
          <>
            <Text style={[styles.label, { color: colors.text }]}>¿Asistió?</Text>
            <View style={[styles.pickerContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Picker selectedValue={asistio} onValueChange={setAsistio} style={{ color: colors.text }}>
                <Picker.Item label="SI" value="SI" />
                <Picker.Item label="NO" value="NO" />
              </Picker>
            </View>
          </>,
          7
        )}

        {animatedInput(
          <TouchableOpacity
            style={[styles.button, { backgroundColor: loading ? colors.disabled : colors.primary }]}
            onPress={confirmAttendance}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="check" size={18} color="#fff" style={{ marginRight: 5 }} />
                <Text style={styles.buttonText}>Confirmar asistencia</Text>
              </View>
            )}
          </TouchableOpacity>,
          8
        )}

        {animatedInput(
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.error }]}
            onPress={() => navigation.navigate("List")}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>,
          9
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const InfoBox = ({ label, value, onChangeText, editable = true, error = false }) => {
  const colors = useThemeColors();
  return (
    <View style={styles.infoBox}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: error ? colors.error : colors.border,
            backgroundColor: colors.card,
            color: colors.text,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    width: "100%",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  infoBox: {
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  pickerContainer: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    marginBottom: 12,
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ShowInfo;