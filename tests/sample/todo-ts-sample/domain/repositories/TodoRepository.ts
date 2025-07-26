import { ITodo } from '@/domain/entities';

export interface ITodoRepository {
  create(todo: ITodo): Promise<ITodo>;
  findById(id: string): Promise<ITodo | null>;
  findAll(): Promise<ITodo[]>;
  update(id: string, todo: ITodo): Promise<ITodo | null>;
  delete(id: string): Promise<boolean>;
}

export abstract class TodoRepository implements ITodoRepository {
  async create(todo: ITodo): Promise<ITodo> {
    throw new Error('Method not implemented');
  }

  async findById(id: string): Promise<ITodo | null> {
    throw new Error('Method not implemented');
  }

  async findAll(): Promise<ITodo[]> {
    throw new Error('Method not implemented');
  }

  async update(id: string, todo: ITodo): Promise<ITodo | null> {
    throw new Error('Method not implemented');
  }

  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented');
  }
} 