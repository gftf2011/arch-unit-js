import { Injectable } from '@nestjs/common';
import { InMemoryTodoRepository } from '../repositories/in-memory-todo.repository';

@Injectable()
export class ListTodos {
  constructor(private readonly repo: InMemoryTodoRepository) {}

  async execute() {
    const todos = await this.repo.findAll();
    return todos.map((t) => t.toJSON());
  }
} 