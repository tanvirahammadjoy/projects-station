let inputBox = document.getElementById("todo-input");
let addTodoButton = document.getElementById("add-todo");
let saveTodoButton = document.getElementById("todo-save");
let todoList = document.getElementById("todo-list-items");
let todoFilter = document.getElementById("todo-filter");
let todoSearch = document.getElementById("todo-search");
let themeSelector = document.getElementById("theme-selector");
let todoSort = document.getElementById("todo-sort")
let todoCount = document.querySelector(".todo-count");

// Update count when todos are loaded from localStorage
document.addEventListener("DOMContentLoaded", () => {
  todoLoader();
  updateTodoCount();
});


function todoLoader() {
  let todoItems = JSON.parse(localStorage.getItem("todoItems")) || [];
  todoItems.forEach((todo) => {
    let todoItem = createTodo(todo.text, todo.completed);
    todoList.appendChild(todoItem);
  });

  // Load theme
  let theme = localStorage.getItem("theme");
  if (theme) {
    document.body.className = theme;
    themeSelector.value = theme;
  }
}

function createTodo(todoText, completed = false) {
  let todoItem = document.createElement("li");
  let todoDeleteButton = document.createElement("button");
  let todoEditButton = document.createElement("button");
  let todoTextSpan = document.createElement("span");

  todoDeleteButton.textContent = "Delete";
  todoEditButton.textContent = "Edit";

  todoItem.classList.add("todo-item");
  todoDeleteButton.classList.add("todo-delete-button");
  todoEditButton.classList.add("todo-edit-button");
  todoTextSpan.classList.add("todo-text");

  todoTextSpan.textContent = todoText;
  if (completed) todoTextSpan.classList.add("completed");

  todoItem.appendChild(todoTextSpan);
  todoItem.appendChild(todoDeleteButton);
  todoItem.appendChild(todoEditButton);

  return todoItem;
}

// Function to update the todo count
function updateTodoCount() {
  let totalTodos = todoList.querySelectorAll(".todo-item").length;
  todoCount.textContent = totalTodos;
}

addTodoButton.addEventListener("click", () => {
  let todoText = inputBox.value.trim();
  if (todoText === "") {
    alert("Please enter a todo item");
    return;
  }

  let todoItem = createTodo(todoText);
  todoList.appendChild(todoItem);

  let existingTodos = JSON.parse(localStorage.getItem("todoItems")) || [];
  existingTodos.push({ text: todoText, completed: false });
  localStorage.setItem("todoItems", JSON.stringify(existingTodos));

  inputBox.value = "";
  updateTodoCount();
});

// Mark todo as completed/uncompleted
todoList.addEventListener("click", (event) => {
  if (event.target.classList.contains("todo-text")) {
    event.target.classList.toggle("completed");

    let existingTodos = JSON.parse(localStorage.getItem("todoItems")) || [];
    let updatedTodos = existingTodos.map((todo) =>
      todo.text === event.target.textContent
        ? { ...todo, completed: event.target.classList.contains("completed") }
        : todo
    );

    localStorage.setItem("todoItems", JSON.stringify(updatedTodos));
  }
});

// Delete and Edit Todo
todoList.addEventListener("click", (event) => {
  let todoItem = event.target.parentElement;
  let todoText = todoItem.querySelector(".todo-text").textContent;

  if (event.target.classList.contains("todo-delete-button")) {
    todoList.removeChild(todoItem);
    let existingTodos = JSON.parse(localStorage.getItem("todoItems")) || [];
    let updatedTodos = existingTodos.filter((todo) => todo.text !== todoText);
    localStorage.setItem("todoItems", JSON.stringify(updatedTodos));
    updateTodoCount();
  } else if (event.target.classList.contains("todo-edit-button")) {
    inputBox.value = todoText;
    todoList.removeChild(todoItem);
    let existingTodos = JSON.parse(localStorage.getItem("todoItems")) || [];
    let updatedTodos = existingTodos.filter((todo) => todo.text !== todoText);
    localStorage.setItem("todoItems", JSON.stringify(updatedTodos));
  }
});

// Filter Todos
todoFilter.addEventListener("change", () => {
  let filterValue = todoFilter.value;
  let todoItems = todoList.querySelectorAll(".todo-item");

  todoItems.forEach((todoItem) => {
    let isCompleted = todoItem
      .querySelector(".todo-text")
      .classList.contains("completed");

    if (filterValue === "all") {
      todoItem.style.display = "block";
    } else if (filterValue === "completed" && isCompleted) {
      todoItem.style.display = "block";
    } else if (filterValue === "uncompleted" && !isCompleted) {
      todoItem.style.display = "block";
    } else {
      todoItem.style.display = "none";
    }
  });
});

// Search Todos
todoSearch.addEventListener("input", () => {
  let searchValue = todoSearch.value.toLowerCase();
  let todoItems = todoList.querySelectorAll(".todo-item");

  todoItems.forEach((todoItem) => {
    let todoText = todoItem
      .querySelector(".todo-text")
      .textContent.toLowerCase();
    todoItem.style.display = todoText.includes(searchValue) ? "block" : "none";
  });
});

// Theme Selector
themeSelector.addEventListener("change", () => {
  let themeValue = themeSelector.value;
  document.body.className = themeValue;
  localStorage.setItem("theme", themeValue);
});

// todo sorting functionality
todoSort.addEventListener("change", () => {
  let sortType = todoSort.value;
  let todos = JSON.parse(localStorage.getItem("todoItems")) || [];

  if (sortType === "asc") {
    todos.sort((a, b) => a.text.localeCompare(b.text)); // Sort A-Z
  } else if (sortType === "desc") {
    todos.sort((a, b) => b.text.localeCompare(a.text)); // Sort Z-A
  } else if (sortType === "latest") {
    todos.reverse(); // Show latest added first
  } else if (sortType === "oldest") {
    todos.sort((a, b) => todos.indexOf(a) - todos.indexOf(b)); // Show oldest first
  } else if (sortType === "completed") {
    todos.sort((a, b) => b.completed - a.completed); // Show completed first
  } else if (sortType === "uncompleted") {
    todos.sort((a, b) => a.completed - b.completed); // Show uncompleted first
  } else if (sortType === "random") {
    todos.sort(() => Math.random() - 0.5); // Shuffle todos
  }

  updateTodoList(todos);
});

// Function to update the todo list in the DOM and localStorage
function updateTodoList(sortedTodos) {
  todoList.innerHTML = ""; // Clear existing todos
  sortedTodos.forEach((todo) => {
    let todoItem = createTodo(todo.text, todo.completed);
    todoList.appendChild(todoItem);
  });

  localStorage.setItem("todoItems", JSON.stringify(sortedTodos)); // Update localStorage
}
