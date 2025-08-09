// correct would be: const Todo = require('../domain/entities/Todo');
const Todo = require('../../domain/entities/Todo');

class CreateTodo {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(title, description) {
    if (!title || title.trim() === '') {
      throw new Error('Title is required');
    }

    const id = Date.now().toString();
    const todo = new Todo(id, title.trim(), description || '');

    return await this.todoRepository.create(todo);
  }
}

module.exports = CreateTodo;
