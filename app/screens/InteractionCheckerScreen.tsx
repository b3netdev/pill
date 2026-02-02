import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AdBanner from '../components/AdBanner';

type Suggestion = {
  label: string;   // text shown
  value: string;   // actual value added
  author?: string; // (unused here; API doesn't provide it)
};

const InteractionChekerScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // if you have a picker elsewhere, bind it here; default '' works for "all"
  const [selectOption] = useState<string>('g'); // e.g., 'brand' | 'generic' | '' etc.

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Debounce + cancelable fetch
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cancelInFlight = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  };

  const fetchSuggestions = (text: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.trim().length < 3) {
      cancelInFlight();
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        cancelInFlight();
        const controller = new AbortController();
        abortRef.current = controller;

        const formData = `action=auto_popup_array&med_type=${encodeURIComponent(selectOption)}&keyword=${encodeURIComponent(text)}`;
        console.log('Fetching suggestions with:', formData);
        const res = await fetch('https://www.mobixed.com/apps/drug-fda/ajax.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
          signal: controller.signal,
        });
        
        // Endpoint returns JSON object like { "0": "Paracetamol", "1": "Ibuprofen", ... }
        const data = await res.json();
        console.log('Autocomplete data:', data);

        if (!data || typeof data !== 'object') {
          setSuggestions([]);
          setShowDropdown(false);
          return;
        }

        const names = Object.values(data) as string[];
        const mapped: Suggestion[] = names
          .map((name) => String(name).trim())
          .filter(Boolean)
          .map((name) => ({ label: name, value: name }));

        setSuggestions(mapped);
        setShowDropdown(mapped.length > 0);
      } catch (e: any) {
        if (e?.name !== 'AbortError') {
          setSuggestions([]);
          setShowDropdown(false);
        }
      }
    }, 250); // debounce
  };

  const onChangeText = (text: string) => {
    setQuery(text);
    fetchSuggestions(text);
  };

  const addChip = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    const exists = selected.some((v) => v.toLowerCase() === clean.toLowerCase());
    if (!exists) setSelected((prev) => [...prev, clean]);
  };

  const removeChip = (value: string) => {
    setSelected((prev) => prev.filter((v) => v !== value));
  };

  const handlePickSuggestion = (s: Suggestion) => {
    addChip(s.value);
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleAdd = () => {
    if (query.trim().length === 0) {
      Alert.alert('Error', 'Please type a medicine name first.');
      return;
    }
    const exists = selected.some((v) => v.toLowerCase() === query.trim().toLowerCase());
    if (exists) {
      Alert.alert('Info', 'This medicine is already added.');
      return;
    }
    addChip(query);
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleCheckInteraction = async () => {
    if (selected.length < 2) {
      Alert.alert('Error', 'Add at least two medicines to check interactions.');
      return;
    }
    setLoading(true);
    setError('');
    setResult('');

    try {
      // Build your query from selected chips (adjust to your real endpoint)
      const q = encodeURIComponent(selected.join(';'));
      const url = `https://api.example.com/check-interaction?query=${q}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();

      if (data?.success) {
        setResult(String(data.result || ''));
      } else {
        setError(String(data?.message || 'No interaction found.'));
      }
    } catch (e) {
      setError('An error occurred while checking the interaction.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      cancelInFlight();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image
            source={require('../assets/images/drug-interaction-check.png')}
            style={styles.bannerImage}
          />
        </View>

        {/* Input + Add button (inline) */}
        <View style={styles.inputRow}>
          <View style={{ flex: 1, position: 'relative' }}>
            <TextInput
              style={styles.input}
              placeholder="Type medicine name"
              value={query}
              onChangeText={onChangeText}
              onSubmitEditing={handleAdd}
              returnKeyType="done"
            />

            {showDropdown && suggestions.length > 0 && (
              <View
                style={[
                  styles.dropdownBox,
                  Platform.OS === 'android'
                    ? { elevation: 6 }
                    : {
                        shadowColor: '#000',
                        shadowOpacity: 0.15,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 4 },
                      },
                ]}
              >
                {suggestions.map((s, idx) => (
                  <TouchableOpacity key={`${s.value}-${idx}`} onPress={() => handlePickSuggestion(s)}>
                    <View style={styles.dropdownItem}>
                      <Text style={styles.dropdownLabel}>{s.label}</Text>
                      {/* author not provided by this API; keep for future compatibility */}
                      {s.author ? <Text style={styles.dropdownAuthor}>{s.author}</Text> : null}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Chips */}
        {selected.length > 0 && (
          <View style={styles.chipsWrap}>
            {selected.map((value) => (
              <View style={styles.chip} key={value}>
                <Text style={styles.chipText}>{value}</Text>
                <TouchableOpacity onPress={() => removeChip(value)}>
                  <Ionicons name="close" size={16} style={styles.chipClose} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleCheckInteraction} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Checking…' : 'Check Interaction'}</Text>
        </TouchableOpacity>

        {loading && <Text>Loading...</Text>}
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          !!result && <RenderHTML contentWidth={300} source={{ html: result }} baseStyle={styles.result} />
        )}
      </ScrollView>
      <AdBanner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 16 },
  header: { alignItems: 'center', marginBottom: 20 },
  bannerImage: { width: 400, height: 200, resizeMode: 'contain' },

  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // if not supported in your RN, remove and keep marginLeft on addBtn
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  addBtn: {
    height: 50,
    width: 50,
    backgroundColor: '#28a745',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  dropdownBox: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 999,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  dropdownLabel: { fontSize: 14, fontWeight: '600', color: '#222' },
  dropdownAuthor: { fontSize: 12, color: '#666', marginTop: 2 },

  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef6ff',
    borderWidth: 1,
    borderColor: '#cfe3ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 8,
  },
  chipText: { color: '#244', fontSize: 14, marginRight: 6 },
  chipClose: { color: '#244' },

  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  error: { color: 'red', fontSize: 16, textAlign: 'center', marginTop: 10 },
  result: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default InteractionChekerScreen;
