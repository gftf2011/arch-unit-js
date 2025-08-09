import { TodoRepository } from '@/domain/repositories/TodoRepository';
import { ITodo } from '@/domain/entities';
import pg from 'pg';

export class InMemoryTodoRepository extends TodoRepository {
  private todos: ITodo[] = [];

  override async create(todo: ITodo): Promise<ITodo> {
    this.todos.push(todo);
    return todo;
  }

  override async findById(id: string): Promise<ITodo | null> {
    return this.todos.find((todo) => todo.id === id) || null;
  }

  override async findAll(): Promise<ITodo[]> {
    return [...this.todos];
  }

  override async update(id: string, updatedTodo: ITodo): Promise<ITodo | null> {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.todos[index] = updatedTodo;
      return updatedTodo;
    }
    return null;
  }

  override async delete(id: string): Promise<boolean> {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      return true;
    }
    return false;
  }
}
