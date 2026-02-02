import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AdBanner from '../components/AdBanner';

type RouteParams = {
  bmi: number;
};

const BMIResultScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { bmi } = route.params as RouteParams;

  let category = '';
  let backgroundColor = '';

  if (bmi < 18.5) {
    category = 'Underweight';
    backgroundColor = '#ffb2bd';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Healthy';
    backgroundColor = '#a5bd4c';
  } else if (bmi >= 25 && bmi <= 30) {
    category = 'Overweight';
    backgroundColor = '#ffdb58';
  } else if (bmi > 30) {
    category = 'Obese';
    backgroundColor = '#fe492e';
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>BMI Calculator</Text>

      <Image
        source={require('../assets/images/bmi-result.png')}
        style={styles.image}
      />

      <Text style={styles.bmiValue}>Your BMI is {bmi.toFixed(2)}</Text>

      <View style={[styles.resultBox, { backgroundColor }]}>
        <Text style={styles.resultText}>
          It appears you are in the <Text style={{ fontWeight: 'bold' }}>{category}</Text> category.
          However, it is always recommended you consult your health care provider or a health professional for further diagnosis or evaluation.
        </Text>
      </View>

      <TouchableOpacity style={styles.viewChart} onPress={() => navigation.navigate('BMIChart')}>
        <Text style={styles.chartText}>View Chart</Text>
      </TouchableOpacity>
    </ScrollView>
    <AdBanner />
    </View>
  );
};

export default BMIResultScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  image: {
    width: 200,
    height: 150,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  bmiValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  resultBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  resultText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
  },
  viewChart: {
    backgroundColor: '#16ABFF',
    padding: 12,
    borderRadius: 6,
  },
  chartText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
