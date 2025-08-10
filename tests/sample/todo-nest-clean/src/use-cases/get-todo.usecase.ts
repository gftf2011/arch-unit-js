import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryTodoRepository } from '../repositories/in-memory-todo.repository';

type Input = { id: string };

@Injectable()
export class GetTodo {
  constructor(private readonly repo: InMemoryTodoRepository) {}

  async execute({ id }: Input) {
    const todo = await this.repo.findById(id);
    if (!todo) throw new NotFoundException('Todo not found');
    return todo.toJSON();
  }
} 