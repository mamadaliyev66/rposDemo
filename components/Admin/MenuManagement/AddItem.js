import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../../../firebase/config';

const AddItemScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'You need to allow access to your photos.');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!pickerResult.canceled) {
        setImageUri(pickerResult.assets[0].uri);
      }
    } catch (err) {
      console.error('Image Picker Error:', err);
      Alert.alert('Error', 'Could not open image picker.');
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setImageUri(null);
    setUploadProgress(0);
  };

  const handleAddItem = async () => {
    if (!name.trim() || !price.trim() || !category.trim() || !imageUri) {
      Alert.alert('Incomplete Form', 'Please fill all fields and select an image.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid number for the price.');
      return;
    }

    setLoading(true);

    try {
      // Upload image
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = `menuItems/${Date.now()}-${name.replace(/\s+/g, '-')}`;
      const storageRef = ref(storage, filename);

      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error('Upload Error:', error);
          Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Save to Firestore
          await addDoc(collection(db, 'menuItems'), {
            name: name.trim(),
            description: description.trim(),
            price: parsedPrice,
            category: category.trim(),
            imageUrl: downloadURL,
            isAvailable: true,
            createdAt: serverTimestamp(),
          });

          setLoading(false);
          resetForm();
          Alert.alert('Success', 'Menu item added successfully!');
          navigation.goBack();
        }
      );
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'An error occurred while adding the item.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Uploading: {uploadProgress}%</Text>
        <Text style={styles.loadingSubText}>Please wait...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Add New Menu Item</Text>

        <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePickerText}>Select an Image</Text>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Item Name (e.g., Osh)"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Price (e.g., 30000)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Category (e.g., Issiq ovqatlar)"
          value={category}
          onChangeText={setCategory}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddItem}
          disabled={loading}
        >
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#343a40',
  },
  imagePicker: {
    width: '100%',
    height: 200,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ced4da',
    overflow: 'hidden',
  },
  imagePickerText: {
    color: '#495057',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
  },
  loadingSubText: {
    marginTop: 5,
    fontSize: 14,
    color: '#6c757d',
  },
});

export default AddItemScreen;
