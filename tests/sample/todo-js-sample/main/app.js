const Todo = require('../domain/entities/Todo');
const InMemoryTodoRepository = require('../infra/repositories/InMemoryTodoRepository');
const CreateTodo = require('../use-cases/CreateTodo');
const GetAllTodos = require('../use-cases/GetAllTodos');
const GetTodoById = require('../use-cases/GetTodoById');
const UpdateTodo = require('../use-cases/UpdateTodo');
const DeleteTodo = require('../use-cases/DeleteTodo');

class TodoApp {
  constructor() {
    this.todoRepository = new InMemoryTodoRepository();
    this.createTodo = new CreateTodo(this.todoRepository);
    this.getAllTodos = new GetAllTodos(this.todoRepository);
    this.getTodoById = new GetTodoById(this.todoRepository);
    this.updateTodo = new UpdateTodo(this.todoRepository);
    this.deleteTodo = new DeleteTodo(this.todoRepository);
  }

  async create(title, description) {
    return await this.createTodo.execute(title, description);
  }

  async getAll() {
    return await this.getAllTodos.execute();
  }

  async getById(id) {
    return await this.getTodoById.execute(id);
  }

  async update(id, updates) {
    return await this.updateTodo.execute(id, updates);
  }

  async delete(id) {
    return await this.deleteTodo.execute(id);
  }
}

module.exports = TodoApp; 