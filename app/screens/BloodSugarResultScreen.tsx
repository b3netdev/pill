import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AdBanner from '../components/AdBanner';
import { useInterstitialAd } from '../components/InterstitialAdManager';

type RouteParams = {
  sugerlavel: string;
  resultval: string;
  bgcolor: string;
};

const BloodSugarResultScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { showAd } = useInterstitialAd(); // Call showAd function to ensure ad is ready
  const route = useRoute();
  const { sugerlavel, resultval, bgcolor } = route.params as RouteParams;

  React.useEffect(() => {
    showAd(); // Call showAd function to ensure ad is ready
  }, [showAd]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Blood Sugar Result</Text>

      {/* Sugar Value Display */}
      <View style={styles.meterBox}>
        <Text style={styles.sugarValue}>{sugerlavel}</Text>
      </View>

      {/* Result Message */}
      <View style={[styles.messageBox, { backgroundColor: bgcolor }]}>
        <Text style={styles.resultLabel}>Your Blood Sugar Stage</Text>
        <Text style={styles.resultValue}>{resultval}</Text>
      </View>

      {/* Chart Button */}
      <TouchableOpacity style={styles.chartButton} onPress={() => navigation.navigate('BloodSugarChart')}>
        <Text style={styles.chartButtonText}>View Chart</Text>
      </TouchableOpacity>
    </ScrollView>
      <AdBanner />
    </View>
  );
};

export default BloodSugarResultScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  meterBox: {
    marginVertical: 30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#e6f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sugarValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  messageBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: 6,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  chartButton: {
    backgroundColor: '#16ABFF',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  chartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
