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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AdBanner from '../components/AdBanner';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BMICalculator'>;

const BMICalculatorScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [weightInPounds, setWeightInPounds] = useState('');
  const [heightInFeet, setHeightInFeet] = useState('');
  const [heightInInches, setHeightInInches] = useState('');

  const calculateBMI = () => {
    const weight = parseFloat(weightInPounds);
    const feet = parseFloat(heightInFeet);
    const inches = parseFloat(heightInInches);

    if (isNaN(weight) || isNaN(feet) || isNaN(inches)) {
      Alert.alert('Error', 'Please enter valid numbers for all fields.');
      return;
    }
    const totalInches = feet * 12 + inches;
    const calculatedBMI = (weight / (totalInches * totalInches)) * 703;

    navigation.navigate('BMIResult', { bmi: parseFloat(calculatedBMI.toFixed(2)) });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>BMI Calculator</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Weight (lbs)</Text>
        <TextInput
          keyboardType="numeric"
          value={weightInPounds}
          onChangeText={setWeightInPounds}
          placeholder="Enter weight in pounds"
          style={styles.input}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Height</Text>
        <View style={styles.heightRow}>
          <TextInput
            keyboardType="numeric"
            value={heightInFeet}
            onChangeText={setHeightInFeet}
            placeholder="Feet"
            style={[styles.input, styles.inputHalf]}
          />
          <TextInput
            keyboardType="numeric"
            value={heightInInches}
            onChangeText={setHeightInInches}
            placeholder="Inches"
            style={[styles.input, styles.inputHalf]}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Calculate BMI</Text>
      </TouchableOpacity>
    </ScrollView>
    <AdBanner />
    </View>
  );
};

export default BMICalculatorScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 16,
  },
  heightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  inputHalf: {
    width: '48%',
  },
  button: {
    backgroundColor: '#16ABFF',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
