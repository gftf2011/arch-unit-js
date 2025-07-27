class GetAllTodos {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute() {
    return await this.todoRepository.findAll();
  }
}

module.exports = GetAllTodos; 