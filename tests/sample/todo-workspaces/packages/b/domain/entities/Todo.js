class Todo {
  constructor(id, title, description, completed = false, createdAt = new Date()) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.createdAt = createdAt;
  }

  markAsCompleted() {
    this.completed = true;
  }

  markAsIncomplete() {
    this.completed = false;
  }

  updateTitle(title) {
    this.title = title;
  }

  updateDescription(description) {
    this.description = description;
  }
}

module.exports = Todo;
