import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AdBanner from '../components/AdBanner'; // Uncomment if you have a banner component
import { useInterstitialAd } from '../components/InterstitialAdManager';

type Pill = {
  name: string;
  labeler: string;
  mpc_imprint: string;
  rxnav_image?: string;
};

type RouteParams = {
  imprint: string;
  color: string;
  shape: string;
};

const PillListScreen = () => {
  const { showAd } = useInterstitialAd();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { imprint, color, shape } = route.params as RouteParams;

  const [pillList, setPillList] = useState<Pill[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [noMoreScroll, setNoMoreScroll] = useState(false);

  useEffect(() => {
    fetchPills();
    // Optionally load banner ads here
    showAd();
  }, []);
  

  const fetchPills = async (event: any = null) => {
    let getImprint = imprint === 'imprint' ? '' : imprint;
    let getColor = color === 'color' ? '' : color;
    let getShape = shape === 'shape' ? '' : shape;

    let params = `&color=${getColor}&shape=${getShape}`;
    if (getImprint !== '') {
      params = `&imprint=${getImprint.replace(/\s+/g, ';')}` + params;
    }

    try {
      const response = await fetch(
        `https://www.mobixed.com/apps/drug-fda/api/function_api.php?action=all&page_size=20&pageno=${pageNo}${params}`
      );
      const data = await response.json();

      if (data.action === 'success' && data.total_page !== 0) {
        if (data.data.length > 0) {
          const newPills = data.data.map((item: any) => ({
            name: item.name.replace(/24 HR |12 HR |{[0-9]+ \(|}/g, ''),
            labeler: item.labeler,
            mpc_imprint: item.mpc_imprint.replace(/;/g, ' '),
            rxnav_image: item.rxnav_image,
          }));
          setPillList(prev => [...prev, ...newPills]);
          setPageNo(prev => prev + 1);

          if (event?.target?.complete) event.target.complete();
        } else {
          if (event?.target) event.target.disabled = true;
          showAd();
        }
      } else {
        if (getImprint !== '') {
            //console.log(getImprint);
          fetchAlternateImprint(getImprint);
        } else {
          Alert.alert('No results found');
        }
      }
    } catch (error) {
      
      if (getImprint !== '') {
        console.error('Fetch error2:', error);
        fetchAlternateImprint(getImprint);
      } else {
        Alert.alert('Error', 'Unable to fetch pills.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAlternateImprint = async (imprintVal: string) => {
    console.log('Fetching alternate imprint:', imprintVal);
    try {
        
      const res = await fetch(
        `https://www.mobixed.com/apps/drug-fda/api/webapps.php?action=get_product_imprint&splimprint=${imprintVal.replace(/\s+/g, ';')}`
      );
      const data = await res.json();
        console.log('Alternate imprint response:', data);

      if (data.action === 'success' && data.result.length > 0) {
        const altPills = data.result.map((item: any) => ({
          name: item.RXSTRING,
          labeler: item.author,
          mpc_imprint: item.SPLIMPRINT.replace(/;/g, ' '),
        }));
        setNoMoreScroll(true);
        setPillList(prev => [...prev, ...altPills]);
      } else {
        Alert.alert('No results found');
      }
    } catch (error) {
      console.error('Alternate imprint fetch error:', error);
    }
  };

  const openZoomImg = (image: string) => {
    setPopupImage(image);
    setModalVisible(true);
  };

  const handleDrugDetails = async (pill: Pill) => {
    // Optional: use AsyncStorage to store pill data
    navigation.navigate('DrugDetails', { drugName: pill.name.split(' ')[0], data: pill });
    //showAd();
  };

  const renderPillItem = ({ item }: { item: Pill }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleDrugDetails(item)}>
      {item.rxnav_image ? (
        <TouchableOpacity onPress={() => item.rxnav_image && openZoomImg(item.rxnav_image)}>
          <Image source={{ uri: item.rxnav_image }} style={styles.image} />
        </TouchableOpacity>
      ) : null}
      <View style={styles.textContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text><Text style={styles.bold}>Labeler:</Text> {item.labeler}</Text>
        <Text><Text style={styles.bold}>Imprint:</Text> {item.mpc_imprint}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={{ textAlign: 'right', fontSize: 14, color: '#888', marginVertical: 10 }}>
            Source of information:{' '}
            <Text
              style={{ color: '#16ABFF', textDecorationLine: 'underline' }}
              onPress={() => Linking.openURL('https://lhncbc.nlm.nih.gov/RxNav/APIs/index.html')}
            >
              National Library of Medicine
            </Text>
          </Text>
      <SafeAreaView>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
          {imprint === 'imprint' ? 'All Pills' : `Pills for Imprint: ${imprint}`}
        </Text>
      </SafeAreaView>
      
      {loading && pillList.length === 0 ? (
        <ActivityIndicator size="large" color="#16ABFF" />
      ) : (
        <FlatList
          data={pillList}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={renderPillItem}
          onEndReached={() => {
            if (!noMoreScroll) fetchPills();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator /> : null}
        />
      )}
      <AdBanner />

      <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          {popupImage && <Image source={{ uri: popupImage }} style={styles.fullImage} />}
        </View>
      </Modal>
    </View>
  );
};

export default PillListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  card: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 12,
    borderRadius: 6,
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  bold: { fontWeight: '600' },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeIcon: {
    fontSize: 28,
    color: '#fff',
  },
});
