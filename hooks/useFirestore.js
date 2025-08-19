import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

/**
 * A custom hook to fetch a collection from Firestore in real-time.
 *
 * @param {string} collectionName The name of the collection to fetch.
 * @param {string} [orderByField] An optional field to order the documents by.
 * @param {'asc' | 'desc'} [orderByDirection='asc'] The direction for ordering.
 * @returns {{data: Array, loading: boolean, error: string|null}} An object containing the fetched data, loading state, and any error.
 */
export const useFirestore = (collectionName, orderByField, orderByDirection = 'asc') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let collectionRef = collection(db, collectionName);
    let queryRef;

    // If an orderByField is provided, create a query with an orderBy clause
    if (orderByField) {
      queryRef = query(collectionRef, orderBy(orderByField, orderByDirection));
    } else {
      queryRef = query(collectionRef);
    }
    
    // onSnapshot creates a real-time listener
    const unsubscribe = onSnapshot(queryRef, 
      (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });
        
        setData(documents);
        setLoading(false);
      }, 
      (err) => {
        console.error(`Error fetching collection ${collectionName}:`, err);
        setError("Ma'lumotlarni yuklab bo'lmadi."); // "Could not fetch data."
        setLoading(false);
      }
    );

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();

  }, [collectionName, orderByField, orderByDirection]); // Rerun if collection or ordering changes

  return { data, loading, error };
};