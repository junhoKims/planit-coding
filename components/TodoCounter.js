function TodoCounter($container, data = []) {
  this.$container = $container;
  this.data = data;

  this.init = () => {
    this.render();
  };

  this.setState = ({ data }) => {
    if (data !== undefined) this.data = data;
    this.render();
  };

  this.render = () => {
    const completedCount = this.data.filter((todo) => todo.isCompleted).length;
    const totalCount = this.data.length;

    this.$container.innerHTML = `
      <div class="todo-counter">
        <div class="counter-main">
          <span class="counter-text">
            <strong>${completedCount}</strong> / <strong>${totalCount}</strong>
          </span>
        </div>
      </div>
    `;
  };

  this.init();
}

export default TodoCounter;
