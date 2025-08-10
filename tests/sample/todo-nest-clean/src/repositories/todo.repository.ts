import { TodoEntity } from '../domain/todo.entity';

export abstract class TodoRepository {
  abstract nextId(): string;
  abstract create(todo: TodoEntity): Promise<void>;
  abstract findAll(): Promise<TodoEntity[]>;
  abstract findById(id: string): Promise<TodoEntity | null>;
  abstract update(todo: TodoEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
