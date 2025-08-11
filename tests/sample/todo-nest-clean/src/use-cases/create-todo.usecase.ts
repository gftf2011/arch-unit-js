import { Injectable } from '@nestjs/common';
import { TodoEntity } from '../domain/todo.entity';
import { InMemoryTodoRepository } from '../repositories/in-memory-todo.repository';

type Input = { title: string };

@Injectable()
export class CreateTodo {
  constructor(private readonly repo: InMemoryTodoRepository) {}

  async execute(input: Input) {
    const now = new Date();
    const todo = new TodoEntity({
      id: this.repo.nextId(),
      title: input.title,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });
    await this.repo.create(todo);
    return todo.toJSON();
  }
}
