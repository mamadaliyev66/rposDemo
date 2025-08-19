import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

/**
 * Uploads an image file to a specified path in Firebase Storage.
 *
 * @param {string} uri - The local URI of the image on the device (from the image picker).
 * @param {string} filePath - The path and filename for the image in Firebase Storage (e.g., 'menuItems/osh.jpg').
 * @param {function} [onProgress] - An optional callback function to track upload progress. It receives a number between 0 and 100.
 * @returns {Promise<string>} A promise that resolves with the public download URL of the uploaded image.
 * @throws {Error} Throws an error if the upload fails.
 */
export const uploadImageAndGetURL = (uri, filePath, onProgress) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Fetch the image data from the local URI as a blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // 2. Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, filePath);

      // 3. Start the upload task
      const uploadTask = uploadBytesResumable(storageRef, blob);

      // 4. Listen for state changes, errors, and completion of the upload.
      uploadTask.on('state_changed',
        (snapshot) => {
          // Optional: Report progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(progress));
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Upload failed:", error);
          reject(new Error("Image upload failed. Please try again."));
        },
        async () => {
          // 5. Handle successful uploads on complete
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL); // Resolve the promise with the URL
          } catch (error) {
            reject(new Error("Could not get download URL."));
          }
        }
      );
    } catch (error) {
      console.error("Error creating blob:", error);
      reject(new Error("Failed to prepare image for upload."));
    }
  });
};