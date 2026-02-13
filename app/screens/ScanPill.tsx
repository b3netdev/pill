import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import AdBanner from "../components/AdBanner";
import { useNavigation } from "@react-navigation/native";
import { useInterstitialAd } from "../components/InterstitialAdManager";

export default function ScanPill() {
  const navigation = useNavigation<any>();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [pilltext, setPilltext] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);

  const hasPreview = !!imageUri;
  const hasText = (pilltext || "").trim().length > 0;

  const statusLabel = useMemo(() => {
    if (isScanning) return "Scanning image…";
    if (!hasPreview) return "Ready to scan";
    if (hasPreview && !hasText) return "No text detected";
    return "Ready";
  }, [isScanning, hasPreview, hasText]);

  const requestCameraPermission = useCallback(async () => {
    if (Platform.OS !== "android") return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "This app needs camera access to scan pill labels.",
          buttonPositive: "Allow",
          buttonNegative: "Cancel",
          buttonNeutral: "Ask Me Later",
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) return true;

      Alert.alert(
        "Permission Required",
        "Camera permission is required to use the camera. Please enable it from Settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );

      return false;
    } catch (err) {
      console.warn(err);
      Alert.alert("Error", "Unable to request camera permission.");
      return false;
    }
  }, []);

  // optional: clean OCR text for imprint-like string
  const cleanImprint = (txt: string) => {
    return (txt || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 30);
  };

  const goToPillList = useCallback(
    (imprint: string) => {
      navigation.navigate("PillList", { imprint }); // ✅ pass param
    },
    [navigation]
  );

  const runOCR = useCallback(
    async (uri: string) => {
      setIsScanning(true);
      setPilltext("");

      try {
        const data = await TextRecognition.recognize(uri);
        const detectedRaw = (data?.text || "").trim();
        const detected = cleanImprint(detectedRaw);

        setPilltext(detected);

        if (!detected || detected.length <= 1) {
          Alert.alert(
            "No Text Detected",
            "Try taking a clearer photo with better lighting and zoom in on the imprint."
          );
          return;
        }

        if (detected.length > 20) {
          Alert.alert(
            "Text Too Long",
            "Detected text is too long. Please focus only on the pill imprint."
          );
          return;
        }

        // ✅ Navigate right after detection
        //goToPillList(detected);
      } catch (e) {
        console.log(e);
        Alert.alert("OCR Error", "Failed to recognize text from image.");
      } finally {
        setIsScanning(false);
      }
    },
    [goToPillList]
  );

  const pickImage = useCallback(async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 1,
      quality: 0.85,
    });

    if (result.didCancel) return;

    if (result.errorCode) {
      Alert.alert("Image Picker Error", result.errorMessage || result.errorCode);
      return;
    }

    const uri = result.assets?.[0]?.uri;
    if (!uri) {
      Alert.alert("Error", "No image selected.");
      return;
    }

    setImageUri(uri);
    await runOCR(uri);
  }, [runOCR]);

  const openCamera = useCallback(async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await launchCamera({
      mediaType: "photo",
      cameraType: "back",
      quality: 0.85,
      saveToPhotos: false,
    });

    if (result.didCancel) return;

    if (result.errorCode) {
      Alert.alert("Camera Error", result.errorMessage || result.errorCode);
      return;
    }

    const uri = result.assets?.[0]?.uri;
    if (!uri) {
      Alert.alert("Error", "No image captured");
      return;
    }

    setImageUri(uri);
    await runOCR(uri);
  }, [requestCameraPermission, runOCR]);

  const clearAll = useCallback(() => {
    setImageUri(null);
    setPilltext("");
    setIsScanning(false);
  }, []);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Take a clear photo of the imprint for best results. Only the imprint text is needed, so
            zoom in and fill the frame with the pill.
          </Text>
        </View>

        <View style={styles.statusPill}>
          {isScanning && <ActivityIndicator style={{ marginRight: 10 }} />}
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preview</Text>

          {!imageUri ? (
            <View style={styles.emptyPreview}>
              <Text style={styles.emptyIcon}>📷</Text>
              <Text style={styles.emptyTitle}>No image yet</Text>
              <Text style={styles.emptyText}>Tap “Open Camera” to scan a pill imprint.</Text>
            </View>
          ) : (
            <>
              <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
            </>
          )}

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.primaryBtn, isScanning && styles.btnDisabled]}
              onPress={openCamera}
              activeOpacity={0.85}
              disabled={isScanning}
            >
              <Text style={styles.primaryBtnText}>Open Camera</Text>
            </TouchableOpacity>

            <View style={{ width: 10 }} />

            <TouchableOpacity
              style={[styles.secondaryBtn, isScanning && styles.btnDisabled]}
              onPress={pickImage}
              activeOpacity={0.85}
              disabled={isScanning}
            >
              <Text style={styles.secondaryBtnText}>Gallery</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.ghostBtn, (!imageUri || isScanning) && styles.btnDisabled]}
              onPress={() => (imageUri ? runOCR(imageUri) : null)}
              activeOpacity={0.85}
              disabled={!imageUri || isScanning}
            >
              <Text style={styles.ghostBtnText}>Scan Again</Text>
            </TouchableOpacity>

            <View style={{ width: 10 }} />

            <TouchableOpacity
              style={[styles.ghostBtn, (!imageUri || isScanning) && styles.btnDisabled]}
              onPress={clearAll}
              activeOpacity={0.85}
              disabled={!imageUri || isScanning}
            >
              <Text style={styles.ghostBtnText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detected Text</Text>
          <View style={styles.textBox}>
            <Text style={styles.detectedText}>{hasText ? pilltext : "No text detected yet."}</Text>
          </View>

          {/* Optional manual navigate button */}
          <View style={styles.subbtnbox}>
            <TouchableOpacity
              style={[styles.smallBtn, (!hasText || isScanning) && styles.btnDisabled]}
              onPress={() => hasText && goToPillList(pilltext)}
              disabled={!hasText || isScanning}
              activeOpacity={0.85}
            >
              <Text style={styles.smallBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F7FB" },
  container: { padding: 16, paddingBottom: 28 },
  header: { marginTop: 8, marginBottom: 14 },
  subtitle: { marginTop: 6, fontSize: 15, color: "#B53E5C", lineHeight: 20, fontWeight: "600" },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E7EF",
    marginBottom: 14,
  },
  statusText: { fontSize: 13, color: "#333", fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ECECF3",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardTitle: { fontSize: 15, fontWeight: "800", color: "#111", marginBottom: 10 },

  emptyPreview: {
    height: 220,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6E7EF",
    backgroundColor: "#FBFBFE",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emptyIcon: { fontSize: 26, marginBottom: 10 },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: "#111", marginBottom: 6 },
  emptyText: { fontSize: 13, color: "#666B78", textAlign: "center", lineHeight: 18 },

  preview: { width: "100%", height: 240, borderRadius: 14, backgroundColor: "#F0F1F6" },
  smallMeta: { marginTop: 10, fontSize: 12, color: "#6A6F7D" },

  row: { flexDirection: "row", marginTop: 12 },
  primaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },

  secondaryBtn: {
    width: 110,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F2F3F7",
    borderWidth: 1,
    borderColor: "#E6E7EF",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: { color: "#111", fontSize: 15, fontWeight: "800" },

  ghostBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E7EF",
    alignItems: "center",
    justifyContent: "center",
  },
  ghostBtnText: { color: "#111", fontSize: 14, fontWeight: "800" },

  btnDisabled: { opacity: 0.5 },

  textBox: {
    borderRadius: 14,
    backgroundColor: "#FBFBFE",
    borderWidth: 1,
    borderColor: "#E6E7EF",
    padding: 12,
    minHeight: 90,
    alignItems: "center",
  },
  detectedText: { fontSize: 14, color: "#232633", lineHeight: 20 },

  subbtnbox: { alignItems: "center" },
  smallBtn: {
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#27A6F5",
    width: 250,
    marginTop: 12,
    elevation: 5,
  },
  smallBtnText: { color: "#fff", fontWeight: "900", fontSize: 15, textAlign: "center" },
});
