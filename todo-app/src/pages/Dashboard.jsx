import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const [dueDate, setDueDate] = useState("");

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const fetchTasks = async () => {
    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);

    const taskList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setTasks(taskList);
  };

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async () => {
    if (!task.trim()) return;

    await addDoc(collection(db, "tasks"), {
      title: task,
      completed: false,
      dueDate,
      userId: user.uid,
      createdAt: Date.now(),
    });

    setTask("");
    fetchTasks();
  };

  const toggleTask = async (taskId, completed) => {
    const taskRef = doc(db, "tasks", taskId);

    await updateDoc(taskRef, {
      completed: !completed,
    });

    fetchTasks();
  };

  const deleteTaskHandler = async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
    fetchTasks();
  };

  return (
    <>
    <div className="max-w-xl mx-auto p-6">
      <h2>Dashboard</h2>

      <p>{user.email}</p>

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />
      <div className="flex gap-2 mb-4">
      <input
        type="text"
        className="border p-2 rounded flex-1"
        placeholder="New Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      </div>

      <button 
        onClick={addTask}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        >
        Add Task
      </button>

      <hr />
      <h1 className="text-3xl font-bold mb-4">
            My Tasks
          </h1>

      {tasks.map((item) => (
        <div key={item.id}>
          <input
            type="checkbox"
            checked={item.completed}
            onChange={() =>
              toggleTask(item.id, item.completed)
            }
          />
          
          <span
            style={{
              textDecoration: item.completed
                ? "line-through"
                : "none",
                
              marginRight: "10px",
            }}
            className="border rounded p-3 mb-2 flex items-center justify-between"
          >
            {item.title}
          </span>
          <p>
            Due : {item.dueDate || "No deadline"}
          </p>

          <button
            onClick={() =>
              deleteTaskHandler(item.id)
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
    </>
  );
}