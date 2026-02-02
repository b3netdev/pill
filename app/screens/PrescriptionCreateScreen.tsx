import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { getDBConnection } from '../uitlity/database';
import AdBanner from '../components/AdBanner';
import { useInterstitialAd } from '../components/InterstitialAdManager'; // Uncomment if you have an ad component


const PrescriptionCreateScreen: React.FC = () => {
  const { showAd } = useInterstitialAd(); // Call showAd function to ensure ad is ready
  const navigation = useNavigation<any>();
  const [tittle, setTittle] = useState('');
  const [description, setDescription] = useState('');
  const [frontImage, setFrontImage] = useState<string | undefined>();
  const [backImage, setBackImage] = useState<string | undefined>();

  const pickImage = (setter: (uri: string) => void) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Image selection failed');
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          if (uri) setter(uri);
        }
      }
    );
  };
  

  const handleSave = async () => {
    if (!tittle || !frontImage) {
      Alert.alert('Incomplete', 'Please provide a title and front image.');
      return;
    }
    const db = await getDBConnection();
    const query = `
      INSERT INTO prescriptions (title, description, image1, image2)
      VALUES (?, ?, ?, ?)
    `;
    const values = [tittle, description || '', frontImage, backImage || ''];

    try {
      await db.executeSql(query, values);
      console.log('Prescription saved successfully:', {
        title: tittle,
        description,
        frontImage,
        backImage,
      });
      setTittle('');
      setDescription('');
      setFrontImage(undefined);
      setBackImage(undefined);
    } catch (error) {
      console.error('Error saving prescription:', error);
      Alert.alert('Error', 'Failed to save prescription. Please try again.');
      return;
    }
    Alert.alert('Saved', 'Prescription saved successfully.');
    //asign the refresh parameter to true
    showAd(); // Show ad after saving
    
    navigation.navigate('PrescriptionSaveScreen', { refresh: true });
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Store Prescriptions</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={tittle}
        onChangeText={setTittle}
        placeholder="Enter title"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        multiline
      />

      <View style={styles.imageRow}>
        <View style={styles.imageColumn}>
          <TouchableOpacity
            style={styles.imageBox}
            onPress={() => pickImage((uri) => setFrontImage(uri))}
          >
            <Image
              source={
                frontImage
                  ? { uri: frontImage }
                  : require('../assets/images/upload-img.png')
              }
              style={styles.image}
            />
          </TouchableOpacity>
          <Text style={styles.imageLabel}>Front</Text>
        </View>

        <View style={styles.imageColumn}>
          <TouchableOpacity
            style={styles.imageBox}
            onPress={() => pickImage((uri) => setBackImage(uri))}
          >
            <Image
              source={
                backImage
                  ? { uri: backImage }
                  : require('../assets/images/upload-img.png')
              }
              style={styles.image}
            />
          </TouchableOpacity>
          <Text style={styles.imageLabel}>Back</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          (!tittle || !frontImage) && { opacity: 0.7 },
        ]}
        onPress={handleSave}
        disabled={!tittle || !frontImage}
      >
        <Text style={styles.saveText}>SAVE</Text>
      </TouchableOpacity>
    </ScrollView>
    <AdBanner />
    </View>
  );
};

export default PrescriptionCreateScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  imageColumn: {
    alignItems: 'center',
    flex: 1,
  },
  imageBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    width: 130,
    height: 130,
    marginBottom: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#16ABFF',
    paddingVertical: 14,
    borderRadius: 6,
    marginTop: 20,
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
