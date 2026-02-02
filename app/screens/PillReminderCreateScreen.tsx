import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import notifee, { TimestampTrigger, TriggerType, AndroidImportance } from '@notifee/react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchCamera } from 'react-native-image-picker';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import SQLite from 'react-native-sqlite-storage';
import { getDBConnection } from '../uitlity/database';
import AdBanner from '../components/AdBanner';
import { useInterstitialAd } from '../components/InterstitialAdManager';

SQLite.enablePromise(true);

const PillReminderCreateScreen: React.FC = () => {
  const { showAd } = useInterstitialAd();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [drugName, setDrugName] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string }[]>([]);
  const [selectOption, setSelectOption] = useState<'b' | 'g'>('b');
  const [shape, setShape] = useState('Tablet');
  const [shapeImage, setShapeImage] = useState('');
  const [instructions, setInstructions] = useState('No specific instruction');
  const [time, setTime] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

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

  const showSchema = async () => {
    const db = await getDBConnection();
  
    try {
      const results = await db.executeSql(`
        SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';
      `);
  
      const schema = results[0].rows.raw(); // Array of { name, sql }
      console.log('📄 Database Schema:', schema);
  
      // Optionally display in alert or UI
      schema.forEach(table => {
        console.log(`\n🧾 Table: ${table.name}\n${table.sql}\n`);
      });
    } catch (error) {
      console.error('❌ Failed to fetch schema:', error);
    }
  };

  useEffect(() => {
    const initDb = async () => {
      const database = await getDBConnection();
      showSchema();
      setDb(database);
    };
    initDb();

    notifee.requestPermission();
    notifee.createChannel({
      id: 'default',
      name: 'Pill Reminders',
      importance: AndroidImportance.HIGH,
    });
  }, []);

  const fetchSuggestions = async (text: string) => {
    setDrugName(text);
    if (text.length > 2) {
      try {
        const formData = `action=auto_popup_array&med_type=${selectOption}&keyword=${encodeURIComponent(text)}`;
        const res = await fetch('https://www.mobixed.com/apps/drug-fda/ajax.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
        });
        const data = await res.json();
        if (!data || typeof data !== 'object') {
          setSuggestions([]);
          return;
        }
        const results = Object.values(data).map((name) => ({ name: name as string }));
        setSuggestions(results);
      } catch (e) {
        console.error('Autocomplete fetch failed:', e);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required.');
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: true,
        includeExtra: true,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Camera Error', response.errorMessage || 'Unknown error');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setShapeImage(response.assets[0].uri || '');
        }
      }
    );
  };

  const updateShapeImage = (newShape: string) => {
    setShape(newShape);
    setShapeImage('');
  };

  const scheduleNotification = async (date: Date, message: string) => {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      alarmManager: false,
    };

    await notifee.createTriggerNotification(
      {
        title: 'Pill Reminder',
        body: message,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: { id: 'default' },
        },
      },
      trigger
    );
  };

  const resetForm = () => {
    setDrugName('');
    setShapeImage('');
    setShape('Tablet');
    setInstructions('No specific instruction');
    setTime(new Date());
  };

  const submitReminder = async () => {
    if (!drugName) return Alert.alert('Please enter medication name');

    await scheduleNotification(time, `Take ${drugName} - ${instructions}`);

    if (!db) return;

    




    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO reminders (drug_name, shape, instructions, shapeimage, time) VALUES (?, ?, ?, ?, ?)',
        [drugName, shape, instructions, shapeImage || '', time.toString()],
        () => console.log('Reminder saved successfully'),
        (error) => {
          console.error('DB insert error:', error);
          Alert.alert('Error', 'Failed to save reminder');
          return false;
        }
      );
    });

    Alert.alert('Reminder Set', `Reminder scheduled at ${time.toLocaleTimeString()}`);
    resetForm();
    showAd();
    navigation.navigate('PillReminder');
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Medication</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Enter drug name..."
          style={styles.input}
          value={drugName}
          onChangeText={fetchSuggestions}
        />
        {drugName.length > 0 && (
          <TouchableOpacity onPress={() => setDrugName('')} style={styles.clearBtn}>
            <Text style={styles.clearIcon}>✖</Text>
          </TouchableOpacity>
        )}
      </View>
      {suggestions.length > 0 && (
        <View style={styles.suggestionBox}>
          {suggestions.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => {
              setDrugName(item.name);
              setSuggestions([]);
            }}>
              <Text style={styles.suggestionText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {shapeImage ? (
        <Image source={{ uri: shapeImage }} style={styles.shapeImage} />
      ) : (
        <Image source={shapeImages[shape]} style={styles.shapeImage} />
      )}
      <Text style={styles.shapeName}>{shape}</Text>

      <View style={styles.CameraWraper}>
        <TouchableOpacity onPress={openCamera} style={styles.CameraBtn}>
          <Ionicons name="camera" size={35} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Select Shape</Text>
      <View style={styles.pickerBox}>
        <Picker selectedValue={shape} onValueChange={updateShapeImage}>
          {Object.keys(shapeImages)
            .filter((item) => typeof item === 'string')
            .map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
        </Picker>
      </View>

      <Text style={styles.label}>Instructions</Text>
      <View style={styles.pickerBox}>
        <Picker selectedValue={instructions} onValueChange={setInstructions}>
          {[
            'Before meal', 'After meal', 'During meal', 'Empty stomach',
            'With water', 'Never take with milk', 'Avoid sugar',
            'Avoid salty food', 'Avoid fatty food', 'Eat more vegetables',
            'Eat more iron-rich food', 'No specific instruction',
          ].map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Reminder Time</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={styles.timeField}>{time.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setTime(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.submitBtn} onPress={submitReminder}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
    <AdBanner/>
    </View>
  );
};

export default PillReminderCreateScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  label: { fontWeight: '600', marginBottom: 6, fontSize: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, fontSize: 16,
  },
  shapeImage: {
    width: 100, height: 100, alignSelf: 'center', marginVertical: 10, resizeMode: 'contain',
  },
  shapeName: { textAlign: 'center', fontSize: 16, marginBottom: 16 },
  inputWrapper: { position: 'relative', marginBottom: 16 },
  clearBtn: { position: 'absolute', right: 10, top: 8 },
  clearIcon: { fontSize: 18, color: '#888' },
  suggestionBox: {
    backgroundColor: '#75bff2', padding: 10, marginBottom: 10, borderRadius: 6,
    borderWidth: 1, borderColor: '#ccc',
  },
  suggestionText: {
    fontSize: 16, color: '#fff', marginVertical: 3,
    borderBottomWidth: 1, borderBottomColor: '#fff', paddingBottom: 5, paddingLeft: 10,
  },
  CameraWraper: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  CameraBtn: {
    width: 70, height: 70, backgroundColor: '#57c2f8',
    borderRadius: 50, justifyContent: 'center', alignItems: 'center',
  },
  pickerBox: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 16,
  },
  timeField: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6,
    textAlign: 'center', fontSize: 16, marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: '#16ABFF', padding: 14, borderRadius: 6, marginTop: 20,
  },
  submitText: {
    textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: 16,
  },
});
