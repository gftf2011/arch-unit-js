import { NullaryCheck } from '@/common/check';
import { NotificationError } from '@/errors/notification-error';
import { CheckOperand } from '@/operands/check-operand';
import { Operation } from '@/operations/operation';

export type OUTPUT = void;

export class CheckOperation<T> extends Operation<T> implements NullaryCheck<OUTPUT> {
  constructor(
    protected readonly negated: boolean,
    protected readonly operand: CheckOperand<T>,
  ) {
    super(negated, operand);
  }

  public check(): OUTPUT {
    const notificationError: NotificationError = this.operand.check({
      graph: this.graph,
      negated: this.negated,
    });
    if (notificationError.hasErrors()) throw notificationError;
  }
}
