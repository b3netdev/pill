// app/navigation/AppNavigator.tsx
import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import { CompositeNavigationProp } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();

import Analytics from '../analytics/AnalyticsService';

import HomeScreen from '../screens/HomeScreen';
import PillIdentifierScreen from '../screens/PillIdentifierScreen';
import PillListScreen from '../screens/PillListScreen';
import DrugDetailsScreen from '../screens/DrugDetailsScreen';
import ImprintSearchScreen from '../screens/ImprintSearchScreen';
import DrugSearchScreen from '../screens/DrugSearchScreen';
import InteractionCheckerScreen from '../screens/InteractionCheckerScreen';
import DiseaseSearchScreen from '../screens/DiseaseSearchScreen';
import DiseaseDetailsScreen from '../screens/DiseaseDetailsScreen';
import DrugIndexScreen from '../screens/DrugIndexScreen';
import DrugIndexListScreen from '../screens/DrugIndexListScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import PillReminderScreen from '../screens/PillReminderScreen';
import PillReminderCreateScreen from '../screens/PillReminderCreateScreen';
import BMICalculatorScreen from '../screens/BMICalculatorScreen';
import BMIResultScreen from '../screens/BMIResultScreen';
import BMIChartScreen from '../screens/BMIChartScreen';
import PulseRateCalculatorScreen from '../screens/PulseRateCalculatorScreen';
import PulseRateResultScreen from '../screens/PulseRateResultScreen';
import PulseRateChartScreen from '../screens/PulseRateChartScreen';
import CholesterolCalculatorScreen from '../screens/CholesterolCalculatorScreen';
import CholesterolResultScreen from '../screens/CholesterolResultScreen';
import CholesterolChartScreen from '../screens/CholesterolChartScreen';
import BloodSugarCalculatorScreen from '../screens/BloodSugarCalculatorScreen';
import BloodSugarResultScreen from '../screens/BloodSugarResultScreen';
import BloodSugarChartScreen from '../screens/BloodSugarChartScreen';
import BloodPressureCalculatorScreen from '../screens/BloodPressureCalculatorScreen';
import BloodPressureResultScreen from '../screens/BloodPressureResultScreen';
import BloodPressureChartScreen from '../screens/BloodPressureChartScreen';
import MyMedListSreen from '../screens/MyMedListScreen';
import PrescriptionSaveScreen from '../screens/PrescriptionSaveScreen';
import PrescriptionCreateScreen from '../screens/PrescriptionCreateScreen';
import SplashScreen from '../screens/SplashScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import ScanPill from '../screens/ScanPill';

export type RootStackParamList = {
  ScanPill:undefined;
  MainDrawer: undefined;
  PillIdentifier: undefined;
  PillList: { imprint: string; color: string; shape: string };
  DrugDetails: {
    drugName: string;
    data: { name: string; labeler: string; mpc_imprint: string };
  };
  ImprintSearch: undefined;
  InteractionChecker: undefined;
  DrugSearch: undefined;
  DiseaseSearch: undefined;
  DiseaseResults: { diseaseName: string };
  DrugIndex: undefined;
  DrugIndexList: { letter: string; type: 'b' | 'g' };
  PillReminder: undefined;
  FeedbackScreen: undefined;
  PillReminderCreate: undefined;
  BMICalculator: undefined;
  BMIResult: { bmi: number };
  BMIChart: undefined;
  PulseRateCalculator: undefined;
  PulseRateResult: { plusrate: string; result: string; bgcolor: string };
  PulseRateChart: undefined;
  CholesterolCalculator: undefined;
  CholesterolResult: {
    totalCholesterolResult: string;
    ldlCholesterolResult: string;
    hdlCholesterolResult: string;
    triglycerideResult: string;
    ratioResult: string;
  };
  CholesterolChart: undefined;
  BloodSugarCalculator: undefined;
  BloodSugarResult: {
    sugerlavel: string;
    resultval: string;
    bgcolor: string;
  };
  BloodSugarChart: undefined;
  BloodPressureCalculator: undefined;
  BloodPressureResult: {
    syscolic: string;
    dycolic: string;
    resultval: string;
    bgcolor: string;
  };
  BloodPressureChart: undefined;
  MyMedList: undefined;
  PrescriptionSaveScreen: undefined;
  PrescriptionCreateScreen: undefined;
  Splash: undefined;
  Home: undefined;
};

