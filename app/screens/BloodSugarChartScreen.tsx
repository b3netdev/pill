import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import AdBanner from '../components/AdBanner';

const BloodSugarChartScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Blood Sugar Levels</Text>
      <Text style={styles.description}>
        See the chart below to find out various blood sugar stages.
      </Text>

      {/* Normal */}
      <ChartSection title="Normal (mg/dL)" headerStyle={styles.normalHeader} rows={[
        ['Fasting', 'Less than 100'],
        ['Random', 'Less than 140'],
        ['Post Meal (2 hours)', 'Less than 140'],
      ]} valueStyle={styles.normalCell} />

      {/* Pre-Diabetes */}
      <ChartSection title="Pre-Diabetes (mg/dL)" headerStyle={styles.prediabetesHeader} rows={[
        ['Fasting', '100-125'],
        ['Random', '140-199'],
        ['Post Meal (2 hours)', '140-200'],
      ]} valueStyle={styles.preCell} />

      {/* Diabetes */}
      <ChartSection title="Diabetes (mg/dL)" headerStyle={styles.diabetesHeader} rows={[
        ['Fasting', '126 and greater'],
        ['Random', '200 and greater'],
        ['Post Meal (2 hours)', '200 or greater'],
      ]} valueStyle={styles.diabetesCell} />

      <Text style={styles.footer}>Source: kidneyabc</Text>
    </ScrollView>
    <AdBanner />
    </View>
  );
};

const ChartSection = ({
  title,
  rows,
  headerStyle,
  valueStyle,
}: {
  title: string;
  rows: [string, string][];
  headerStyle: any;
  valueStyle: any;
}) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, headerStyle]}>{title}</Text>
    {rows.map(([label, value], index) => (
      <View key={index} style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, valueStyle]}>{value}</Text>
      </View>
    ))}
  </View>
);

export default BloodSugarChartScreen;

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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    color: '#fff',
  },
  normalHeader: { backgroundColor: '#a5bd4c' },
  prediabetesHeader: { backgroundColor: '#f9ccac' },
  diabetesHeader: { backgroundColor: '#f08080' },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  label: {
    width: '50%',
    fontSize: 14,
    color: '#333',
  },
  value: {
    width: '50%',
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
  },
  normalCell: { color: '#507d2a' },
  preCell: { color: '#b58b00' },
  diabetesCell: { color: '#b22222' },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
  },
});
