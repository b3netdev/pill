import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AdBanner from '../components/AdBanner';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const DiseaseSearchScreen: React.FC = () => {
  const [disease, setDisease] = useState('');
  const navigation = useNavigation<NavigationProps>();

  const clearInput = () => setDisease('');

  const searchNow = () => {
    if (disease.trim() === '') {
      Alert.alert('Please enter a disease name');
      return;
    }
    navigation.navigate('DiseaseResults', {
      diseaseName: disease.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>Search diseases & conditions</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Enter disease name"
              value={disease}
              onChangeText={setDisease}
              style={styles.input}
            />
            {disease.length > 0 && (
              <TouchableOpacity onPress={clearInput} style={styles.clearBtn}>
                <Text style={styles.clearIcon}>✖</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.searchBtn} onPress={searchNow}>
            <Text style={styles.searchText}>Search Now</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* ✅ Banner Ad fixed to bottom */}
      <AdBanner />
    </KeyboardAvoidingView>
  );
};

export default DiseaseSearchScreen;


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    fontSize: 16,
  },
  clearBtn: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  clearIcon: {
    fontSize: 18,
    color: '#888',
  },
  searchBtn: {
    backgroundColor: '#16ABFF',
    padding: 14,
    borderRadius: 6,
  },
  searchText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
