import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AdBanner from '../components/AdBanner';
import { useInterstitialAd } from '../components/InterstitialAdManager';

type RouteParams = {
  totalCholesterolResult: string;
  ldlCholesterolResult: string;
  hdlCholesterolResult: string;
  triglycerideResult: string;
  ratioResult: string;
};

const CholesterolResultScreen: React.FC = () => {
  const route = useRoute();
  const { showAd } = useInterstitialAd(); // Call showAd function to ensure ad is ready
  const navigation = useNavigation<any>();
  const {
    totalCholesterolResult,
    ldlCholesterolResult,
    hdlCholesterolResult,
    triglycerideResult,
    ratioResult,
  } = route.params as RouteParams;

  React.useEffect(() => {
    showAd(); // Call showAd function to ensure ad is ready
  }, [showAd]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    
    <ScrollView contentContainerStyle={styles.container}>
      {/* Icon */}
      <View style={styles.imageWrapper}>
        <Image
          source={require('../assets/images/cholesterol-icon.png')}
          style={styles.image}
        />
      </View>

      {/* Heading */}
      <Text style={styles.header}>Cholesterol Results</Text>
      <Text style={styles.subtext}>
        The interpretations of the values that you entered are displayed below.
      </Text>

      {/* Results Table */}
      <View style={styles.resultBox}>
        <ResultRow label="Total Cholesterol" value={totalCholesterolResult} />
        <ResultRow label="LDL Cholesterol" value={ldlCholesterolResult} />
        <ResultRow label="HDL Cholesterol" value={hdlCholesterolResult} />
        <ResultRow label="Triglyceride" value={triglycerideResult} />
        <ResultRow
          label="Total Cholesterol / HDL Ratio (Heart Disease Risk)"
          value={ratioResult}
        />
      </View>

      {/* View Chart */}
      <TouchableOpacity
        style={styles.chartButton}
        onPress={() => navigation.navigate('CholesterolChart')}
      >
        <Text style={styles.chartButtonText}>View Chart</Text>
      </TouchableOpacity>
    </ScrollView>
      <AdBanner />
    </View>
  );
};

const ResultRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.resultRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default CholesterolResultScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtext: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  resultBox: {
    marginBottom: 30,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  label: {
    width: '65%',
    fontSize: 16,
    color: '#333',
  },
  value: {
    width: '35%',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    color: '#000',
  },
  chartButton: {
    backgroundColor: '#16ABFF',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  chartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
