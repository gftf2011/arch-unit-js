const TodoRepository = require('../../domain/repositories/TodoRepository');

class InMemoryTodoRepository extends TodoRepository {
  constructor() {
    super();
    this.todos = [];
  }

  async create(todo) {
    this.todos.push(todo);
    return todo;
  }

  async findById(id) {
    return this.todos.find((todo) => todo.id === id) || null;
  }

  async findAll() {
    return [...this.todos];
  }

  async update(id, updatedTodo) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.todos[index] = updatedTodo;
      return updatedTodo;
    }
    return null;
  }

  async delete(id) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      return true;
    }
    return false;
  }
}

module.exports = InMemoryTodoRepository;
