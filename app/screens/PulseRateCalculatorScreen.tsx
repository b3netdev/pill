import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AdBanner from '../components/AdBanner';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PulseRateCalculator'>;

const PulseRateCalculatorScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [gender, setGender] = useState<'Child' | 'Male' | 'Female' | null>(null);
  const [age, setAge] = useState('');
  const [pulseRate, setPulseRate] = useState('');

  const getAgeOptions = () => {
    let maxAge = 100;
    if (gender === 'Child') maxAge = 12;
    else if (gender === 'Male' || gender === 'Female') maxAge = 100;
  
    return Array.from({ length: maxAge }, (_, i) => ({
      value: `${i + 1}`,
      display: `${i + 1} years`,
    }));
  };
  

  const calculatePulseRate = () => {
    if (!gender || !age || !pulseRate) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }

    const plusRate = parseInt(pulseRate, 10);
    const result =
      plusRate < 60 ? 'Low Pulse Rate' : plusRate > 100 ? 'High Pulse Rate' : 'Normal Pulse Rate';
    const bgcolor =
      plusRate < 60 ? '#FF6347' : plusRate > 100 ? '#FFA500' : '#32CD32';

    navigation.navigate('PulseRateResult', {
      plusrate: pulseRate,
      result,
      bgcolor,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Pulse Rate Calculator</Text>

      {/* Gender */}
      <Text style={styles.label}>Gender</Text>
      <View style={styles.radioGroup}>
        {['Child', 'Male', 'Female'].map((val) => (
          <TouchableOpacity
            key={val}
            style={[styles.radioItem, gender === val && styles.radioSelected]}
            onPress={() => setGender(val as 'Child' | 'Male' | 'Female')}
          >
            <Text style={styles.radioText}>{val}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Age Picker */}
      {gender && (
        <>
          <Text style={styles.label}>Age</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={age} onValueChange={setAge} style={styles.picker}>
              <Picker.Item label="Select Age" value="" />
              {getAgeOptions().map((option) => (
                <Picker.Item key={option.value} label={option.display} value={option.value} />
              ))}
            </Picker>
          </View>
        </>
      )}

      {/* Pulse Rate Input */}
      <Text style={styles.label}>Pulse Rate (BPM)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter your pulse rate"
        value={pulseRate}
        onChangeText={setPulseRate}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={calculatePulseRate}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
    <AdBanner />
    </View>
  );
};

export default PulseRateCalculatorScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  radioItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  radioSelected: {
    backgroundColor: '#16ABFF',
    borderColor: '#16ABFF',
  },
  radioText: {
    color: '#000',
    fontWeight: '500',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 200 : 50,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  submitBtn: {
    backgroundColor: '#16ABFF',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
