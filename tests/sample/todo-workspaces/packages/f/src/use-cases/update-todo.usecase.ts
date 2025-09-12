import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryTodoRepository } from '../repositories/in-memory-todo.repository';

type Input = { id: string; title: string };

@Injectable()
export class UpdateTodo {
  constructor(private readonly repo: InMemoryTodoRepository) {}

  async execute({ id, title }: Input) {
    const todo = await this.repo.findById(id);
    if (!todo) throw new NotFoundException('Todo not found');
    todo.rename(title);
    await this.repo.update(todo);
    return todo.toJSON();
  }
}
