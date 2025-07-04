import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import moment from "moment";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";

import { BASE_URL } from "../../utils/config";
import { getProgramOptions } from "../../constants/programasPorNivel";
import { opcionesInvito } from "../../constants/opcionesInvito";
import { getEventoSeleccionado } from "../../utils/storage";

const limpiarTexto = (texto) =>
  texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toUpperCase();

const registerModule = () => {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nivelEstudios, setNivelEstudios] = useState("");
  const [nombreInvito, setNombreInvito] = useState("");
  const [alumno, setAlumno] = useState("");
  const [tipo] = useState("SESIÓN INFORMATIVA");
  const [escProc, setEscProc] = useState("");
  const [nivelUninter, setNivelUninter] = useState("");
  const [programaInteres, setProgramaInteres] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errores, setErrores] = useState({});

  const validar = () => {
    const newErrors = {};
    if (!telefono.trim() || telefono.length !== 10) newErrors.telefono = true;
    if (!nombre.trim()) newErrors.nombre = true;
    if (!programaInteres.trim()) newErrors.programaInteres = true;
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validar();
    setErrores(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Toast.show({
        type: "error",
        text1: "Campos inválidos",
        text2: "Revisa los campos marcados.",
      });
      return;
    }

    setLoading(true);
    try {
      const conferencista = await getEventoSeleccionado();
      if (!conferencista) throw new Error("No hay evento seleccionado.");

      const payload = {
        nombre: limpiarTexto(nombre),
        correo: correo.trim().toLowerCase(),
        telefono: telefono.trim(),
        Nivel_Estudios: nivelEstudios,
        Conferencista: conferencista,
        Nombre_invito: nombreInvito,
        fecha_registro: moment().toISOString(),
        alumno,
        tipo,
        escProc: limpiarTexto(escProc),
        NivelUninter: nivelUninter,
        programaInteres,
        asistio: "SI",
      };

      const response = await fetch(
        `${BASE_URL}/registros/create?conferencista=${encodeURIComponent(conferencista)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          limpiarCampos();
          router.replace("/(tabs)/home");
        }, 2000);
      } else {
        Toast.show({ type: "error", text1: "Error al crear el registro" });
      }
    } catch (error) {
      console.error("Error:", error);
      Toast.show({ type: "error", text1: "Error en la solicitud" });
    } finally {
      setLoading(false);
    }
  };

  const limpiarCampos = () => {
    setNombre("");
    setCorreo("");
    setTelefono("");
    setNivelEstudios("");
    setNombreInvito("");
    setAlumno("");
    setEscProc("");
    setNivelUninter("");
    setProgramaInteres("");
  };

  const cancelarRegistro = () => {
    limpiarCampos();
    router.replace("/(tabs)/home");
  };

  return (
    <>
      <ImageBackground source={require("../../assets/images/banner.jpg")} style={styles.background}>
        <ScrollView contentContainerStyle={styles.container}>
          {showSuccess ? (
            <LottieView
              source={require("../../assets/animations/success.json")}
              autoPlay
              loop={false}
              style={{ width: 200, height: 200, alignSelf: "center" }}
            />
          ) : (
            <>
              <Image source={require("../../assets/images/uninterlogo.png")} style={styles.logo} />
              <Text style={styles.header}>Nuevo Registro</Text>

              <View style={styles.infoBox}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  style={[styles.input, errores.nombre && styles.inputError]}
                  value={nombre}
                  onChangeText={setNombre}
                  onEndEditing={(e) => setNombre(limpiarTexto(e.nativeEvent.text))}
                  placeholder="Nombre completo"
                />
                {errores.nombre && <Text style={styles.errorText}>Nombre obligatorio</Text>}
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.label}>Correo</Text>
                <TextInput
                  style={styles.input}
                  value={correo}
                  onChangeText={setCorreo}
                  placeholder="Correo electrónico"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={[styles.input, errores.telefono && styles.inputError]}
                  value={telefono}
                  onChangeText={(text) => setTelefono(text.replace(/[^0-9]/g, "").slice(0, 10))}
                  keyboardType="phone-pad"
                  placeholder="10 dígitos"
                />
                {errores.telefono && <Text style={styles.errorText}>Teléfono inválido</Text>}
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.label}>Nivel de Estudios</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={nivelEstudios}
                    onValueChange={(itemValue) => {
                      setNivelEstudios(itemValue);
                      setProgramaInteres("");
                    }}
                  >
                    <Picker.Item label="SELECCIONA UNA OPCIÓN" value="" />
                    <Picker.Item label="SECUNDARIA" value="SECUNDARIA" />
                    <Picker.Item label="BACHILLERATO" value="BACHILLERATO" />
                    <Picker.Item label="UNIVERSIDAD" value="UNIVERSIDAD" />
                    <Picker.Item label="POSGRADO" value="POSGRADO" />
                  </Picker>
                </View>
              </View>

              {nivelEstudios !== "" && (
                <View style={styles.infoBox}>
                  <Text style={styles.label}>Programa de Interés</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={programaInteres}
                      onValueChange={setProgramaInteres}
                    >
                      <Picker.Item label="SELECCIONA UNA OPCIÓN" value="" />
                      {getProgramOptions(nivelEstudios).map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                      ))}
                    </Picker>
                  </View>
                  {errores.programaInteres && <Text style={styles.errorText}>Programa obligatorio</Text>}
                </View>
              )}

              <View style={styles.infoBox}>
                <Text style={styles.label}>Escuela de Procedencia</Text>
                <TextInput
                  style={styles.input}
                  value={escProc}
                  onChangeText={setEscProc}
                  onEndEditing={(e) => setEscProc(limpiarTexto(e.nativeEvent.text))}
                  placeholder="Nombre de la escuela"
                />
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.label}>¿Eres alumno Uninter?</Text>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={alumno} onValueChange={setAlumno}>
                    <Picker.Item label="SELECCIONA UNA OPCIÓN" value="" />
                    <Picker.Item label="SI" value="SI" />
                    <Picker.Item label="NO" value="NO" />
                  </Picker>
                </View>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.label}>¿Quién te invitó?</Text>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={nombreInvito} onValueChange={setNombreInvito}>
                    <Picker.Item label="SELECCIONA UNA OPCIÓN" value="" />
                    {opcionesInvito.map(({ label, value }) => (
                      <Picker.Item key={value} label={label} value={value} />
                    ))}
                  </Picker>
                </View>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Registrando..." : "Registrar"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#6c757d" }]}
                onPress={cancelarRegistro}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </ImageBackground>
    </>
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
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 20,
    textAlign: "center",
  },
  infoBox: {
    marginBottom: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    borderColor: "#dee2e6",
    borderWidth: 1,
    elevation: 1,
  },
  label: {
    fontSize: 16,
    color: "#495057",
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    height: 40,
    borderColor: "#dee2e6",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    color: "#343a40",
    fontSize: 14,
  },
  inputError: {
    borderColor: "#dc3545",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 2,
  },
  pickerContainer: {
    borderWidth: 0,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    height: 40,
    paddingHorizontal: 10,
    elevation: 2,
  },
  button: {
    marginTop: 15,
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default registerModule;
