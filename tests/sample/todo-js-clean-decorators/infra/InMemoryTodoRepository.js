export function Repository() {
  return function (target) {
    Object.defineProperty(target.prototype, '__repository__', { value: true, enumerable: false });
  };
}

@Repository()
export class InMemoryTodoRepository {
  constructor() {
    this._items = [];
    this._seq = 1;
  }
  create(title) {
    const todo = { id: this._seq++, title, completed: false };
    this._items.push(todo);
    return todo;
  }
  getAll() {
    return [...this._items];
  }
}
