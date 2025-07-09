function TodoList($container, data) {
  this.$container = $container;
  this.data = data;
  this.selected = null;

  this.onToggleTodo = null;
  this.onDeleteTodo = null;
  this.onUpdateTodo = null;
  this.onEditTodo = null;
  this.onCompleteAllTodos = null;
  this.onDeleteAllTodos = null;

  this.eventHandlers = [];
  this.isDestroyed = false;

  this.init = () => {
    this.render();
    this.bindEvents();
  };

  this.setState = ({ data, selected }) => {
    if (this.isDestroyed) return;
    
    if (data !== undefined) this.data = data;
    if (selected !== undefined) this.selected = selected;

    this.render();
  };

  this.render = () => {
    if (this.isDestroyed) return;

    const isEmpty = !this.data || this.data.length === 0;

    if (isEmpty) {
      this.$container.innerHTML = EmptyUI();
      return;
    }

    this.$container.innerHTML = `
      <div class="todo-list">
        <div class="todo-controls">
          <button class="complete-all-btn">전체 완료</button>
          <button class="delete-all-btn">전체 삭제</button>
        </div>
        <div class="todo-items">
          ${this.data
            .map((todo, index) => {
              const isSelected = this.selected && this.selected.id === todo.id;
              const isChecked = isSelected ? "checked" : "";
              const isDisabled = todo.isCompleted ? "disabled" : "";

              return `
             <div class="todo-item ${todo.isCompleted ? "completed" : ""} ${
                isSelected ? "selected" : ""
              }" data-index="${index}">
               <input 
                 type="checkbox" 
                 class="todo-select-checkbox" 
                 data-index="${index}"
                 ${isChecked}
                 ${isDisabled}
               >
               <span class="todo-title ${
                 todo.isCompleted ? "completed-text" : ""
               }" data-index="${index}">
                 ${todo.name}
               </span>
               
               ${
                 todo.isCompleted
                   ? `
                 <span class="completed-badge">완료됨</span>
               `
                   : ""
               }
               <button class="delete-btn" data-index="${index}">삭제</button>
             </div>
           `;
            })
            .join("")}
        </div>
      </div>
    `;
  };

  this.addEventHandler = (element, event, handler) => {
    if (this.isDestroyed || !element) return;
    
    element.addEventListener(event, handler);
    this.eventHandlers.push({ element, event, handler });
  };

  this.bindEvents = () => {
    if (this.isDestroyed) return;
  
    const clickHandler = (e) => {
      if (this.isDestroyed) return;

      const target = e.target;
      const index = parseInt(target.dataset.index);
      const todo = this.data?.[index];

      if (target.classList.contains("todo-title")) {
        if (this.onToggleTodo && todo) {
          this.onToggleTodo(todo);
        }
      } else if (target.classList.contains("delete-btn")) {
        if (this.onDeleteTodo && todo) {
          this.onDeleteTodo(todo);
        }
      } else if (target.classList.contains("complete-all-btn")) {
        if (this.onCompleteAllTodos) {
          this.onCompleteAllTodos();
        }
      } else if (target.classList.contains("delete-all-btn")) {
        if (this.onDeleteAllTodos) {
          this.onDeleteAllTodos();
        }
      }
    };

    const changeHandler = (e) => {
      if (this.isDestroyed) return;
      
      if (e.target.classList.contains("todo-select-checkbox")) {
        const index = parseInt(e.target.dataset.index);
        const checked = e.target.checked;
        const todo = this.data?.[index];

        if (this.onEditTodo && todo) {
          this.onEditTodo(todo, checked);
        }
      }
    };

    this.addEventHandler(this.$container, "click", clickHandler);
    this.addEventHandler(this.$container, "change", changeHandler);
  };

  this.setCallbacks = (callbacks) => {
    if (this.isDestroyed) return;
    
    this.onToggleTodo = callbacks.onToggleTodo || null;
    this.onDeleteTodo = callbacks.onDeleteTodo || null;
    this.onUpdateTodo = callbacks.onUpdateTodo || null;
    this.onEditTodo = callbacks.onEditTodo || null;
    this.onCompleteAllTodos = callbacks.onCompleteAllTodos || null;
    this.onDeleteAllTodos = callbacks.onDeleteAllTodos || null;
  };

  this.destroy = () => {
    if (this.isDestroyed) return;
    
    this.isDestroyed = true;

    this.eventHandlers.forEach(({ element, event, handler }) => {
      if (element && element.removeEventListener) {
        element.removeEventListener(event, handler);
      }
    });
    this.eventHandlers = [];

    if (this.$container) {
      this.$container.innerHTML = "";
    }

    this.onToggleTodo = null;
    this.onDeleteTodo = null;
    this.onUpdateTodo = null;
    this.onEditTodo = null;
    this.onCompleteAllTodos = null;
    this.onDeleteAllTodos = null;

    this.data = null;
    this.selected = null;
    this.$container = null;
  };

  this.init();
}

export default TodoList;

const EmptyUI = () => {
  return `
    <div class="todo-list empty">
      <div class="empty-state">
        <p>등록된 할 일이 없습니다.</p>
        <p>새로운 할 일을 추가해보세요!</p>
      </div>
    </div>
  `;
};