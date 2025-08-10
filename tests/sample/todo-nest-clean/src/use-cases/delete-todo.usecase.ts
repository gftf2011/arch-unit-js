import { Injectable } from '@nestjs/common';
import { InMemoryTodoRepository } from '../repositories/in-memory-todo.repository';

type Input = { id: string };

@Injectable()
export class DeleteTodo {
  constructor(private readonly repo: InMemoryTodoRepository) {}

  async execute({ id }: Input) {
    await this.repo.delete(id);
  }
} 