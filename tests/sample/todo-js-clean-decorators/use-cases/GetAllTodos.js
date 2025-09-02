import { Service } from './Service';

@Service()
export class GetAllTodos {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }
  execute() {
    return this.todoRepository.getAll();
  }
}
