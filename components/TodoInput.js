function TodoInput($container) {
  this.$container = $container;
  this.selected = null;
  this.isEditMode = false;

  this.onAddTodo = null;
  this.onUpdateTodo = null;

  this.eventHandlers = [];
  this.isDestroyed = false;

  this.init = () => {
    this.render();
    this.focus();
  };

  this.setState = ({ selected }) => {
    if (this.isDestroyed) return;

    if (selected !== undefined) this.selected = selected;

    this.render();

    if (this.selected) {
      this.enterEditMode(this.selected);
    } else {
      this.exitEditMode();
    }
  };

  this.render = () => {
    if (this.isDestroyed) return;

    this.$container.innerHTML = `
      <div class="todo-input-container">
        <div class="input-group">
          <input 
            type="text" 
            class="todo-input" 
            placeholder="${
              this.isEditMode
                ? "할 일을 수정해주세요"
                : "새로운 할 일을 입력해주세요"
            }"
            ${this.isEditMode ? "" : ""}
          >
          <button class="add-btn" type="button">
            ${this.isEditMode ? "수정" : "추가"}
          </button>
          ${
            this.isEditMode
              ? '<button class="cancel-btn" type="button">취소</button>'
              : ""
          }
        </div>
      </div>
    `;

    this.bindEvents();
  };

  this.addEventHandler = (element, event, handler) => {
    if (this.isDestroyed || !element) return;

    element.addEventListener(event, handler);
    this.eventHandlers.push({ element, event, handler });
  };

  this.bindEvents = () => {
    if (this.isDestroyed) return;

    const $input = this.$container.querySelector(".todo-input");
    const $addBtn = this.$container.querySelector(".add-btn");
    const $cancelBtn = this.$container.querySelector(".cancel-btn");

    if ($addBtn) {
      this.addEventHandler($addBtn, "click", () => {
        this.handleSubmit();
      });
    }

    if ($input) {
      this.addEventHandler($input, "keypress", (e) => {
        if (e.key === "Enter") {
          this.handleSubmit();
        }
      });

      this.addEventHandler($input, "keydown", (e) => {
        if (e.key === "Escape" && this.isEditMode) {
          this.exitEditMode();
        }
      });
    }

    if ($cancelBtn) {
      this.addEventHandler($cancelBtn, "click", () => {
        this.exitEditMode();
      });
    }
  };

  this.handleSubmit = () => {
    if (this.isDestroyed) return;

    const $input = this.$container.querySelector(".todo-input");
    if (!$input) return;

    const value = $input.value.trim();

    if (!value) {
      alert("할 일을 입력해주세요!");
      this.focus();
      return;
    }

    if (this.isEditMode) {
      if (this.onUpdateTodo && this.selected) {
        this.onUpdateTodo(this.selected, value);
      }

      this.exitEditMode();
    } else {
      if (this.onAddTodo) {
        this.onAddTodo(value);
      }

      $input.value = "";
      this.focus();
    }
  };

  this.enterEditMode = (selected) => {
    if (this.isDestroyed || !selected) return;

    this.isEditMode = true;
    this.render();

    const $input = this.$container.querySelector(".todo-input");
    if ($input) {
      $input.value = selected.name;
      $input.select();
    }
  };

  this.exitEditMode = () => {
    if (this.isDestroyed) return;

    this.isEditMode = false;
    this.render();
  };

  this.focus = () => {
    if (this.isDestroyed) return;

    const $input = this.$container.querySelector(".todo-input");
    if ($input) {
      $input.focus();
    }
  };

  this.setCallbacks = (callbacks) => {
    if (this.isDestroyed) return;

    this.onAddTodo = callbacks.onAddTodo || null;
    this.onUpdateTodo = callbacks.onUpdateTodo || null;
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

    this.onAddTodo = null;
    this.onUpdateTodo = null;

    this.selected = null;
    this.$container = null;
  };

  this.init();
}

export default TodoInput;
