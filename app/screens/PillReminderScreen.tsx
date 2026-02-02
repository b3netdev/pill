import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SQLite from 'react-native-sqlite-storage';
import { getDBConnection, resetDatabase } from '../uitlity/database';
import AdBanner from '../components/AdBanner';
SQLite.enablePromise(true);

type Reminder = {
  id: string;
  drug_name: string;
  instructions: string;
  shapeImage: string;
  time: string;
  shape: string;
  createdAt: string;
  updatedAt: string;
  takenDate: boolean;
  isTaken?: boolean;
};

const PillReminderScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [reminderList, setReminderList] = useState<Reminder[]>([]); // Load from storage or API
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       await resetDatabase(); 
  //       console.log('🔥 Database rseset successfully');
  //     } catch (e) {
  //       console.error('Error during DB reset:', e);
  //     }
  //   })();
  // }, []);

  const shapeImages: Record<string, any> = {
    Tablet: require('../assets/pillreminder/Tablet.png'),
    Capsules: require('../assets/pillreminder/Capsule.png'),
    Cream: require('../assets/pillreminder/cream.png'),
    Drops: require('../assets/pillreminder/drops.png'),
    Gel: require('../assets/pillreminder/gel.png'),
    Inhaler: require('../assets/pillreminder/inhaler.png'),
    Injection: require('../assets/pillreminder/injection.png'),
    Lotion: require('../assets/pillreminder/lotion.png'),
    Mouthwash: require('../assets/pillreminder/mouthwash.png'),
    Ointment: require('../assets/pillreminder/ointment.png'),
    Others: require('../assets/pillreminder/others.png'),
    Physiotherapy: require('../assets/pillreminder/physiotherapy.png'),
    Powder: require('../assets/pillreminder/powder.png'),
    Spray: require('../assets/pillreminder/spray.png'),
    Suppository: require('../assets/pillreminder/suppository.png'),
    Syrup: require('../assets/pillreminder/Syrup.png'),
    TreatmentSessions: require('../assets/pillreminder/treatment-session.png'),
  };

  const getShapeImage = (shape: string): any => {
    return shapeImages[shape] || require('../assets/pillreminder/others.png');
  };


  const createReminder = () => {
    navigation.navigate('PillReminderCreate');
  };

  // Load reminders from the database on component mount
  React.useEffect(() => {
    const loadReminders = async () => {
      try {
        const database = await getDBConnection();
        setDb(database);
        const results = await database.executeSql('SELECT * FROM reminders');
        const reminders: Reminder[] = results[0].rows.raw().map((row: any) => ({
          id: row.id.toString(),
          drug_name: row.drug_name,
          instructions: row.instructions,
          shapeImage: row.shapeimage,
          time: row.time,
          shape: row.shape,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          takenDate: !!row.taken_date,
          isTaken: !!row.is_taken,
        }));
        setReminderList(reminders);
      } catch (error) {
        console.error('Failed to load reminders', error);
      }
    };
    loadReminders();
  }
  , []);
  

  const openReminderOptions = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setModalVisible(true);
  };

  const markAsTaken = () => {
    if (selectedReminder) {
      const updated = reminderList.map(item => {
        if (item.id === selectedReminder.id) {
          return { ...item, isTaken: true, takenDate: true };
        }
        return item;
      }
      );
      setReminderList(updated);
      setModalVisible(false);
      // Update the database
      if (db) {
        console.log('Marking reminder as taken:', selectedReminder.id);
        console.log('Current date:', new Date().toISOString());
        db.executeSql(
          'UPDATE reminders SET is_taken = ?, taken_date = ? WHERE id = ?',
          [true, new Date().toISOString(), selectedReminder.id]
        )
          .then(() => {
            console.log('Reminder marked as taken successfully');
          }
          )
          .catch(error => {
            console.error('Failed to update reminder', error);
          }
        );
      }
    }
  };

  // show all data in log
  React.useEffect(() => {
    console.log('Current reminder list:', reminderList);
  }, [reminderList]);

  const deleteReminder = () => {
    if (selectedReminder) {
      Alert.alert(
        'Delete Reminder',
        'Are you sure you want to delete this reminder?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              const updatedList = reminderList.filter(item => item.id !== selectedReminder.id);
              setReminderList(updatedList);
              setModalVisible(false);
              // Delete from database
              if (db) {
                db.executeSql('DELETE FROM reminders WHERE id = ?', [selectedReminder.id])
                  .then(() => {
                    console.log('Reminder deleted successfully');
                  })
                  .catch(error => {
                    console.error('Failed to delete reminder', error);
                  });
              }
            },
          },
        ]
      );
    }
  };

  const editReminder = () => {
    if (selectedReminder) {
      navigation.navigate('EditReminder', { reminder: selectedReminder });
      setModalVisible(false);
    }
  };

  const renderReminderItem = ({ item }: { item: Reminder }) => {
    const isTaken = item.takenDate === true;
    return (
      <View style={[styles.reminderItem, isTaken && item.isTaken && styles.taken]}>
        {/* if dont have item.shapeimage show item.shape  */}
        <Image
          source={item.shapeImage ? { uri: item.shapeImage } : getShapeImage(item.shape)}
          style={styles.reminderImg}
        />
        <View style={styles.reminderText}>
          <Text style={styles.title}>{item.drug_name}</Text>
          <Text style={styles.description}>{item.instructions}</Text>
          <Text style={styles.time}>
          {item.time ? new Date(item.time).toLocaleString([], { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit', 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : ''}
          </Text>

          {isTaken && <Text style={styles.status}>Taken</Text>}
        </View>
        <TouchableOpacity style={styles.action} onPress={() => openReminderOptions(item)}>
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {reminderList.length > 0 ? (
        <FlatList
          data={reminderList}
          keyExtractor={item => item.id}
          renderItem={renderReminderItem}
          contentContainerStyle={styles.list}
        />
      ) : (
        <TouchableOpacity style={styles.noReminder} onPress={createReminder}>
          <Image source={require('../assets/images/defualtreminder.png')} style={styles.noReminderImg} />
        </TouchableOpacity>
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={deleteReminder}>
              <Text style={styles.modalItem}>🗑️ Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={markAsTaken}>
              <Text style={styles.modalItem}>✅ Mark as Taken</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Plus button */}
      <TouchableOpacity style={styles.plusBtn} onPress={createReminder}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>
      <AdBanner />
    </View>
  );
};

export default PillReminderScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { padding: 16 },
  reminderItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  taken: {
    backgroundColor: '#e6f9ec',
  },
  reminderImg: {
    width: 75,
    height: 75,
    marginRight: 12,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  reminderText: { flex: 1 },
  title: { fontWeight: 'bold', fontSize: 16 },
  description: { color: '#555' },
  time: { color: '#888', fontSize: 12 },
  status: { marginTop: 4, color: 'green', fontWeight: '600' },
  action: { paddingHorizontal: 10 },
  menuIcon: { fontSize: 24, color: '#555' },
  noReminder: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  noReminderImg: { width: 220, height: 220, resizeMode: 'contain' },
  plusBtn: {
    position: 'absolute',
    bottom: 70,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#16ABFF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: 220,
    borderRadius: 8,
    padding: 16,
    elevation: 4,
  },
  modalItem: {
    paddingVertical: 10,
    fontSize: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});
