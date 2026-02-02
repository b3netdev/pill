// components/CustomDrawerContent.tsx
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet, Alert, Share, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { DrawerContentComponentProps } from '@react-navigation/drawer';


const handleShare = async () => {
  try {
    await Share.share({
      message: `Hi, Check this out!!! I found this really amazing app Pill Identifier and Drug List. This app provides exhaustive information on drug and medication from a wide variety of sources and you can store medicines in a customized list. Download this app absolutely free of cost from the following link: https://pillidentifier.mobixed.com/`,
    });
  } catch (error) {
    Alert.alert('Error', 'Something went wrong while sharing.');
  }
};

const openPrivacyPolicy = async () => {
  const url = 'https://pillidentifier.mobixed.com/terms/privacy-policy.html';
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert('Error', "Can't open the URL");
  }
};

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView 
      {...props} 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/pill.png')}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.titletext}>Pill Identifier & Drug LIST</Text>
          <Text style={styles.subtitle}>Patient Care Edition</Text>
        </View>
      </View>
      
      <View style={styles.menuContainer}>
        <DrawerItem
          label="Home"
          icon={({ color, size }) => <Ionicons name="home-outline" size={size} color="#667eea" />}
          labelStyle={styles.drawerLabel}
          style={styles.drawerItem}
          onPress={() => {
            props.navigation.navigate('Home');
            props.navigation.closeDrawer();
          }}
        />
        <DrawerItem
          label="Feedback"
          icon={({ color, size }) => <Ionicons name="chatbubble-outline" size={size} color="#667eea" />}
          labelStyle={styles.drawerLabel}
          style={styles.drawerItem}
          onPress={() => {
            props.navigation.navigate('FeedbackScreen');
            props.navigation.closeDrawer();
          }}
        />
        <DrawerItem
          label="Tell A Friend"
          icon={({ color, size }) => <Ionicons name="share-outline" size={size} color="#667eea" />}
          labelStyle={styles.drawerLabel}
          style={styles.drawerItem}
          onPress={handleShare}
        />
        <DrawerItem
          label="Privacy Policy"
          icon={({ color, size }) => <Ionicons name="shield-checkmark-outline" size={size} color="#667eea" />}
          labelStyle={styles.drawerLabel}
          style={styles.drawerItem}
          onPress={openPrivacyPolicy}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 6.0.6</Text>
        <Text style={styles.footerText}>© 2025 Pill Identifier and Drug List</Text>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(246, 241, 241, 0.9)',
  },
  header: {
    backgroundColor: '#839fcd',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 10,
    borderRadius: 0,
    overflow: 'hidden',
    width: 80,
    height: 60,
    //backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    //show full image
    width: 80,
    height: 60,
  },
  titletext: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '400',
  },
  menuContainer: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  drawerItem: {
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: -5,
  },
  footer: {
    marginTop: 'auto',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 0,
  },
});

export default CustomDrawerContent;
