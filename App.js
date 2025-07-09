import TodoList from "./components/TodoList.js";
import TodoInput from "./components/TodoInput.js";
import TodoCounter from "./components/TodoCounter.js";
import { model } from "./model/model.js";
import { loadDataFromStorage, saveDataToStorage, generateId } from "./utils.js";

const STORAGE_KEY = "planit-todos";

function App() {
  this.data = [];
  this.selected = null;

  this.todoList = null;
  this.todoInput = null;
  this.todoCounter = null;

  this.$todoList = document.querySelector("#todo-list");
  this.$todoInput = null;
  this.$todoCounter = null;

  this.init = () => {
    this.initDOM();
    this.loadData();
    this.initComponents();

    window.addEventListener("beforeunload", () => {
      this.destroy();
    });
  };

  this.initDOM = () => {
    this.$todoList.innerHTML = `
      <div class="todo-app">
        <header class="todo-header">
          <h1>📝 Todo List</h1>
        </header>
        <div id="todo-counter"></div>
        <div id="todo-input"></div>
        <div id="todo-list-container"></div>
      </div>
    `;

    this.$todoCounter = document.querySelector("#todo-counter");
    this.$todoInput = document.querySelector("#todo-input");
    this.$todoList = document.querySelector("#todo-list-container");
  };

  this.loadData = () => {
    this.data = loadDataFromStorage(STORAGE_KEY, model);
  };

  this.saveData = () => {
    saveDataToStorage(STORAGE_KEY, this.data);
  };

  this.initComponents = () => {
    this.todoCounter = new TodoCounter(this.$todoCounter, this.data);

    this.todoInput = new TodoInput(this.$todoInput);
    this.todoInput.setCallbacks({
      onAddTodo: this.addTodo,
      onUpdateTodo: this.updateTodo,
    });

    this.todoList = new TodoList(this.$todoList, this.data);
    this.todoList.setCallbacks({
      onToggleTodo: this.toggleTodo,
      onDeleteTodo: this.deleteTodo,
      onEditTodo: this.editTodo,
      onCompleteAllTodos: this.completeAllTodos,
      onDeleteAllTodos: this.deleteAllTodos,
    });
  };

  this.setState = ({ data, selected }) => {
    if (data !== undefined) this.data = data;
    if (selected !== undefined) this.selected = selected;

    this.saveData();
    this.render();
  };

  this.render = () => {
    if (this.todoCounter) {
      this.todoCounter.setState({ data: this.data });
    }

    if (this.todoInput) {
      this.todoInput.setState({ selected: this.selected });
    }

    if (this.todoList) {
      this.todoList.setState({ data: this.data, selected: this.selected });
    }
  };

  this.addTodo = (name) => {
    const newTodo = {
      id: generateId(),
      name: name,
      isCompleted: false,
    };

    const newData = [...this.data, newTodo];
    this.setState({ data: newData });
  };

  this.updateTodo = (todo, newName) => {
    if (!todo) return;

    const newData = this.data.map((t) =>
      t.id === todo.id ? { ...t, name: newName } : t
    );

    this.setState({ data: newData, selected: null });
  };

  this.deleteTodo = (todo) => {
    if (!todo) return;

    const newData = this.data.filter((t) => t.id !== todo.id);
    const newSelected =
      this.selected && this.selected.id === todo.id ? null : this.selected;

    this.setState({ data: newData, selected: newSelected });
  };

  this.toggleTodo = (todo) => {
    if (!todo) return;

    const newSelected =
      this.selected && this.selected.id === todo.id ? null : this.selected;
    const newData = this.data.map((t) => {
      return t.id === todo.id ? { ...t, isCompleted: !t.isCompleted } : t;
    });

    this.setState({ data: newData, selected: newSelected });
  };

  this.editTodo = (todo, checked) => {
    if (!todo) return;
    if (todo.isCompleted) return;

    const newSelected = checked ? todo : null;
    this.setState({ selected: newSelected });
  };

  this.completeAllTodos = () => {
    const newData = this.data.map((t) => ({ ...t, isCompleted: true }));
    this.setState({ data: newData, selected: null });
  };

  this.deleteAllTodos = () => {
    this.setState({ data: [], selected: null });
  };

  this.destroy = () => {
    if (this.todoList && this.todoList.destroy) {
      this.todoList.destroy();
    }
    if (this.todoInput && this.todoInput.destroy) {
      this.todoInput.destroy();
    }

    this.todoList = null;
    this.todoInput = null;
    this.todoCounter = null;

    this.$todoList = null;
    this.$todoInput = null;
    this.$todoCounter = null;

    this.data = null;
    this.selected = null;
  };

  this.init();
  this.render();
}

export default App;
