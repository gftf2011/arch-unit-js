class UpdateTodo {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(id, updates) {
    if (!id) {
      throw new Error('ID is required');
    }

    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    if (updates.title !== undefined) {
      if (!updates.title || updates.title.trim() === '') {
        throw new Error('Title cannot be empty');
      }
      todo.updateTitle(updates.title.trim());
    }

    if (updates.description !== undefined) {
      todo.updateDescription(updates.description);
    }

    if (updates.completed !== undefined) {
      if (updates.completed) {
        todo.markAsCompleted();
      } else {
        todo.markAsIncomplete();
      }
    }

    return await this.todoRepository.update(id, todo);
  }
}

module.exports = UpdateTodo; 