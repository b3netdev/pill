import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AdBanner from '../components/AdBanner';
import { useInterstitialAd } from '../components/InterstitialAdManager';

type RouteParams = {
  syscolic: string;
  dycolic: string;
  resultval: string;
  bgcolor: string;
};

const BloodPressureResultScreen: React.FC = () => {
  const route = useRoute();
  const { showAd } = useInterstitialAd(); // Call showAd function to ensure ad is ready
  const navigation = useNavigation<any>();
  const { syscolic, dycolic, resultval, bgcolor } = route.params as RouteParams;

  const handleViewChart = () => {
    navigation.navigate('BloodPressureChart');
  };

  React.useEffect(() => {
    showAd(); // Call showAd function to ensure ad is ready
  }, [showAd]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Blood Pressure Result</Text>

      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/pressure-meter.png')}
          style={styles.image}
        />
        <View style={styles.valuesBox}>
            <Text style={styles.valueText}>{syscolic}</Text>
            <Text style={styles.valueText}>{dycolic}</Text>
        </View>
      </View>

      

      <View style={[styles.resultBox, { backgroundColor: bgcolor }]}>
        <Text style={styles.resultLabel}>Your Blood Pressure Stage</Text>
        <Text style={styles.resultValue}>{resultval}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleViewChart}>
        <Text style={styles.buttonText}>View Chart</Text>
      </TouchableOpacity>
    </ScrollView>
    <AdBanner />
    </View>
  );
};

export default BloodPressureResultScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  valuesBox: {
    marginBottom: 20,
    alignItems: 'center',
    position: 'absolute',
    top: '48%',
    left: '44%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  valueText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  resultBox: {
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
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
  button: {
    backgroundColor: '#16ABFF',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
