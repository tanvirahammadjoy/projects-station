import React, { useState } from "react";
import Input from "./components/ui/input";
import Button from "./components/ui/button";
import Card from "./components/ui/card";
import "./App.css";

export default function TodoApp() {
  let [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [task, setTask] = useState("");

  const addTask = () => {
    if (task.trim() !== "") {
      setTasks((prevTasks) => [...prevTasks, { id: Date.now(), text: task }]);
      setTask("");
    }
  };

  return (
    <div className="App p-4 rounded shadow">
      <h1>Todo App</h1>

      <Input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a task"
      />

      <Button onClick={addTask}>Add Task</Button>
      {/* <ul>
        {tasks.map((t) => (
          <li key={t.id}>{t.text}</li>
        ))}
      </ul> */}

      {tasks.map((t) => (
        <Card key={t.id}>{t.text}</Card>
      ))}
    </div>
  );
}
