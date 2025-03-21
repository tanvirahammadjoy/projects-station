import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent } from "./components/ui/card";
import { Trash2 } from "lucide-react";
import "./App.css";

export default function TodoApp() {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [task, setTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = () => {
    if (task.trim() !== "") {
      setTasks((prevTasks) => [...prevTasks, { id: Date.now(), text: task }]);
      setTask("");
    }
  };

  // Remove a task
  const removeTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
  };

  // Edit a task
  const editTask = (id, text) => {
    setEditingTaskId(id);
    setEditingText(text);
  };

  // Save the edited task
  const saveTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: editingText } : task
      )
    );
    setEditingTaskId(null);
    setEditingText("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-500 shadow-lg rounded-lg border border-gray-300">
      <h1 className="text-2xl font-bold mb-6 text-center text-white-700">
        Todo App
      </h1>
      <div className="flex gap-2 mb-4">
        <Input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onClick={addTask}
          className="bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded-lg shadow"
        >
          Add
        </Button>
      </div>
      <div>
        {tasks.map((t) => (
          <Card
            key={t.id}
            className="flex justify-between items-center p-3 mb-2 bg-white border border-gray-200 rounded-lg shadow"
          >
            {editingTaskId === t.id ? (
              <Input
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="flex-1 border border-gray-300 p-2 rounded-lg"
              />
            ) : (
              <CardContent className="text-gray-800 font-medium">
                {t.text}
              </CardContent>
            )}
            <div className="flex gap-2">
              {editingTaskId === t.id ? (
                <Button
                  onClick={() => saveTask(t.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg shadow"
                >
                  Save
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => editTask(t.id, t.text)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Edit
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => removeTask(t.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
