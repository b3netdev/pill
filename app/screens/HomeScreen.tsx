import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useInterstitialAd } from '../components/InterstitialAdManager';
import AdBanner from '../components/AdBanner';

// Define navigation types
type RootStackParamList = {
  PillIdentifier: undefined;
  ImprintSearch: undefined;
  DrugSearch: undefined;
  MyMedList: undefined;
  PillReminder: undefined;
  DiseaseSearch: undefined;
  DrugIndex: undefined;
  PrescriptionList: undefined;
  BMICalculator: undefined;
  PulseRateCalculator: undefined;
  CholesterolCalculator: undefined;
  BloodSugarCalculator: undefined;
  BloodPressureCalculator: undefined;
  PrescriptionSaveScreen: undefined;
  InteractionChecker: undefined;
  
};

type DrawerParamList = {
  Home: undefined;
};

type NavigationProps = CompositeNavigationProp<
  DrawerNavigationProp<DrawerParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const { showAd } = useInterstitialAd();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{ paddingHorizontal: 16 }}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <Ionicons name="menu" size={26} color="#fff" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{ paddingHorizontal: 16 }}
          onPress={() => navigation.navigate('DrugSearch')}
        >
          <Ionicons name="search" size={26} color="#fff" />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      title: 'Home',
    });
  }, [navigation]);

  const navigateTo = (screen: keyof RootStackParamList) => {
    const screenList = [
      'PillIdentifier',
      'ImprintSearch',
      'DrugSearch',
      'MyMedList',
      'PillReminder',
      'DiseaseSearch',
      'DrugIndex',
      'PrescriptionSaveScreen',
      'BMICalculator',
      'PulseRateCalculator',
      'CholesterolCalculator',
      'BloodSugarCalculator',
      'BloodPressureCalculator',
      'PrescriptionList',
    ];
    // if ( screenList.includes(screen) && Math.random() < 0.5) {
    //   showAd();
    // }
    showAd();
     
    navigation.navigate(screen);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigateTo('PillIdentifier')}>
        <Image source={require('../assets/images/banner.png')} style={styles.banner} />
      </TouchableOpacity>

      <Text style={styles.heading}>What are you looking for?</Text>

      <View style={styles.grid}>
        {gridItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => navigateTo(item.screen)}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
    <AdBanner />
    </View>
  );
};

const gridItems: { label: string; icon: any; screen: keyof RootStackParamList }[] = [
  { label: 'Pill Identifier', icon: require('../assets/images/icon-1.png'), screen: 'PillIdentifier' },
  { label: 'Imprint Search', icon: require('../assets/images/icon-2.png'), screen: 'ImprintSearch' },
  //Interaction checker
  //{ label: 'Interaction Checker', icon: require('../assets/images/icon-15.png'), screen: 'InteractionChecker' },
  { label: 'Drug Search', icon: require('../assets/images/icon-3.png'), screen: 'DrugSearch' },
  { label: 'My Med List', icon: require('../assets/images/icon-4.png'), screen: 'MyMedList' },
  { label: 'Pill Reminder', icon: require('../assets/images/icon-5.png'), screen: 'PillReminder' },
  { label: 'Disease Search', icon: require('../assets/images/icon-6.png'), screen: 'DiseaseSearch' },
  { label: 'Drug Index', icon: require('../assets/images/icon-7.png'), screen: 'DrugIndex' },
  { label: 'Store Prescription', icon: require('../assets/images/icon-8.png'), screen: 'PrescriptionSaveScreen' },
  { label: 'BMI Calculator', icon: require('../assets/images/icon-9.png'), screen: 'BMICalculator' },
  { label: 'Pulse Rate', icon: require('../assets/images/icon-11.png'), screen: 'PulseRateCalculator' },
  { label: 'Cholesterol Calculator', icon: require('../assets/images/icon-12.png'), screen: 'CholesterolCalculator' },
  { label: 'Blood Sugar\nMeasurement', icon: require('../assets/images/icon-13.png'), screen: 'BloodSugarCalculator' },
  { label: 'Blood Pressure\nMeasurement', icon: require('../assets/images/icon-14.png'), screen: 'BloodPressureCalculator' },
];

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  banner: {
    height: 170,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 30,
    marginBottom: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    zIndex: 1,
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  label: {
    textAlign: 'center',
    fontSize: 14,
  },
});

export default HomeScreen;
