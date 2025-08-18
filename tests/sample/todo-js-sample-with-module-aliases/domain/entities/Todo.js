class Todo {
  constructor({ id, title, completed = false }) {
    this.id = id;
    this.title = title;
    this.completed = completed;
  }
}

module.exports = { Todo };
