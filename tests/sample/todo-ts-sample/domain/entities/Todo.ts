export interface ITodo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

export class Todo implements ITodo {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public completed: boolean = false,
    public createdAt: Date = new Date()
  ) {}

  markAsCompleted(): void {
    this.completed = true;
  }

  markAsIncomplete(): void {
    this.completed = false;
  }

  updateTitle(title: string): void {
    this.title = title;
  }

  updateDescription(description: string): void {
    this.description = description;
  }
} 