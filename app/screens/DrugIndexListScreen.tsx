import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AdBanner from '../components/AdBanner';

type RouteParams = {
  letter: string;
  type: 'b' | 'g';
};

type DrugItem = {
  displayname: string;
  urlSlug: string;
};

const DrugIndexListScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { letter, type } = route.params as RouteParams;

  const [searchTerm, setSearchTerm] = useState('');
  const [allDrugs, setAllDrugs] = useState<DrugItem[]>([]);
  const [filteredDrugs, setFilteredDrugs] = useState<DrugItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrugIndexList();
  }, []);

  useEffect(() => {
    filterDrugs(searchTerm);
  }, [searchTerm]);

  const fetchDrugIndexList = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.mobixed.com/apps/drug-fda/api/webapps.php?action=key_search_list&keyword=${letter}&medtype=${type}`
      );
      
      const data = await res.json();
      if (data?.action === 'success') {
        if (data?.medicines?.length > 0) {
          const drugs = data.medicines.map((item: string) => ({
            displayname: item.toLowerCase(),
            urlSlug: item.replace(/\s+/g, '-').toLowerCase(),
          }));
          setAllDrugs(drugs);
          setFilteredDrugs(drugs);
        } else {
          Alert.alert('No data found for this selection.');
        }
      } else {
        Alert.alert('No data found for this selection.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to load drug index list.');
    } finally {
      setLoading(false);
    }
  };

  const filterDrugs = (query: string) => {
    if (query.trim() === '') {
      setFilteredDrugs(allDrugs);
    } else {
      const filtered = allDrugs.filter(item =>
        item.displayname.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDrugs(filtered);
    }
  };

  const clearInput = () => {
    setSearchTerm('');
  };

  const handleDrugPress = (slug: string) => {
    navigation.navigate('DrugDetails', {
      drugName: slug,
      data: { name: slug, labeler: '', mpc_imprint: '' },
    });
  };

  return (
    <View style={styles.container}>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search drug name"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.input}
        />
        {searchTerm.length == 0 && (
        <TouchableOpacity style={styles.searchIcon}>
          <Text>🔍</Text>
        </TouchableOpacity>
        )}
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={clearInput} style={styles.clearBtn}>
            <Text style={styles.clearIcon}>✖</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#16ABFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredDrugs}
          keyExtractor={(item, index) => item.urlSlug + index}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleDrugPress(item.urlSlug)}
              style={styles.listItem}
            >
              <Text style={styles.listtext}>{item.displayname}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <AdBanner />
      
    </View>
  );
};

export default DrugIndexListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  searchBar: {
    position: 'relative',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  clearBtn: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
  clearIcon: { fontSize: 18, color: '#999' },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 16,
  },
    listtext: {
        fontSize: 18,
        color: '#333',
        fontWeight: '500',
        textTransform: 'capitalize',
    },
});
