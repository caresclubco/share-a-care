// src/services/adminService.js
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";

const db = getFirestore();

/**
 * Admin service for project management operations
 * Only authorized admin wallets should use these functions
 */
export const adminService = {
  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @returns {Promise<Object>} Created project with ID
   */
  createProject: async (projectData) => {
    try {
      // Add required fields
      const projectWithTimestamp = {
        ...projectData,
        currentAmount: 0,
        supportersCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "projects"),
        projectWithTimestamp
      );
      return { id: docRef.id, ...projectWithTimestamp };
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  /**
   * Update a project
   * @param {string} projectId - Project ID
   * @param {Object} projectData - Updated project data
   * @returns {Promise<void>}
   */
  updateProject: async (projectId, projectData) => {
    try {
      const projectRef = doc(db, "projects", projectId);

      // Add timestamp for update
      const updatedData = {
        ...projectData,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(projectRef, updatedData);
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  /**
   * Delete a project
   * @param {string} projectId - Project ID
   * @returns {Promise<void>}
   */
  deleteProject: async (projectId) => {
    try {
      const projectRef = doc(db, "projects", projectId);
      await deleteDoc(projectRef);
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  /**
   * Create a new care package (reward)
   * @param {Object} packageData - Care package data
   * @returns {Promise<Object>} Created care package with ID
   */
  createCarePackage: async (packageData) => {
    try {
      const packageWithTimestamp = {
        ...packageData,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "carePackages"),
        packageWithTimestamp
      );
      return { id: docRef.id, ...packageWithTimestamp };
    } catch (error) {
      console.error("Error creating care package:", error);
      throw error;
    }
  },

  /**
   * Update a care package
   * @param {string} packageId - Care package ID
   * @param {Object} packageData - Updated care package data
   * @returns {Promise<void>}
   */
  updateCarePackage: async (packageId, packageData) => {
    try {
      const packageRef = doc(db, "carePackages", packageId);

      const updatedData = {
        ...packageData,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(packageRef, updatedData);
    } catch (error) {
      console.error("Error updating care package:", error);
      throw error;
    }
  },

  /**
   * Delete a care package
   * @param {string} packageId - Care package ID
   * @returns {Promise<void>}
   */
  deleteCarePackage: async (packageId) => {
    try {
      const packageRef = doc(db, "carePackages", packageId);
      await deleteDoc(packageRef);
    } catch (error) {
      console.error("Error deleting care package:", error);
      throw error;
    }
  },

  /**
   * Add a publisher wallet that can create projects
   * @param {string} publisherWallet - Publisher wallet address
   * @returns {Promise<Object>} Created publisher with ID
   */
  addPublisher: async (publisherWallet) => {
    try {
      // Check if publisher already exists
      const publishersRef = collection(db, "publishers");
      const q = query(
        publishersRef,
        where("walletAddress", "==", publisherWallet)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error("Publisher already exists");
      }

      const publisherData = {
        walletAddress: publisherWallet,
        createdAt: serverTimestamp(),
        addedBy: "admin", // You might want to track which admin added this publisher
      };

      const docRef = await addDoc(publishersRef, publisherData);
      return { id: docRef.id, ...publisherData };
    } catch (error) {
      console.error("Error adding publisher:", error);
      throw error;
    }
  },

  /**
   * Remove a publisher
   * @param {string} publisherWallet - Publisher wallet address
   * @returns {Promise<void>}
   */
  removePublisher: async (publisherWallet) => {
    try {
      const publishersRef = collection(db, "publishers");
      const q = query(
        publishersRef,
        where("walletAddress", "==", publisherWallet)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Publisher not found");
      }

      // There should only be one document with this wallet address
      const publisherDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, "publishers", publisherDoc.id));
    } catch (error) {
      console.error("Error removing publisher:", error);
      throw error;
    }
  },

  /**
   * Get all publishers
   * @returns {Promise<Array>} List of publisher wallet addresses
   */
  getPublishers: async () => {
    try {
      const publishersRef = collection(db, "publishers");
      const querySnapshot = await getDocs(publishersRef);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting publishers:", error);
      throw error;
    }
  },
};
