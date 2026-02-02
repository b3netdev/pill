import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AdBanner from '../components/AdBanner';
import { SafeAreaView } from 'react-native-safe-area-context';

const popularImprints = [
  'M367', 'M365', 'AN 627', '2172', '2632 V', 'WATSON 853',
  'M 751', 'K 56', '30 M', '512', 'IP 109', '3604 V',
  'GG 249', 'A333', 'R180', 'A349', 'IP 204',
];

const ImprintSearchScreen: React.FC = () => {
  const [imprint, setImprint] = useState('');
  const [suggested, setSuggested] = useState<{ imprint: string; author: string }[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const navigation = useNavigation<any>();

  const fetchSuggestions = async (value: string) => {
    setImprint(value);
    if (value.length > 1) {
      try {
        const res = await fetch(`https://www.mobixed.com/apps/drug-fda/api/webapps.php?action=drug_full_auto_complete&limit=7&search=${value.replace(/\s+/g, ';')}`);
        const json = await res.json();
        if (json?.action === 'success') {
          setSuggested(json.result.map((item: any) => ({
            imprint: item.SPLIMPRINT.replace(/;/g, ' '),
            author: item.author,
          })));
        } else {
          setSuggested([]);
        }
      } catch (e) {
        console.error('Auto-complete error:', e);
        setSuggested([]);
      }
    } else {
      setSuggested([]);
    }
  };

  const goToResults = (imprintValue: string) => {
    navigation.navigate('PillList', {
      imprint: imprintValue,
      color: 'color',
      shape: 'shape',
    });
  };

  const handleSearchNow = () => {
    if (imprint.trim() === '') {
      Alert.alert('Please enter an imprint value');
    } else {
      goToResults(imprint);
    }
  };

  const clearInput = () => {
    setImprint('');
    setSuggested([]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
       <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Pill Search by Imprint</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Enter Imprint..."
          value={imprint}
          onChangeText={fetchSuggestions}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSearchNow} style={styles.searchBtn}>
        <Text style={styles.searchText}><Ionicons style={styles.searchIcon} name="search" /></Text>
      </TouchableOpacity>
        {imprint.length > 0 ? (
            <TouchableOpacity>
            <Ionicons onPress={() => setImprint('')} style={styles.clearIcon} name="close-circle" />
            </TouchableOpacity>
        ) : (
            <TouchableOpacity>
            <Ionicons onPress={() => setShowPopup(true)} style={styles.infoIcon} name="information-circle"/>
            </TouchableOpacity>
        )}
      </View>

      {suggested.length > 0 && (
        <FlatList
          data={suggested}
          keyExtractor={(item, index) => `${item.imprint}-${index}`}
          style={styles.suggestions}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => goToResults(item.imprint)}
            >
              <View>
                <Text style={{ color: '#fff' }}>{item.imprint}</Text>
                 <Text style={styles.author}>({item.author})</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      

      <Text style={styles.heading}>Popular Pill Imprints</Text>
      <View style={styles.popularList}>
        {popularImprints.map((item, idx) => (
          <TouchableOpacity key={idx} onPress={() => goToResults(item)} style={styles.popularItem}>
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Popup for Imprint Image */}
      <Modal visible={showPopup} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <TouchableOpacity onPress={() => setShowPopup(false)} style={styles.popupClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Image
            source={require('../assets/images/imprint.png')}
            style={styles.popupImage}
          />
        </View>
      </Modal>
      </ScrollView>
      <AdBanner />

    </View>
  );
};

export default ImprintSearchScreen;

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: 50,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  infoIcon: { 
    position: 'absolute',
    right: 65, 
    top: -10, 
    fontSize: 20, 
    color: '#16ABFF'
 },
  clearIcon: { 
    position: 'absolute', 
    right: 65,
    top: -10,
    fontSize: 20,
    color: '#f35d64'
},
searchIcon: {
  fontSize: 20,
  color: '#fff',
  textAlign: 'center',
  padding: 0,
  backgroundColor: '#16ABFF',
  lineHeight: 20,
},
searchBtn: {
    backgroundColor: '#16ABFF',
    padding: 10,
    marginVertical: 10,
    height: '100%',
    width: 60,
    justifyContent: 'center',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  suggestions: {
    position: 'absolute',
    top: 112,
    width: '100%',
    left: 15,
    backgroundColor: '#75bff2',
    padding: 8,
    borderRadius: 10,
    zIndex: 99999999,
    elevation: 11,
    maxHeight: 300,
  },
  suggestionItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#fff',
  },
  author: { color: '#fff',},
  
  searchText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  popularList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 10,
    elevation: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',

    //ios
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  popularItem: {
    backgroundColor: '#eee',
    padding: 10,
    margin: 4,
    borderRadius: 6,
    elevation: 2,

    //ios
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupClose: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  closeIcon: {
    fontSize: 24,
    color: '#fff',
  },
  popupImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
});
