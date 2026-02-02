import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import AdBanner from '../components/AdBanner';
import { useInterstitialAd } from '../components/InterstitialAdManager';


type RouteParams = {
  diseaseName: string;
};

const DiseaseDetailsScreen: React.FC = () => {
  const { showAd } = useInterstitialAd(); // Call showAd function to ensure ad is ready
  const { width } = useWindowDimensions();
  const route = useRoute();
  const { diseaseName } = route.params as RouteParams;

  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDiseaseDetails = async () => {
    try {
      const res = await fetch(
        `https://mobixed.com/api/response.php?term=${encodeURIComponent(diseaseName)}`
      );
      const data = await res.json();
      console.log('Disease details data:', data);

      // Handle data.result as an array of summaries
      if (Array.isArray(data)) {
        const html = data
          .map((item: any) => item?.contents?.FullSummary ?? '')
          .filter(Boolean)
          .join('<hr style="margin:20px 0;"/>'); // separator between items
        setHtmlContent(html);
      } else {
        setHtmlContent('');
      }
    } catch (err) {
      console.error('Error fetching disease details:', err);
      setHtmlContent('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseaseDetails();
    // Optionally load banner ads here
     showAd();
  }, []);

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{diseaseName}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#16ABFF" style={{ marginTop: 20 }} />
      ) : htmlContent ? (
        <View style={styles.contentWrapper}>
          <RenderHtml contentWidth={width} source={{ html: htmlContent }} 
          tagsStyles={{
            p: { fontSize: 16, color: '#444', marginBottom: 10 },
            ul: { paddingLeft: 25, marginBottom: 10 },
            ol: { paddingLeft: 25, marginBottom: 10 },
            li: { marginBottom: 6 },
          }}
          />
        </View>
      ) : (
        <View style={styles.noResult}>
          <Image
            source={require('../assets/images/noresult.png')}
            style={styles.noResultImg}
          />
          <Text style={{ textAlign: 'center', marginTop: 8 }}>
            No information found.
          </Text>
        </View>
      )}
    </ScrollView>
    <AdBanner />
    </View>
  );
};

export default DiseaseDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  contentWrapper: {
    marginTop: 10,
  },
  noResult: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  noResultImg: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
