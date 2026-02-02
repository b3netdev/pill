import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AdBanner from '../components/AdBanner';

const BloodPressureChartScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Blood Pressure Stages</Text>
      <Text style={styles.description}>
        See the chart below to find out various blood pressure stages.
      </Text>

      {sections.map((section, index) => (
        <View key={index}>
          <Text style={[styles.sectionHeader, styles[section.style as keyof typeof styles]]}>
            {section.title}
          </Text>
          {section.rows.map((row, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={[styles.value, styles[section.cellStyle]]}>{row.value}</Text>
            </View>
          ))}
        </View>
      ))}

      <Text style={styles.footer}>Source: American Heart Association</Text>
    </ScrollView>
    <AdBanner />
    </View>
  );
};

export default BloodPressureChartScreen;

const sections: {
  title: string;
  style: keyof typeof styles;
  cellStyle: keyof typeof styles;
  rows: { label: string; value: string }[];
}[] = [
  {
    title: 'Low Blood Pressure (Hypotension)',
    style: 'lowHeader',
    cellStyle: 'lowCell',
    rows: [
      { label: 'Systolic (upper #)', value: 'Less than 80' },
      { label: 'Diastolic (lower #)', value: 'Less than 60' },
    ],
  },
  {
    title: 'Normal',
    style: 'normalHeader',
    cellStyle: 'normalCell',
    rows: [
      { label: 'Systolic (upper #)', value: '80–129' },
      { label: 'Diastolic (lower #)', value: '60–80' },
    ],
  },
  {
    title: 'High Normal',
    style: 'highNormalHeader',
    cellStyle: 'highNormalCell',
    rows: [
      { label: 'Systolic (upper #)', value: '130–139' },
      { label: 'Diastolic (lower #)', value: '81–89' },
    ],
  },
  {
    title: 'High Blood Pressure (Hypertension Stage 1)',
    style: 'stage1Header',
    cellStyle: 'stage1Cell',
    rows: [
      { label: 'Systolic (upper #)', value: '140–159' },
      { label: 'Diastolic (lower #)', value: '90–99' },
    ],
  },
  {
    title: 'High Blood Pressure (Hypertension Stage 2)',
    style: 'stage2Header',
    cellStyle: 'stage2Cell',
    rows: [
      { label: 'Systolic (upper #)', value: '160 or higher' },
      { label: 'Diastolic (lower #)', value: '100 or higher' },
    ],
  },
  {
    title: 'High Blood Pressure Crisis (Seek Emergency Care)',
    style: 'crisisHeader',
    cellStyle: 'crisisCell',
    rows: [
      { label: 'Systolic (upper #)', value: 'Higher than 180' },
      { label: 'Diastolic (lower #)', value: 'Higher than 110' },
    ],
  },
];

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    borderRadius: 6,
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
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
  lowHeader: { backgroundColor: '#aad4f5' },
  normalHeader: { backgroundColor: '#a5bd4c' },
  highNormalHeader: { backgroundColor: '#ffe399' },
  stage1Header: { backgroundColor: '#ffb347' },
  stage2Header: { backgroundColor: '#ff7373' },
  crisisHeader: { backgroundColor: '#d9534f' },

  lowCell: { color: '#007acc' },
  normalCell: { color: '#507d2a' },
  highNormalCell: { color: '#b58b00' },
  stage1Cell: { color: '#b95e00' },
  stage2Cell: { color: '#b22222' },
  crisisCell: { color: '#800000' },

  footer: {
    marginTop: 24,
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
  },
});
