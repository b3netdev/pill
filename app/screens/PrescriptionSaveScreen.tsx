import React, { use, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { getDBConnection } from '../uitlity/database'; // Adjust the import path as needed
import AdBanner from '../components/AdBanner';

type Prescription = {
  id: string;
  image1: string;
  image2?: string;
  tittle: string;
  description: string;
};


type PrescriptionSaveScreenRouteParams = {
  params?: {
    refresh?: boolean;
  };
};

const PrescriptionSaveScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<PrescriptionSaveScreenRouteParams, 'params'>>();
  const [prescriptionList, setPrescriptionList] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleStorePrescription = () => {
    navigation.navigate('PrescriptionCreateScreen');
  };
   
  // Fatch Prescriptions when back to this screen
  
  const currentRoute = useRoute<RouteProp<PrescriptionSaveScreenRouteParams, 'params'>>();
  useEffect(() => {
    if (currentRoute.params?.refresh) {
      setPrescriptionList([]); // Clear the list to refetch
    }
  }, [route.params?.refresh]);

  useEffect(() => {
    // Simulate fetching prescriptions from a database
    const fetchPrescriptions = async () => {
      const db = await getDBConnection();
      // Here you would typically fetch from the database
      const query = 'SELECT * FROM prescriptions ORDER BY created_at DESC';
      try {
        const results = await db.executeSql(query);
        const prescriptions: Prescription[] = results[0].rows.raw().map((row: any) => ({
          id: row.id.toString(),
          image1: row.image1,
          image2: row.image2,
          tittle: row.title,
          description: row.description,
        }));
        setPrescriptionList(prescriptions);
      }
      catch (error) {
        console.error('Error fetching prescriptions:', error);
        Alert.alert('Error', 'Failed to load prescriptions');
      }
    };

    fetchPrescriptions();
  }
  , []);

  // const handleEdit = () => {
  //   Alert.alert('Edit', 'Editing prescription...');
  //   setShowActions(false);
  // };

  const handleView = () => {
    setShowImageModal(true);
    setShowActions(false);
  };

  const handleDelete = () => {
    if (!selectedPrescription) return;
    // Here you would typically delete from the database
    const deletePrescription = async () => {
      try {
        const db = await getDBConnection();
        const query = 'DELETE FROM prescriptions WHERE id = ?';
        await db.executeSql(query, [selectedPrescription.id]);
        setPrescriptionList((prev) => prev.filter((item) => item.id !== selectedPrescription.id));
        Alert.alert('Delete', 'Prescription deleted');
      } catch (error) {
        console.error('Error deleting prescription:', error);
        Alert.alert('Error', 'Failed to delete prescription');
      }
    };
    deletePrescription();
    setSelectedPrescription(null);
    setShowImageModal(false);
    setShowActions(false);
    Alert.alert('Delete', 'Prescription deleted');
  };

  const renderPrescription = ({ item }: { item: Prescription }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image1 }} style={styles.thumb} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.tittle}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => {
          setSelectedPrescription(item);
          setShowActions(true);
        }}
      >
        <Text style={styles.menuIcon}>⋮</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {prescriptionList.length > 0 ? (
        <FlatList
          data={prescriptionList}
          keyExtractor={(item) => item.id}
          renderItem={renderPrescription}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <TouchableOpacity onPress={handleStorePrescription}>
            <Image
              source={require('../assets/images/prescription.png')}
              style={styles.placeholderImage}
            />
          </TouchableOpacity>
          <Text style={styles.emptyText}>No prescriptions saved yet</Text>
        </View>
      )}

      {/* Floating + Button */}
      <View style={styles.fab}>
        <TouchableOpacity onPress={handleStorePrescription}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Action Modal */}
      <Modal transparent visible={showActions} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowActions(false)}>
          <View style={styles.actionModal}>
            {/* <TouchableOpacity onPress={handleEdit}>
              <Text style={styles.modalOption}>✏️ Edit</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={handleView}>
              <Text style={styles.modalOption}>👁️ View</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Text style={styles.modalOption}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Image Modal */}
      <Modal visible={showImageModal} animationType="slide">
        <View style={styles.imageModalContainer}>
          <TouchableOpacity onPress={() => setShowImageModal(false)}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.imageScroll}>
            {selectedPrescription?.image1 && (
              <Image source={{ uri: selectedPrescription.image1 }} style={styles.fullImage} />
            )}
            {selectedPrescription?.image2 && (
              <Image source={{ uri: selectedPrescription.image2 }} style={styles.fullImage} />
            )}
          </ScrollView>
        </View>
      </Modal>

      

      <AdBanner />
    </View>
  );
};

export default PrescriptionSaveScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  screenTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  thumb: { width: 60, height: 60, borderRadius: 6, marginRight: 12 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  description: { fontSize: 14, color: '#666' },
  menuButton: { paddingHorizontal: 8 },
  menuIcon: { fontSize: 22 },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderImage: { width: 220, height: 300, marginBottom: 10 },
  emptyText: { fontSize: 16, color: '#888' },

  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionModal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    width: 200,
    alignItems: 'center',
  },
  modalOption: {
    paddingVertical: 10,
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
  },

  imageModalContainer: { flex: 1, backgroundColor: '#f7f7f7', paddingTop: 40 },
  backIcon: { fontSize: 26, paddingHorizontal: 16, marginBottom: 10 },
  imageScroll: { alignItems: 'center', paddingBottom: 30 },
  fullImage: { width: '90%', height: 300, marginVertical: 10, borderRadius: 12 },

  fab: {
    position: 'absolute',
    bottom: 80,
    right: 24,
    width: 58,
    height: 58,
    backgroundColor: '#16ABFF',
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
});
