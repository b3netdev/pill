import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AdBanner from '../components/AdBanner';
import { useInterstitialAd } from '../components/InterstitialAdManager';

type RouteParams = {
  plusrate: string;
  result: string;
  bgcolor: string;
};

const PulseRateResultScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { showAd } = useInterstitialAd();
  const route = useRoute();
  const { plusrate, result, bgcolor } = route.params as RouteParams;

  useEffect(() => {
    showAd(); // Call showAd function to ensure ad is ready
  }
, [showAd]);

  const handleViewChart = () => {
    navigation.navigate('PulseRateChart');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Pulse Rate Calculator</Text>

      <View style={styles.resultContainer}>
        <Text style={styles.plusRateValue}>
          {plusrate} <Text style={styles.sub}>BPM</Text>
        </Text>
      </View>

      <View style={[styles.messageBox, { backgroundColor: bgcolor }]}>
        <Text style={styles.messageText}>
          Your Pulse Rate is{"\n"}
          <Text style={styles.resultText}>{result}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.chartButton} onPress={handleViewChart}>
        <Text style={styles.chartText}>View Chart</Text>
      </TouchableOpacity>
    </ScrollView>
    <AdBanner />
    </View>
  );
};

export default PulseRateResultScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  resultContainer: {
    marginVertical: 20,
  },
  plusRateValue: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sub: {
    fontSize: 20,
    fontWeight: '400',
  },
  messageBox: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  resultText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  chartButton: {
    backgroundColor: '#16ABFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  chartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
