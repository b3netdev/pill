import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AdBanner from '../components/AdBanner';

const CholesterolCalculatorScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [totalCholesterol, setTotalCholesterol] = useState('');
  const [hdlCholesterol, setHdlCholesterol] = useState('');
  const [ldlCholesterol, setLdlCholesterol] = useState('');
  const [triglycerides, setTriglycerides] = useState('');

  const calculateCholesterol = () => {
    if (!totalCholesterol || !hdlCholesterol || !ldlCholesterol || !triglycerides) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }

    const totalResult = `${totalCholesterol} mg/dL`;
    const hdlResult = `${hdlCholesterol} mg/dL`;
    const ldlResult = `${ldlCholesterol} mg/dL`;
    const triglycerideResult = `${triglycerides} mg/dL`;

    const ratio = (parseFloat(totalCholesterol) / parseFloat(hdlCholesterol)).toFixed(2);
    const ratioResult = `${ratio} (Ratio)`;

    navigation.navigate('CholesterolResult', {
      totalCholesterolResult: totalResult,
      ldlCholesterolResult: ldlResult,
      hdlCholesterolResult: hdlResult,
      triglycerideResult: triglycerideResult,
      ratioResult: ratioResult,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Cholesterol Calculator</Text>

      <InputField
        label="Total Cholesterol (mg/dL)"
        placeholder="Enter total cholesterol"
        value={totalCholesterol}
        onChangeText={setTotalCholesterol}
      />
      <InputField
        label="HDL Cholesterol (mg/dL)"
        placeholder="Enter HDL cholesterol"
        value={hdlCholesterol}
        onChangeText={setHdlCholesterol}
      />
      <InputField
        label="LDL Cholesterol (mg/dL)"
        placeholder="Enter LDL cholesterol"
        value={ldlCholesterol}
        onChangeText={setLdlCholesterol}
      />
      <InputField
        label="Triglycerides (mg/dL)"
        placeholder="Enter triglycerides"
        value={triglycerides}
        onChangeText={setTriglycerides}
      />

      <TouchableOpacity style={styles.button} onPress={calculateCholesterol}>
        <Text style={styles.buttonText}>Calculate Cholesterol</Text>
      </TouchableOpacity>
    </ScrollView>
    <AdBanner />
    </View>
  );
};

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      keyboardType="numeric"
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  </View>
);

export default CholesterolCalculatorScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#16ABFF',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
