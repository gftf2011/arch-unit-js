import { ITodoRepository } from '@/domain/repositories/TodoRepository';
import { ITodo } from '@/domain/entities';

export class GetAllTodos {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(): Promise<ITodo[]> {
    return await this.todoRepository.findAll();
  }
} 