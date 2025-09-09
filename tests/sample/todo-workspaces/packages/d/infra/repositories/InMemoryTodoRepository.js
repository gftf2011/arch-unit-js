class InMemoryTodoRepository {
  constructor() {
    this.items = [];
  }
  async save(todo) {
    const existingIndex = this.items.findIndex((t) => t.id === todo.id);
    if (existingIndex >= 0) this.items[existingIndex] = todo;
    else this.items.push(todo);
    return todo;
  }
  async findAll() {
    return [...this.items];
  }
}

module.exports = { InMemoryTodoRepository };
