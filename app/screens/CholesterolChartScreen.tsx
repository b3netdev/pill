import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import AdBanner from '../components/AdBanner';

const CholesterolChartScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cholesterol Levels</Text>
      <Text style={styles.description}>
        See the chart below to find out various cholesterol levels.
      </Text>

      {/* Total Cholesterol */}
      <ChartRow
        label="Total blood cholesterol"
        values={['Below 200', '201 to 239', 'Above 239']}
        colors={['#d0f0c0', '#fff8b0', '#f8b0b0']}
      />

      {/* LDL Cholesterol */}
      <ChartRow
        label="LDL cholesterol"
        values={['Below 129', '130 to 159', '160 to 189', 'Above 189']}
        colors={['#d0f0c0', '#fff8b0', '#f9ccac', '#f08080']}
      />

      {/* HDL Cholesterol */}
      <ChartRow
        label="HDL cholesterol"
        values={['Above 59', 'Below 40']}
        colors={['#d0f0c0', '#f8b0b0']}
      />

      {/* Triglyceride */}
      <ChartRow
        label="Triglyceride"
        values={['Below 150', '150 to 199', '200 to 499', 'Above 499']}
        colors={['#d0f0c0', '#fff8b0', '#f9ccac', '#f08080']}
      />

      {/* Footer */}
      <Text style={styles.footer}>* All values are in milligrams per deciliter (mg/dL)</Text>
    </ScrollView>
    <AdBanner />
    </View>
  );
};

const ChartRow = ({
  label,
  values,
  colors,
}: {
  label: string;
  values: string[];
  colors: string[];
}) => (
  <View style={styles.rowContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.valuesRow}>
      {values.map((val, idx) => (
        <Text key={idx} style={[styles.cell, { backgroundColor: colors[idx] }]}>
          {val}
        </Text>
      ))}
    </View>
  </View>
);

export default CholesterolChartScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  rowContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  valuesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  cell: {
    flexGrow: 1,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 4,
    fontSize: 13,
    color: '#000',
  },
  footer: {
    fontSize: 13,
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
  },
});
