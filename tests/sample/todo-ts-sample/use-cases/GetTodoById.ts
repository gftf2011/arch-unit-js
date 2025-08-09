import { ITodoRepository } from '@/domain/repositories/TodoRepository';
import { ITodo } from '@/domain/entities';

export class GetTodoById {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(id: string): Promise<ITodo> {
    if (!id) {
      throw new Error('ID is required');
    }

    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    return todo;
  }
}
