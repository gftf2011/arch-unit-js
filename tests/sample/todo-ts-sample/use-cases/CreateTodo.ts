import { ITodoRepository } from '@/domain/repositories/TodoRepository';
import { Todo } from '@/domain/entities';

export class CreateTodo {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(title: string, description?: string): Promise<Todo> {
    if (!title || title.trim() === '') {
      throw new Error('Title is required');
    }

    const id = Date.now().toString();
    const todo = new Todo(id, title.trim(), description || '');
    await this.todoRepository.create(todo);
    return todo;
  }
} 