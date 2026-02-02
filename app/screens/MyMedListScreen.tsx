import React, { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SQLite from 'react-native-sqlite-storage';
import { getDBConnection } from '../uitlity/database';
import AdBanner from '../components/AdBanner';

SQLite.enablePromise(true);

const MyMedListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [BookmarkedList, setBookmarkedList] = useState<any[]>([]);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
        const initDb = async () => {
          const database = await getDBConnection();
          setDb(database);
        };
        initDb();
      }, []);

  useEffect(() => {
        const getBookmarkedList = async () => { 
          if (!db) return;
        
          db.transaction(tx => {
            tx.executeSql(
              `SELECT * FROM pills_bookmark`,
              [],
              (tx, results) => {
                if (results.rows.length > 0) {
                  console.log('Bookmarked drugs found:', results.rows.item(1));
                  //return false; 
                  const bookmarks = [];
                  for (let i = 0; i < results.rows.length; i++) {
                    bookmarks.push(results.rows.item(i));
                  }
                  setBookmarkedList(bookmarks);
                }
              },
              (tx, error) => console.error('Error checking bookmark', error)
            );
          });
        };
        getBookmarkedList();
    }, [db]);
    
    

  const viewDrugDetails = (item: { drug_name: string; labeler: string; mpc_imprint: string }) => {
    navigation.navigate('DrugDetails', { drugName: item.drug_name, data: { labeler: item.labeler, mpc_imprint: item.mpc_imprint } });
  };

  const deleteData = (drugId: number) => {
    //delete the drug from the database
    if (!db) return;
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM pills_bookmark WHERE id = ?`,
        [drugId],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            Alert.alert('Success', 'Medication removed from bookmarks');
            // Update the list after deletion
            setBookmarkedList(prevList => prevList.filter(item => item.id !== drugId));
          } else {
            Alert.alert('Error', 'Failed to remove medication');
          }
        },
        (tx, error) => console.error('Error deleting bookmark', error)
      );
    }
    );
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Meds</Text>

      {BookmarkedList.length > 0 ? (
        BookmarkedList.map((item) => (
          <View key={item.id} style={styles.medItem}>
            <TouchableOpacity onPress={() => viewDrugDetails(item)}>
              <Text style={styles.medName}>{item.drug_name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteData(item.id)}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={styles.noReminder}>
          <Image
            source={require('../assets/images/mymeds.png')}
            style={styles.placeholderImage}
          />
          <Text style={styles.noText}>No saved medications yet</Text>
        </View>
      )}
    </ScrollView>
    <AdBanner />
    </View>
  );
};

export default MyMedListScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  medItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  medName: {
    fontSize: 16,
    color: '#333',
  },
  deleteIcon: {
    fontSize: 18,
    color: '#d9534f',
  },
  noReminder: {
    alignItems: 'center',
    marginTop: 50,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  noText: {
    fontSize: 16,
    color: '#888',
  },
});
