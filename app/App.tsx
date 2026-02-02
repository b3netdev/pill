// app/App.tsx
import React, { useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import { getDBConnection, resetDatabase, initializeDatabase } from './uitlity/database';
import mobileAds from 'react-native-google-mobile-ads';
import Analytics from './analytics/AnalyticsService'; // ✅ add


const App: React.FC = () => {
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const db = await getDBConnection();
        // Reset the database by dropping old tables and creating new ones
        //await resetDatabase();
        // if created successfully, show massage

        await initializeDatabase();

        console.log('Database initialized successfully');
        
        
      } catch (error) {
        console.error('Database initialization error:', error);
      }
    };
    setupDatabase();
  }
  , []);

  useEffect(() => {
    mobileAds()
      .initialize()
      .then(() => {
        console.log('AdMob initialized');
      });

  
    // Optional: Print a warning with your test device ID 
    // mobileAds().setRequestConfiguration({
    //   testDeviceIdentifiers: ['EMULATOR'], // logs your real device ID to console
    // });
  }, []);

  useEffect(() => {
    (async () => {
      await Analytics.setDefaults({
        app_version: '6.0.4', // you can read from constants if you prefer
      });
      // If you gate by consent, start disabled and enable later:
      // await Analytics.setCollectionEnabled(true);
    })();
  }, []);
  
  
  return <AppNavigator />;
};

export default App;
