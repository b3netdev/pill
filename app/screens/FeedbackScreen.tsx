import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AdBanner from '../components/AdBanner';

const FeedbackScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitFeedback = () => {
    if (!name || !email || !comments) {
      Alert.alert('Please fill out all fields');
      return;
    }

    // Normally send data to API or backend
    console.log('Feedback submitted:', { name, email, comments });

    setSubmitted(true);
    setName('');
    setEmail('');
    setComments('');
    Alert.alert('Thank you!', 'Feedback Submitted Successfully!');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>

      {/* Name Field */}
      <View style={styles.formRow}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email Field */}
      <View style={styles.formRow}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Comments Field */}
      <View style={styles.formRow}>
        <Text style={styles.label}>Comments</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter your comments"
          multiline
          numberOfLines={5}
          value={comments}
          onChangeText={setComments}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={submitFeedback}>
        <Text style={styles.submitText}>Submit Feedback</Text>
      </TouchableOpacity>

      {/* Optional: Confirmation */}
      {submitted && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Feedback Submitted Successfully!</Text>
        </View>
      )}
    </ScrollView>
    <AdBanner />
    </View>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formRow: {
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#16ABFF',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultBox: {
    marginTop: 20,
    backgroundColor: '#8FBFF5',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  resultText: {
    fontWeight: 'bold',
    color: '#003366',
  },
});
