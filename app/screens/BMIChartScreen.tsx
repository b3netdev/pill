import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AdBanner from '../components/AdBanner';

const BMIChartScreen: React.FC = () => {
  const categories = [
    {
      label: 'Underweight',
      description: 'Below 18.5',
      backgroundColor: '#ffb2bd',
    },
    {
      label: 'Healthy',
      description: '18.5 - 24.9',
      backgroundColor: '#a5bd4c',
    },
    {
      label: 'Overweight',
      description: '25.0 - 29.9',
      backgroundColor: '#ffdb58',
    },
    {
      label: 'Obese',
      description: '30.0 and Above',
      backgroundColor: '#fe492e',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>BMI Chart</Text>
      {categories.map((item, index) => (
        <View key={index} style={[styles.categoryBox, { backgroundColor: item.backgroundColor }]}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      ))}
    </ScrollView>
    <AdBanner />
    </View>
  );
};

export default BMIChartScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  categoryBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: 16,
    color: '#000',
  },
});
