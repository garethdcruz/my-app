import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';
import {
  addTaskToFirestore,
  fetchTasksFromFirestore,
  deleteTaskFromFirestore,
  markTaskCompleteInFirestore,
} from './Firebase.tsx';

function App() {
  const [tasks, setTasks] = useState<{ id: string; task: string; completed: boolean; date: string; time: string }[]>([]);
  const [newTask, setNewTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTimePopUp, setShowTimePopUp] = useState(false); // Pop-up visibility
  const [taskToSetTime, setTaskToSetTime] = useState(''); // Task for which time is being set
  const [selectedTime, setSelectedTime] = useState(''); // Time selected by user

  // Fetch tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      const fetchedTasks = await fetchTasksFromFirestore();
      setTasks(fetchedTasks);
    };
    loadTasks();
  }, []);

  // Function to add a task
  const addTask = () => {
    if (newTask.trim()) {
      setTaskToSetTime(newTask); // Store the task for which the time is being set
      setShowTimePopUp(true); // Show the time pop-up
      setNewTask(''); // Reset task input
    }
  };
  

  // Function to set time for a task and save it
  const saveTaskWithTime = async () => {
    if (taskToSetTime && selectedTime) {
      const date = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
      await addTaskToFirestore(taskToSetTime, date, selectedTime); // Save to Firestore
      const updatedTasks = await fetchTasksFromFirestore(); // Fetch updated tasks
      setTasks(updatedTasks); // Update state
      setTaskToSetTime(''); // Clear the temporary task
      setSelectedTime(''); // Clear the selected time
      setShowTimePopUp(false); // Hide the pop-up
    }
  };
  

  // Function to delete a task
  const removeTask = async (id: string) => {
    await deleteTaskFromFirestore(id);
    const updatedTasks = await fetchTasksFromFirestore(); // Fetch updated tasks
    setTasks(updatedTasks);
  };

  // Function to mark a task as complete
  const markTaskComplete = async (id: string) => {
    await markTaskCompleteInFirestore(id);
    const updatedTasks = await fetchTasksFromFirestore(); // Fetch updated tasks
    setTasks(updatedTasks);
  };

  return (
    <div className="todo-app">
      <header>
        <h1>To-Do List with Calendar</h1>
      </header>
      <Calendar
        onChange={(date) => setSelectedDate(date as Date)}
        value={selectedDate}
      />
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
        {tasks
          .filter((task) => task.date === selectedDate.toISOString().split('T')[0])
          .map(({ id, task, completed, time }) => (
            <li key={id}>
              <span style={{ textDecoration: completed ? 'line-through' : 'none' }}>
                {task} - {time || 'No time set'}
              </span>
              {!completed && <button onClick={() => markTaskComplete(id)}>Complete</button>}
              <button onClick={() => removeTask(id)}>Delete</button>
            </li>
          ))}
      </ul>

      {/* Pop-Up for Time Selection */}
      {showTimePopUp && (
        <div className="time-popup">
          <h2>Set Time for Task</h2>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
          <button onClick={saveTaskWithTime}>Save</button>
          <button onClick={() => setShowTimePopUp(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default App;
