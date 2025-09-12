const { Todo } = require('#domain2/entities/Todo');

class CreateTodo {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }
  async execute({ id, title }) {
    const todo = new Todo({ id, title, completed: false });
    await this.todoRepository.save(todo);
    return todo;
  }
}

module.exports = { CreateTodo };