export type DrawerParamList = {
  Home: undefined;
  PillIdentifier: undefined;
  FeedbackScreen: undefined;
};

export type HomeScreenNavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<DrawerParamList>,
  NativeStackNavigationProp<RootStackParamList, 'MainDrawer'>
>;

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = ({ navigation }: any) => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: '#839fcd' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        headerTitleAlign: 'center',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Drawer.Screen name="FeedbackScreen" component={FeedbackScreen} options={{ title: 'Feedback' }} />
    </Drawer.Navigator>
  );
};

const SPLASH = 'Splash';

const AppNavigator: React.FC = () => {
  const navRef = useRef<any>(null);
  const routeNameRef = useRef<string | undefined>(undefined);

  return (
    <NavigationContainer
      ref={navRef}
      onReady={() => {
        const route = navRef.current?.getCurrentRoute();
        routeNameRef.current = route?.name;
        const name = route?.name;
        if (name && name !== SPLASH) void Analytics.screen(name);
      }}
      onStateChange={() => {
        const prev = routeNameRef.current;
        const route = navRef.current?.getCurrentRoute();
        const current = route?.name;
        if (current && current !== prev) {
          if (current !== SPLASH) void Analytics.screen(current);
          routeNameRef.current = current;
        }
      }}
    >
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainDrawer" component={DrawerNavigator} options={{ headerShown: false, title: 'Home' }} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Home',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="PillIdentifier"
          component={PillIdentifierScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Pill Identifier',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="ScanPill"
          component={ScanPill}
          options={{
            headerTitleAlign: 'center',
            title: 'Pill Scanner',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="PillList"
          component={PillListScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Pill List',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="DrugDetails"
          component={DrugDetailsScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Drug Details',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="ImprintSearch"
          component={ImprintSearchScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Imprint Search',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="InteractionChecker"
          component={InteractionCheckerScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Interaction Checker',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="DrugSearch"
          component={DrugSearchScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Drug Search',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="MyMedList"
          component={MyMedListSreen}
          options={{
            headerTitleAlign: 'center',
            title: 'My Med List',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="DiseaseSearch"
          component={DiseaseSearchScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Disease Search',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="DiseaseResults"
          component={DiseaseDetailsScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Disease Details',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="DrugIndex"
          component={DrugIndexScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Drug Index',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="DrugIndexList"
          component={DrugIndexListScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Drug Index List',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="PrescriptionSaveScreen"
          component={PrescriptionSaveScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Save Prescription',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="PrescriptionCreateScreen"
          component={PrescriptionCreateScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Create Prescription',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="PillReminder"
          component={PillReminderScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Pill Reminder',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="PillReminderCreate"
          component={PillReminderCreateScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Create Reminder',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="BMICalculator"
          component={BMICalculatorScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'BMI Calculator',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="BMIResult"
          component={BMIResultScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'BMI Result',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="BMIChart"
          component={BMIChartScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'BMI Chart',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="PulseRateCalculator"
          component={PulseRateCalculatorScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Pulse Rate Calculator',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="PulseRateResult"
          component={PulseRateResultScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Pulse Rate Result',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="PulseRateChart"
          component={PulseRateChartScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Pulse Rate Chart',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="CholesterolCalculator"
          component={CholesterolCalculatorScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Cholesterol Calculator',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="CholesterolResult"
          component={CholesterolResultScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Cholesterol Result',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="CholesterolChart"
          component={CholesterolChartScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Cholesterol Chart',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="BloodSugarCalculator"
          component={BloodSugarCalculatorScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Blood Sugar Calculator',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="BloodSugarResult"
          component={BloodSugarResultScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Blood Sugar Result',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="BloodSugarChart"
          component={BloodSugarChartScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Blood Sugar Chart',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="BloodPressureCalculator"
          component={BloodPressureCalculatorScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Blood Pressure Calculator',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="BloodPressureResult"
          component={BloodPressureResultScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Blood Pressure Result',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
        <Stack.Screen
          name="BloodPressureChart"
          component={BloodPressureChartScreen}
          options={{
            headerTitleAlign: 'center',
            title: 'Blood Pressure Chart',
            headerStyle: { backgroundColor: '#839fcd' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
