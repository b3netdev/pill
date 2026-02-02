import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator'; // Adjust the import path as necessary
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AdBanner from '../components/AdBanner';


const COLORS = [
  { id: 1, name: 'Black', hex: '#000000' },
  { id: 2, name: 'Blue', hex: '#16ABFF' },
  { id: 3, name: 'Brown', hex: '#450303' },
  { id: 4, name: 'Gray', hex: '#A9A9A9' },
  { id: 5, name: 'Orange', hex: '#FF9D43' },
  { id: 6, name: 'Pink', hex: '#FF97BC' },
  { id: 7, name: 'White', hex: '#FFFFFF' },
  { id: 8, name: 'Red', hex: '#FF3636' },
  { id: 9, name: 'Purple', hex: '#7322D9' },
  { id: 10, name: 'Turquoise', hex: '#65FAF1' },
  { id: 11, name: 'Yellow', hex: '#FFE926' },
];

const SHAPES = [
  { id: 1, name: 'Round', img: require('../assets/shape/01.png') },
  { id: 2, name: 'Capsule', img: require('../assets/shape/02.png') },
  { id: 3, name: 'Oval', img: require('../assets/shape/03.png') },
  { id: 4, name: 'Rectangle', img: require('../assets/shape/04.png') },
  { id: 5, name: 'Heptagon', img: require('../assets/shape/05.png') },
  { id: 6, name: 'Octagon', img: require('../assets/shape/06.png') },
  { id: 7, name: 'Semi Circle', img: require('../assets/shape/07.png') },
  { id: 8, name: 'Trapezoid', img: require('../assets/shape/08.png') },
  { id: 9, name: 'Triangle', img: require('../assets/shape/09.png') },
  { id: 10, name: 'Hexagon', img: require('../assets/shape/10.png') },
  { id: 11, name: 'Pentagon', img: require('../assets/shape/11.png') },
  { id: 12, name: 'Bullet', img: require('../assets/shape/12.png') },
  { id: 13, name: 'Heptagon', img: require('../assets/shape/13.png') },
  { id: 14, name: 'Gear', img: require('../assets/shape/14.png') },
  { id: 15, name: 'Double Circle', img: require('../assets/shape/15.png') },
  { id: 16, name: 'Freeform', img: require('../assets/shape/16.png') },
  { id: 17, name: 'Tear', img: require('../assets/shape/18.png') },
  { id: 18, name: 'Diamond', img: require('../assets/shape/19.png') },
];

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const PillIdentifierScreen: React.FC = () => {

  const navigation = useNavigation<NavigationProps>();
  
    const navigateTo = (screen: keyof RootStackParamList) => {
      navigation.navigate(screen as any);
    };

  const [imprint, setImprint] = useState('');
  const [suggestions, setSuggestions] = useState<{ imprint: string; author: string }[]>([]);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedColorValue, setSelectedColorValue] = useState('color');
  const [selectedShape, setSelectedShape] = useState<number | null>(null);
  const [selectedShapeValue, setSelectedShapeValue] = useState('shape');
  const [showPopup, setShowPopup] = useState(false);
  //const navigation = useNavigation<any>();

  const fetchSuggestions = async (text: string) => {
    if (text.length > 1) {
      try {
        const response = await fetch(
          `https://www.mobixed.com/apps/drug-fda/api/webapps.php?action=drug_full_auto_complete&limit=7&search=${text.replace(/[ ]+/g, ';')}`
        );
        const data = await response.json();
        if (data.action === 'success') {
          const results = data.result.map((item: any) => ({
            imprint: item.SPLIMPRINT.replace(/;/g, ' '),
            author: item.author,
          }));
          setSuggestions(results);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleImprintChange = (text: string) => {
    setImprint(text);
    fetchSuggestions(text);
  };

  const handleSuggestionSelect = (text: string) => {
    setImprint(text);
    setSuggestions([]);
  };

  const selectColorVal = (id: number, value: string) => {
    setSelectedColor(id);
    setSelectedColorValue(value);
  };
  
  const clearColor = () => {
    setSelectedColor(null);
    setSelectedColorValue('color');
  };

  const selectShapeVal = (id: number, value: string) => {
    setSelectedShape(id);
    setSelectedShapeValue(value);
  };
  
  const clearShape = () => {
    setSelectedShape(null);
    setSelectedShapeValue('shape');
  };

  const handleSearchNow = () => {
    const hasInput = imprint !== '' || selectedColorValue !== 'color' || selectedShapeValue !== 'shape';
  
    if (hasInput) {
      navigation.navigate('PillList', {
        imprint,
        color: selectedColorValue,
        shape: selectedShapeValue,
      });
    } else {
      Alert.alert('Attention', 'Please enter any one field');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
      <Text style={styles.heading}>Pill Search by Imprint, Shape or Color</Text>
      <Text style={styles.subheading}>Use the pill identifier tool to identify medications by visual appearance.</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          value={imprint}
          onChangeText={handleImprintChange}
          placeholder="Enter Imprint..."
          style={styles.input}
        />
        {imprint.length > 0 ? (
          <TouchableOpacity>
            <Ionicons onPress={() => setImprint('')} style={styles.clearText} name="close-circle" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Ionicons onPress={() => setShowPopup(true)} style={styles.info} name="information-circle"/>
          </TouchableOpacity>
        )}
        {imprint.length > 2 && suggestions.length > 0 && (
          <View style={styles.suggestionBox}>
            {suggestions.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => handleSuggestionSelect(item.imprint)}>
                <Text style={styles.suggestionItem}>
                  <Text style={styles.suggestionItemName}>{item.imprint + '\n'}</Text>
                <Text style={styles.suggestionItemAuthor}>{item.author}</Text>
                </Text>
                
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.sectionTitle}>
        <Text style={styles.selectText}>Select Color</Text>
        <Text onPress={clearColor} style={styles.clearSelector}>[Clear]</Text>
      </View>
      <View style={styles.colorGrid}>
        {COLORS.map((color) => (
          <View key={color.id}>
            <TouchableOpacity
              style={[
                styles.colorBox,
                { backgroundColor: color.hex, borderColor: color.hex },
                selectedColor === color.id && styles.activeColor,
              ]}
              onPress={() => selectColorVal(color.id, color.name)}
            >
              {selectedColor === color.id && (
                <Ionicons
                name="checkmark"
                style={color.name != 'White' ? styles.colorSelectmark : styles.colorSelectmarkForWhite}
              />
              )}
            </TouchableOpacity>
            <Text style={styles.colorName}>{color.name}</Text>
          </View>
        ))}
      </View>


      <View style={styles.sectionTitle}>
        <Text style={styles.selectText}>Select Shape</Text> 
        <Text onPress={clearShape} style={styles.clearSelector}>[Clear]</Text>
      </View>
      <View style={styles.shapeGrid}>
        {SHAPES.map((shape) => (
          <TouchableOpacity
            key={shape.id}
            style={styles.shapeBox}
            onPress={() => selectShapeVal(shape.id, shape.name)}
          >
            <Image source={shape.img} style={styles.shapeImg} />
            <Text style={styles.shapeLabel}>{shape.name}</Text>
            {selectedShape === shape.id && <Ionicons name="checkmark-circle" color="#000" style={styles.checkmark} />}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.searchBtn} onPress={handleSearchNow}>
        <Text style={styles.searchText}>Search Now</Text>
      </TouchableOpacity>

      {/* Imprint Popup */}
      <Modal visible={showPopup} transparent animationType="fade">
        <View style={styles.popupWrapper}>
          <TouchableOpacity style={styles.popupClose} onPress={() => setShowPopup(false)}>
            <Text style={{ fontSize: 20, color: '#fff', right:60, top:230 }}>x</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            activeOpacity={1}
            onPressOut={() => setShowPopup(false)}
          >
            <Image source={require('../assets/images/imprint.png')} style={styles.popupImg} />
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
    <AdBanner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  subheading: { fontSize: 14, marginBottom: 16 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  colorName: { fontSize: 12, textAlign: 'center', marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    padding: 12,
    borderRadius: 10,
  },
  info: { 
    fontSize: 22,
    position: 'absolute',
    right: 10,
    top: -12,
    borderRadius: 100,
    color: '#16ABFF',
  },
  clearText: {
    fontSize: 22,
    color: '#16ABFF',
    position: 'absolute',
    right: 10,
    top: -12,
    borderRadius: 100,
  },
  suggestionBox: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#75bff2',
    padding: 8,
    borderRadius: 10,
    zIndex: 99999999,
    elevation: 5,
  },
  suggestionItem: { 
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#fff',
   },
  suggestionItemName: { fontWeight: '700' },
  suggestionItemAuthor: { fontSize: 12},
  sectionTitle: { 
    fontWeight: '600', 
    marginTop: 20, 
    marginBottom: 15, 
    width:'100%', 
    display:'flex', 
    justifyContent:'space-between',
    flexDirection:'row',
    alignItems:'center',
    flexWrap:'wrap',
  },
  selectText: {
    fontSize: 16,
    fontWeight: '700',
  },
  clearSelector: {
    color: '#16ABFF',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  colorBox: {
    width: 70,
    height: 32,
    margin: 4,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 5,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // Android shadow
    //zIndex: -1,
  },
  activeColor: {
    borderColor: '#333',
    borderWidth: 2,
    //backgroundColor: '#fff',
  },
  checkmark: { color: '#000', fontSize: 16 },
  colorSelectmark: { 
    color: '#fff',
    fontSize: 22 ,
  },
  colorSelectmarkForWhite: { 
    color: '#000',
    fontSize: 22 ,
  },
  shapeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  shapeBox: {
    alignItems: 'center',
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 7,
    paddingBottom: 2,
    width: '20%',
    height: 70,
    backgroundColor: '#f2f2f2',
  },
  shapeImg: {
    width: 40,
    height: 35,
    resizeMode: 'contain',
  },
  shapeLabel: {
    textAlign: 'center',
    fontSize: 10,
    marginTop: 2,
  },
  searchBtn: {
    backgroundColor: '#16ABFF',
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 24,
  },
  searchText: { textAlign: 'center', color: '#fff', fontWeight: '600' },
  popupWrapper: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  popupImg: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  
});

export default PillIdentifierScreen;
