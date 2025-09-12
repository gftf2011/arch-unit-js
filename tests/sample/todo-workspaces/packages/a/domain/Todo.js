export function Entity(name) {
  return function (target) {
    Object.defineProperty(target.prototype, '__entity__', { value: name, enumerable: false });
  };
}

@Entity('Todo')
export class Todo {
  constructor(id, title, completed = false) {
    this.id = id;
    this.title = title;
    this.completed = completed;
  }
}
