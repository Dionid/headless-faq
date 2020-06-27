import { Service } from "typedi"
import { CommandRequest } from "@dddl/cqrs"
import { EitherResultP } from "@dddl/rop"
import { QuestionByWidgetCommand } from "modules/faq/application/commands/question-by-widget/command"
import { QuestionByWidget } from "modules/faq/application/commands/question-by-widget"

@Service()
export class QuestionByWidgetUserAPI {
  constructor(private uc: QuestionByWidget) {}

  // @UseUCD(ValidateRequestDecorator)
  // @UseUCD(AsyncEventBusProviderSetMetaDecorator)
  // @UseUCD(AsyncEventBusProviderTransactionDecorator)
  // @UseUCD(KnexTransactionDecorator)
  // @UseUCD(SyncEventBusProviderSetMetaDecorator)
  // @UseUCD(SyncEventBusProviderTransactionDecorator)
  async handle(req: CommandRequest<QuestionByWidgetCommand>): EitherResultP<undefined> {
    return this.uc.handle(req)
  }
}
