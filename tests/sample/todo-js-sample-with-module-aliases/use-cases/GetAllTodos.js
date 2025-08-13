// useless require to test module alias
const { Todo } = require('#domain/entities/Todo');

class GetAllTodos {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }
  async execute() {
    return this.todoRepository.findAll();
  }
}

module.exports = { GetAllTodos };
