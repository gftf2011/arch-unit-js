export type TodoProps = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class TodoEntity {
  constructor(private props: TodoProps) {}

  get id(): string {
    return this.props.id;
  }
  get title(): string {
    return this.props.title;
  }
  get completed(): boolean {
    return this.props.completed;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  rename(title: string): void {
    this.props.title = title;
    this.props.updatedAt = new Date();
  }

  toggle(): void {
    this.props.completed = !this.props.completed;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return { ...this.props };
  }
}
