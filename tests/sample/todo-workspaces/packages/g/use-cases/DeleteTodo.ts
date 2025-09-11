import { ITodoRepository } from '@/domain/repositories/TodoRepository';

export interface DeleteResult {
  message: string;
}

export class DeleteTodo {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(id: string): Promise<DeleteResult> {
    if (!id) {
      throw new Error('ID is required');
    }

    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    await this.todoRepository.delete(id);
    return { message: 'Todo deleted successfully' };
  }
}
