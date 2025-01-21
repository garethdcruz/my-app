import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

// Firestore config
const firebaseConfig = {
  apiKey: "AIzaSyB8ixElwYL5m-iikcYMfFxiW0o5t5zOWx0",
  authDomain: "my-app-d110d.firebaseapp.com",
  projectId: "my-app-d110d",
  storageBucket: "my-app-d110d.firebasestorage.app",
  messagingSenderId: "99123018940",
  appId: "1:99123018940:web:463c719ee91249450364b9",
  measurementId: "G-D61VQX3DY6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// const addTaskToFirestore = async (task: string) => {
//     try {
//       console.log("Adding task:", task); // Debug log
//       await addDoc(collection(db, "tasks"), { task, completed: false });
//       console.log("Task added to Firestore");
//     } catch (error) {
//       console.error("Error adding task: ", error);
//     }
//   };
  

//   const fetchTasksFromFirestore = async (): Promise<{ id: string; task: string; completed: boolean }[]> => {
//     try {
//       const querySnapshot = await getDocs(collection(db, "tasks"));
//       const tasks = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         task: doc.data().task,
//         completed: doc.data().completed,
//       }));
//       console.log("Fetched tasks:", tasks); // Debug log
//       return tasks;
//     } catch (error) {
//       console.error("Error fetching tasks: ", error);
//       return [];
//     }
//   };

// Firestore CRUD Functions
const addTaskToFirestore = async (task: string, date: string, time: string) => {
  try {
    await addDoc(collection(db, "tasks"), { task, completed: false, date, time });
    console.log("Task added to Firestore");
  } catch (error) {
    console.error("Error adding task: ", error);
  }
};

const fetchTasksFromFirestore = async (): Promise<
  { id: string; task: string; completed: boolean; date: string; time: string }[]
> => {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      task: doc.data().task,
      completed: doc.data().completed,
      date: doc.data().date,
      time: doc.data().time,
    }));
    console.log("Fetched tasks:", tasks);
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    return [];
  }
};

  

const deleteTaskFromFirestore = async (id: string) => {
  try {
    await deleteDoc(doc(db, "tasks", id));
    console.log("Task deleted from Firestore");
  } catch (error) {
    console.error("Error deleting task: ", error);
  }
};

const markTaskCompleteInFirestore = async (id: string) => {
  try {
    await updateDoc(doc(db, "tasks", id), { completed: true });
    console.log("Task marked as complete");
  } catch (error) {
    console.error("Error updating task: ", error);
  }
};

export { addTaskToFirestore, fetchTasksFromFirestore, deleteTaskFromFirestore, markTaskCompleteInFirestore };
