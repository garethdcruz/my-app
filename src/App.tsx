import { useState, useEffect } from 'react';
import './App.css';
import {
  addTaskToFirestore,
  fetchTasksFromFirestore,
  deleteTaskFromFirestore,
  markTaskCompleteInFirestore,
} from './Firebase.tsx';

function App() {
  const [tasks, setTasks] = useState<{ id: string; task: string; completed: boolean }[]>([]);
  const [newTask, setNewTask] = useState('');

  // Fetch tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      const fetchedTasks = await fetchTasksFromFirestore();
      setTasks(fetchedTasks);
    };
    loadTasks();
  }, []);

  const addTask = async () => {
    if (newTask.trim()) {
      await addTaskToFirestore(newTask); // Add task to Firestore
      const updatedTasks = await fetchTasksFromFirestore(); // Fetch updated tasks
      console.log("Updated tasks:", updatedTasks); // Debug log
      setTasks(updatedTasks); // Update state
      setNewTask(''); // Clear input
    }
  };
  

  const removeTask = async (id: string) => {
    await deleteTaskFromFirestore(id);
    const updatedTasks = await fetchTasksFromFirestore();
    setTasks(updatedTasks);
  };

  const markTaskComplete = async (id: string) => {
    await markTaskCompleteInFirestore(id);
    const updatedTasks = await fetchTasksFromFirestore();
    setTasks(updatedTasks);
  };

  return (
    <div className="todo-app">
      <header>
        <h1>To-Do List</h1>
      </header>
      <div className="todo-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul className="todo-list">
        {tasks.map(({ id, task, completed }) => (
          <li key={id}>
            <span style={{ textDecoration: completed ? 'line-through' : 'none' }}>{task}</span>
            {!completed && <button onClick={() => markTaskComplete(id)}>Complete</button>}
            <button onClick={() => removeTask(id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
