import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AdBanner from '../components/AdBanner';

const BloodPressureCalculatorScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [measurementTime, setMeasurementTime] = useState('');

  const evaluateResult = (sys: number, dia: number) => {
    if (sys < 80 || dia < 60) {
      return { result: 'Low Blood Pressure', advice: 'Consult a healthcare provider.', color: '#aad4f5' };
    } else if (sys <= 129 && dia <= 80) {
      return { result: 'Normal', advice: 'Keep up a healthy lifestyle.', color: '#a5bd4c' };
    } else if (sys <= 139 || dia <= 89) {
      return { result: 'High Normal', advice: 'Watch your lifestyle habits.', color: '#ffe082' };
    } else if (sys <= 159 || dia <= 99) {
      return { result: 'Hypertension Stage 1', advice: 'Consult your doctor.', color: '#ffb347' };
    } else if (sys <= 180 || dia <= 110) {
      return { result: 'Hypertension Stage 2', advice: 'Medical treatment likely required.', color: '#ff7373' };
    } else {
      return { result: 'Hypertensive Crisis', advice: 'Seek emergency care immediately.', color: '#d9534f' };
    }
  };

  const calculateBloodPressure = () => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);

    if (!sys || !dia || !measurementTime) {
      Alert.alert('Missing Input', 'Please enter all fields.');
      return;
    }

    const { result, advice, color } = evaluateResult(sys, dia);

    navigation.navigate('BloodPressureResult', {
      syscolic: `${sys}`,
      dycolic: `${dia}`,
      resultval: result,
      bgcolor: color,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Blood Pressure Calculator</Text>

      <Text style={styles.label}>Systolic Pressure (mm Hg)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={systolic}
        placeholder="Enter systolic pressure"
        onChangeText={setSystolic}
      />

      <Text style={styles.label}>Diastolic Pressure (mm Hg)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={diastolic}
        placeholder="Enter diastolic pressure"
        onChangeText={setDiastolic}
      />

      <Text style={styles.label}>Measurement Time</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={measurementTime}
          onValueChange={(val) => setMeasurementTime(val)}
        >
          <Picker.Item label="Select Measurement Time" value="" />
          <Picker.Item label="Morning" value="morning" />
          <Picker.Item label="Evening" value="evening" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={calculateBloodPressure}>
        <Text style={styles.buttonText}>Calculate Blood Pressure</Text>
      </TouchableOpacity>
    </ScrollView>
    <AdBanner />
    </View>
  );
};

export default BloodPressureCalculatorScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 20,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#16ABFF',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
