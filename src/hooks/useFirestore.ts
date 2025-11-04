import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export interface FirestoreDocument {
  id: string;
  [key: string]: any;
}

export function useFirestore<T extends FirestoreDocument>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = []
) {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const collectionRef = collection(db, collectionName);

    // Add user filter
    const constraints = [
      where("userId", "==", currentUser.uid),
      ...queryConstraints,
    ];

    const q = query(collectionRef, ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setDocuments(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, collectionName]);

  const addDocument = async (data: Omit<T, "id">) => {
    if (!currentUser) throw new Error("Not authenticated");

    try {
      const docData = {
        ...data,
        userId: currentUser.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, collectionName), docData);
      return docRef.id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateDocument = async (id: string, data: Partial<T>) => {
    if (!currentUser) throw new Error("Not authenticated");

    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    if (!currentUser) throw new Error("Not authenticated");

    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    documents,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
  };
}
