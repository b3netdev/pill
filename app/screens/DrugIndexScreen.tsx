import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AdBanner from '../components/AdBanner';
import { useInterstitialAd } from '../components/InterstitialAdManager';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
type DrugIndexScreenProps = {
  navigation: NavigationProps;
};


const DrugIndexScreen: React.FC = () => {
  // Initialize interstitial ad
  const { showAd } = useInterstitialAd();
    const navigation = useNavigation<NavigationProps>();

  const [selectOption, setSelectOption] = useState<'b' | 'g'>('b');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleOptionChange = (option: 'b' | 'g') => {
    setSelectOption(option);
  };

  const drugIndexGet = (letter: string) => {
    // Show interstitial ad before navigating
    showAd();
    // Pass the letter and selected option (brand/generic) to next screen
    navigation.navigate('DrugIndexList', {
      letter,
      type: selectOption,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView style={styles.container}>

      <View style={styles.optionContainer}>
        <Text style={styles.optionLabel}>Select Options</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => handleOptionChange('b')}
            style={[styles.optionButton, selectOption === 'b' && styles.activeButton]}
          >
            <Text style={styles.optionText}>Brand Name</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleOptionChange('g')}
            style={[styles.optionButton, selectOption === 'g' && styles.activeButton]}
          >
            <Text style={styles.optionText}>Generic Name</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.letterBox}>
        {alphabet.map(letter => (
          <TouchableOpacity
            key={letter}
            style={styles.letter}
            onPress={() => drugIndexGet(letter)}
          >
            <Text style={styles.letterText}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
    <AdBanner />
    </View>
  );
};

export default DrugIndexScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
  },
  optionContainer: { marginBottom: 20 },
  optionLabel: { 
    fontSize: 18,
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
 },
  buttonRow: { flexDirection: 'row', gap: 10 },
  optionButton: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#16ABFF',
  },
  optionText: { fontSize: 16, fontWeight: '500', color: '#000' },
  letterBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  letter: {
    width: '12%',
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

  },
  letterText: { fontWeight: 'bold', color: '#333' },
});
