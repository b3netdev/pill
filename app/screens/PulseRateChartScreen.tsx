import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AdBanner from '../components/AdBanner';

const PulseRateChartScreen: React.FC = () => {
  const renderRow = (label: string, data: string[], color?: 'green' | 'yellow' | 'red') => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.headerCell, color && styles[color]]}>{label}</Text>
      {data.map((item, idx) => (
        <Text key={idx} style={[styles.cell, color ? styles[color] : undefined]}>{item}</Text>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pulse Rate Chart</Text>

      {/* Child Section */}
      <Text style={styles.sectionTitle}>Child</Text>
      {renderRow('Age', ['0-3 mo', '3-6 mo', '6-12 mo', '1-3 yr', '3-6 yr', '6-12 yr', '12+ yr'])}
      {renderRow('Heart Rate', ['100-150', '90-120', '80-120', '70-110', '65-110', '60-95', '55-85'], 'green')}

      {/* Women Section */}
      <Text style={styles.sectionTitle}>Women</Text>
      {renderRow('Age', ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'])}
      {renderRow('Athlete', ['54-60', '54-59', '54-59', '54-60', '54-59', '54-59'], 'green')}
      {renderRow('Good', ['61-69', '60-68', '60-68', '60-67', '60-67', '60-68'], 'green')}
      {renderRow('Above AV', ['70-73', '69-72', '70-73', '70-73', '69-72', '69-72'], 'yellow')}
      {renderRow('Average', ['74-78', '74-77', '74-77', '74-77', '74-77', '73-76'], 'yellow')}
      {renderRow('Below AV', ['79-84', '77-82', '77-83', '78-83', '78-83', '77-84'], 'red')}
      {renderRow('Poor', ['85+', '83+', '84+', '84+', '84+', '85+'], 'red')}

      {/* Men Section */}
      <Text style={styles.sectionTitle}>Men</Text>
      {renderRow('Age', ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'])}
      {renderRow('Athlete', ['49-55', '49-54', '50-56', '50-57', '51-56', '50-55'], 'green')}
      {renderRow('Good', ['56-65', '55-65', '57-66', '58-67', '57-67', '56-65'], 'green')}
      {renderRow('Above AV', ['66-69', '66-70', '67-70', '68-71', '69-73', '66-69'], 'yellow')}
      {renderRow('Average', ['70-73', '71-74', '72-76', '72-76', '72-77', '73-76'], 'yellow')}
      {renderRow('Below AV', ['74-81', '75-81', '76-82', '76-83', '77-83', '74-79'], 'red')}
      {renderRow('Poor', ['82+', '83+', '82+', '84+', '84+', '80+'], 'red')}
    </ScrollView>
    <AdBanner />
      </View>
  );
};

export default PulseRateChartScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 6,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  cell: {
    flex: 1,
    padding: 6,
    textAlign: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
    fontSize: 13,
  },
  headerCell: {
    fontWeight: 'bold',
  },
  green: {
    backgroundColor: '#d0f0c0',
  },
  yellow: {
    backgroundColor: '#fff8b0',
  },
  red: {
    backgroundColor: '#f8b0b0',
  },
});
