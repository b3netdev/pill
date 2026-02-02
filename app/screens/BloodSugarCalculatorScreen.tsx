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

const BloodSugarCalculatorScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [bloodSugarLevel, setBloodSugarLevel] = useState('');
  const [measurementTime, setMeasurementTime] = useState('');

  const evaluateResult = (level: number, time: string) => {
    if (time === 'fasting') {
      if (level < 70) return { result: 'Low (Hypoglycemia)', color: '#f08080' };
      if (level <= 99) return { result: 'Normal', color: '#a5bd4c' };
      if (level <= 125) return { result: 'Pre-diabetes', color: '#f9ccac' };
      return { result: 'Diabetes', color: '#ff7373' };
    } else {
      if (level < 140) return { result: 'Normal', color: '#a5bd4c' };
      if (level <= 199) return { result: 'Pre-diabetes', color: '#f9ccac' };
      return { result: 'Diabetes', color: '#ff7373' };
    }
  };

  const calculateBloodSugar = () => {
    if (!bloodSugarLevel || !measurementTime) {
      Alert.alert('Missing Input', 'Please enter both blood sugar level and measurement time.');
      return;
    }

    const level = parseFloat(bloodSugarLevel);
    if (isNaN(level)) {
      Alert.alert('Invalid Input', 'Please enter a valid number for blood sugar level.');
      return;
    }

    const { result, color } = evaluateResult(level, measurementTime);

    navigation.navigate('BloodSugarResult', {
      sugerlavel: `${level} mg/dL`,
      resultval: result,
      bgcolor: color,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Blood Sugar Calculator</Text>

      {/* Blood Sugar Input */}
      <Text style={styles.label}>Blood Sugar Level (mg/dL)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter blood sugar level"
        value={bloodSugarLevel}
        onChangeText={setBloodSugarLevel}
      />

      {/* Measurement Time Dropdown */}
      <Text style={styles.label}>Measurement Time</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={measurementTime}
          onValueChange={(value) => setMeasurementTime(value)}
        >
          <Picker.Item label="Select Measurement Time" value="" />
          <Picker.Item label="Fasting" value="fasting" />
          <Picker.Item label="Post-Meal" value="post-meal" />
        </Picker>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={calculateBloodSugar}>
        <Text style={styles.buttonText}>Calculate Blood Sugar</Text>
      </TouchableOpacity>
    </ScrollView>
    <AdBanner />
    </View>
  );
};

export default BloodSugarCalculatorScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '600',
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
    marginBottom: 16,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#16ABFF',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});