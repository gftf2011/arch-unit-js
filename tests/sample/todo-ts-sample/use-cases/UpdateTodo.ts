import { ITodoRepository } from '@/domain/repositories/TodoRepository';
import { Todo } from '@/domain/entities';

export interface TodoUpdates {
  title?: string;
  description?: string;
  completed?: boolean;
}

export class UpdateTodo {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(id: string, updates: TodoUpdates): Promise<Todo> {
    if (!id) {
      throw new Error('ID is required');
    }

    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    // Convert ITodo to Todo instance to access methods
    const todoInstance = new Todo(
      todo.id,
      todo.title,
      todo.description,
      todo.completed,
      todo.createdAt,
    );

    if (updates.title !== undefined) {
      if (!updates.title || updates.title.trim() === '') {
        throw new Error('Title cannot be empty');
      }
      todoInstance.updateTitle(updates.title.trim());
    }

    if (updates.description !== undefined) {
      todoInstance.updateDescription(updates.description);
    }

    if (updates.completed !== undefined) {
      if (updates.completed) {
        todoInstance.markAsCompleted();
      } else {
        todoInstance.markAsIncomplete();
      }
    }

    return (await this.todoRepository.update(id, todoInstance)) as Todo;
  }
}
