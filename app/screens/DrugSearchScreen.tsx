import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import AdBanner from '../components/AdBanner';


const DrugSearchScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [selectOption, setSelectOption] = useState<'b' | 'g'>('b');
  const [drugname, setDrugname] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string;}[]>([]);

  const optionActive = (option: 'b' | 'g') => {
    setSelectOption(option);
    setDrugname('');
    setSuggestions([]);
  };

 

  const fetchSuggestions = async (text: string) => {
    setDrugname(text);
    if (text.length > 2) {
      try {
        const formData = `action=auto_popup_array&med_type=${encodeURIComponent(selectOption)}&keyword=${encodeURIComponent(text)}`;

        const res = await fetch('https://www.mobixed.com/apps/drug-fda/ajax.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
        });
        const dataHtml = await res.json();
        console.log('Autocomplete data:', dataHtml);
        if (!dataHtml || typeof dataHtml !== 'object') {
            setSuggestions([]);
            return;
          }
          const results = (Object.values(dataHtml) as string[]).map((name) => ({
            name,
          }));
          
          setSuggestions(results);
      } catch (e) {
        console.error('Autocomplete fetch failed:', e);
        setSuggestions([]);
      }
    } else {
        setSuggestions([]);
    }
  };

  const clearInput = () => {
    setDrugname('');
    setSuggestions([]);
  };

  const handleDrugClick = (drug: string) => {
    if (!drug) return;
    navigation.navigate('DrugDetails', {
      drugName: drug,
      data: { name: drug, labeler: '', mpc_imprint: '' },
    });
  };

  const searchNow = () => {
    if (drugname.trim() === '') {
      Alert.alert('Please enter a drug name');
    } else {
      handleDrugClick(drugname.trim());
    }
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      <Image source={require('../assets/images/drugbanner.png')} style={styles.banner} />

      <Text style={styles.heading}>Comprehensive Drug Information Search</Text>
      <Text style={styles.subheading}>Find detailed data on medications quickly and accurately.</Text>

      <Text style={styles.optionLabel}>Select Option</Text>
      <View style={styles.optionRow}>
        <TouchableOpacity
          onPress={() => optionActive('b')}
          style={[styles.optionBtn, selectOption === 'b' && styles.optionActive]}
        >
          <Text style={styles.optionText}>Brand Name</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => optionActive('g')}
          style={[styles.optionBtn, selectOption === 'g' && styles.optionActive]}
        >
          <Text style={styles.optionText}>Generic Name</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Enter drug name..."
          style={styles.input}
          value={drugname}
          onChangeText={fetchSuggestions}
        />
        {drugname.length > 0 && (
          <TouchableOpacity onPress={clearInput} style={styles.clearBtn}>
            <Text style={styles.clearIcon}>✖</Text>
          </TouchableOpacity>
        )}
      </View>

      
      {suggestions ? (
        <TouchableOpacity
          style={styles.suggestionBox}
          onPress={() => handleDrugClick(drugname)}
        >
          {suggestions.map((suggestion, index) => (
            <Text style={styles.suggestionText} key={index}>{suggestion.name}</Text>
          ))}
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity onPress={searchNow} style={styles.searchBtn}>
        <Text style={styles.searchText}>Search Now</Text>
      </TouchableOpacity>
    </ScrollView>
    <AdBanner/>
    </View>
  );
};

export default DrugSearchScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  banner: { width: '100%', height: 160, resizeMode: 'contain', marginBottom: 12 },
  heading: { fontSize: 19, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  subheading: { textAlign: 'center', color: '#666', marginBottom: 20 },
  optionLabel: { fontWeight: '600', marginBottom: 6 },
  optionRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  optionBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  optionActive: { backgroundColor: '#16ABFF' },
  optionText: { color: '#000' },
  inputWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  clearBtn: {
    position: 'absolute',
    right: 12,
    top: 7,
  },
  clearIcon: { fontSize: 18, color: '#888' },
  suggestionBox: {
    backgroundColor: '#75bff2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
    suggestionText: {
        fontSize: 16,
        color: '#fff',
        marginVertical: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        paddingBottom: 5,
        elevation: 1,
        backgroundColor: '#75bff2',
        borderRadius: 6,
        paddingLeft: 10,

    },
  searchBtn: {
    backgroundColor: '#16ABFF',
    padding: 14,
    borderRadius: 6,
    marginTop: 10,
  },
  searchText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
