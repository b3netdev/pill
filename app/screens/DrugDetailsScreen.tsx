// DrugDetailsScreen.tsx
import React, { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
  Vibration,
  SafeAreaView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLayoutEffect } from 'react';
import SQLite from 'react-native-sqlite-storage';
import { getDBConnection } from '../uitlity/database';
import AdBanner from '../components/AdBanner';
import { useInterstitialAd } from '../components/InterstitialAdManager';
SQLite.enablePromise(true);

type RouteParams = {
  drugName: string;
  data: {
    name: string;
    labeler: string;
    mpc_imprint: string;
  };
};

type DrugDetails = {
  name?: string;
  brand_name?: string;
  generic_name?: string;
  product_ndc?: string;
  manufacturer_name?: string;
  website?: string;
  product_type?: string;
  barcode_image_url?: string;
  direction_table?: string;
  direction?: string;
  other_information?: string;
  warnings?: string;
};

const DrugDetailsScreen: React.FC = () => {
  const { showAd } = useInterstitialAd();
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      showAd(); // Call when transitioning or after certain action
    }, 10000); // 10000 milliseconds (10 second)

    return () => clearTimeout(timeout);
  }, []);

  const { width } = useWindowDimensions();
  const route = useRoute();
  const { drugName, data } = route.params as RouteParams;

  const [info, setInfo] = useState<DrugDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [getImprint, setGetImprint] = useState(data?.mpc_imprint);
  const [bookmarked, SetBookmarked] = useState(false);

  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    fetchDrugDetails();
  }, []);

    useEffect(() => {
      const initDb = async () => {
        const database = await getDBConnection();
        setDb(database);
      };
      initDb();
    }, []);

    useEffect(() => {
      const checkIfBookmarked = async () => { 
        if (!db) return;
      
        db.transaction(tx => {
          console.log('Checking bookmark for:', data.mpc_imprint);
          tx.executeSql(
            `SELECT * FROM pills_bookmark WHERE drug_name = ? AND labeler = ? AND mpc_imprint = ?`,
            [drugName, data.labeler, data.mpc_imprint],
            (tx, results) => {
              if (results.rows.length > 0) {
                console.log('Bookmark exists for:', data.mpc_imprint);
                SetBookmarked(true);
              }else{
                SetBookmarked(false);
              }
            },
            (tx, error) => console.error('Error checking bookmark', error)
          );
        });
      };
    checkIfBookmarked();
  }, [db, drugName, data.labeler, data.mpc_imprint]);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const toggleBookmark = () => {
    //console.log('Toggling bookmark for:', drugName);
    // return false;
    if (!db) return;
  
    const isAdding = !bookmarked;
    SetBookmarked(isAdding);
    if (isAdding) {
      Vibration.vibrate(100); // vibrate for 100ms
    }

    //  console.log('isAdding:', isAdding);
    //  return false;
  
    db.transaction(tx => {
      if (isAdding) {
        // tx.executeSql(`DROP TABLE pills_bookmark2;`);
        // return false;

        // tx.executeSql(
        //   `SELECT name FROM sqlite_master WHERE type='table';`,
        //   [],
        //   (tx, results) => {
        //     const tableNames = [];
        //     for (let i = 0; i < results.rows.length; ++i) {
        //       tableNames.push(results.rows.item(i).name);
        //     }
        //     console.log('📋 Tables in DB:', tableNames);
        //     return false;
        //   },
        //   (tx, error) => {
        //     console.error('Error fetching table list:', error);
        //     return true;
        //   }
        // );

        // tx.executeSql(
        //   `PRAGMA table_info(pills_bookmark);`,
        //   [],
        //   (tx, results) => {
        //     const columns = [];
        //     for (let i = 0; i < results.rows.length; ++i) {
        //       columns.push(results.rows.item(i));
        //     }
        //     console.log('📐 Table Structure (pills_bookmark):', columns);
        //   },
        //   (tx, error) => {
        //     console.error('❌ Error fetching table structure:', error);
        //     return true;
        //   }
        // );
        
        tx.executeSql(
          `INSERT INTO pills_bookmark (drug_name, labeler, mpc_imprint) VALUES (?, ?, ?)`,
          [drugName, data.labeler, data.mpc_imprint],
          () => console.log('Bookmark saved'),
          (tx, error) => {
            console.error('Error saving bookmark:', error);
            return true;
          }
        );
      } else {
        tx.executeSql(
          `DELETE FROM pills_bookmark WHERE drug_name = ? AND labeler = ? AND mpc_imprint = ?`,
          [drugName, data.labeler, data.mpc_imprint],
          () => console.log('Bookmark removed'),
          (tx, error) => console.error('Error removing bookmark', error)
        );
      }
    });
  
    // Alert.alert(
    //   isAdding ? 'Added to Bookmarks' : 'Removed from Bookmarks',
    //   `You have ${isAdding ? 'added' : 'removed'} ${data.name} ${isAdding ? 'to' : 'from'} your bookmarks.`
    // );
  };
  
  

useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <View style={styles.headerIcons}>
        {/* <TouchableOpacity onPress={() => console.log('Alarm pressed')}>
          <Ionicons name="alarm" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Alarm-outline pressed')}>
          <Ionicons name="alarm-outline" size={24} color="white" />
        </TouchableOpacity> */}

        <TouchableOpacity onPress={toggleBookmark}>
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
    ),
  });
}, [navigation, toggleBookmark, bookmarked]);

  

  const fetchDrugDetails = async () => {
    let getDrugName = drugName.toLocaleUpperCase();
    console.log('Fetching details for drug:', getDrugName);
    try {
      const res = await fetch(
        `https://www.mobixed.com/apps/drug-fda/api/webapps.php?action=drug_details&keyword=${getDrugName}`
      );
      const json = await res.json();
      console.log(json);
        if (json.action === 'success') {
            setInfo(json.medicines);
            setGetImprint(json.medicines.mpc_imprint);
            showAd();
        } else {
            Alert.alert('No information found.');
        }
    } catch (e) {
      console.error('Error loading drug details', e);
    } finally {
      setLoading(false);
    }
  };



  const openWebsite = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Can't open link", err));
  };

  const renderRow = (
    label: string,
    value: string,
    link?: boolean,
    onPress?: (url: string) => void
  ) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {link ? (
        <TouchableOpacity onPress={() => onPress?.(value)}>
          <Text style={[styles.value, styles.link]}>{value}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );

  const renderSection = (title: string, content: string) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionText}>{content}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#16ABFF" style={{ marginTop: 50 }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      
      <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ textAlign: 'right', fontSize: 14, color: '#888', marginVertical: 10 }}>
      Source of information :{' '}
      <Text
        style={{ color: '#16ABFF', textDecorationLine: 'underline' }}
        onPress={() => Linking.openURL('https://open.fda.gov/apis/drug/')}
      >
        FDA
      </Text>
    </Text>
      {info?.name && <Text style={styles.title}>{info.name}</Text>}
  
      <View style={styles.table}>
        {info?.brand_name && renderRow('Brand Name', info.brand_name)}
        {info?.generic_name && renderRow('Generic Name', info.generic_name)}
        {info?.product_ndc && renderRow('NDC', info.product_ndc)}
        {getImprint && renderRow('Imprint', getImprint)}
        {info?.manufacturer_name && renderRow('Manufacturer', info.manufacturer_name)}
        {info?.website && renderRow('Website', info.website, true, openWebsite)}
        {info?.product_type && renderRow('Type', info.product_type)}
      </View>
  
      {Array.isArray(info?.direction_table) && info.direction_table.length > 0 && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Directions</Text>
    {info.direction_table.map((rawHtml, index) => {
      if (typeof rawHtml !== 'string' || rawHtml.trim() === '') return null;

      // ✅ Clean the HTML by replacing non-standard tags
      const cleanedHtml = rawHtml
        .replace(/<paragraph>/g, '<p>')
        .replace(/<\/paragraph>/g, '</p>')
        .replace(/<col\b[^>]*>/g, '<td>') // replace <col ...> with <td>
        .replace(/<\/col>/g, '</td>');    // just in case

        //console.log('Cleaned HTML:', cleanedHtml);

        return (
            <View key={index}>
              <RenderHTML
                contentWidth={width}
                source={{ html: cleanedHtml }}
                baseStyle={styles.sectionText}
                defaultTextProps={{ selectable: true }}
                tagsStyles={{
                  table: {
                    marginBottom: 20,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 6,
                    backgroundColor: '#fff',
                    width: 740,

                  },
                  tr: {
                    flexDirection: 'row',
                    width: '100%',
                  },
                  td: {
                    width: '50%',
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    fontSize: 12,
                    color: '#333',
                    textAlign: 'left',
                  },
                  p: {
                    margin: 0,
                    padding: 0,
                  }
                }}
              />
            </View>
          );
    }
    )}          
  </View>
)}


  
      {info?.direction && renderSection('Directions', info.direction)}
      {info?.other_information && renderSection('Other Information', info.other_information)}
      {info?.warnings && renderSection('Warnings', info.warnings)}
  
      {!info && (
        <View style={styles.noResult}>
          <Image source={require('../assets/images/noresult.png')} style={styles.noResultImg} />
          <Text>No information found.</Text>
        </View>
      )}
    </ScrollView>
      <AdBanner />
    </SafeAreaView>
  );
}  

const styles = StyleSheet.create({
  container: { 
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: 80,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingRight: 0,
  },
  icon: { fontSize: 24, color: '#444' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  table: { 
    marginBottom: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
 },
  row: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
 },
  label: { 
    fontWeight: '400',
    width: '20%',
    textAlign: 'left',
    fontSize: 15,
    //border right
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    paddingRight: 10,
    paddingVertical: 5,
    
 },
  value: { 
    width: '80%',
    textAlign: 'left',
    fontSize: 15,
    fontWeight: '400',
    paddingLeft: 10,
 },
  link: { color: '#75a0d0', textDecorationLine: 'underline' },
  barcode: { width: 150, height: 40, resizeMode: 'contain' },
  section: { marginBottom: 20 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 4, fontSize: 18, color: '#333' },
  sectionText: { 
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    fontFamily: 'Arial',
},
  noResult: { alignItems: 'center', marginTop: 40 },
  noResultImg: { width: 200, height: 200, resizeMode: 'contain' },
});

export default DrugDetailsScreen;
