import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TodoEntity } from '../domain/todo.entity';
import { TodoRepository } from './todo.repository';

@Injectable()
export class InMemoryTodoRepository implements TodoRepository {
  private readonly store = new Map<string, TodoEntity>();

  nextId(): string {
    return randomUUID();
  }

  async create(todo: TodoEntity): Promise<void> {
    this.store.set(todo.id, todo);
  }

  async findAll(): Promise<TodoEntity[]> {
    return Array.from(this.store.values());
  }

  async findById(id: string): Promise<TodoEntity | null> {
    return this.store.get(id) ?? null;
  }

  async update(todo: TodoEntity): Promise<void> {
    this.store.set(todo.id, todo);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
