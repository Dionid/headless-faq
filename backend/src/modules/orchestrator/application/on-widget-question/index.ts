import { AsyncEventHandler, EventRequest, SyncEventHandler } from "@dddl/core/dist/eda"
import { WidgetQuestionCreated } from "modules/faq/application/events"
import { Inject } from "typedi"
import { CQ_BUS_DI_TOKEN, CQBus } from "@dddl/core/dist/cqrs"
import { EitherResultP } from "@dddl/core/dist/rop"
import { SendNotificationAboutQuestionToAdminCommand } from "modules/notification/application/commands/send-notification-about-question-to-admin/command"

export class OnWidgetQuestionCreatedAsync extends AsyncEventHandler<
  WidgetQuestionCreated,
  undefined
> {
  constructor(@Inject(CQ_BUS_DI_TOKEN) private cqBus: CQBus) {
    super()
  }

  async handle(req: EventRequest<WidgetQuestionCreated>): EitherResultP {
    const res = await this.cqBus.handle<undefined>(
      new SendNotificationAboutQuestionToAdminCommand(req.data.questionId),
      this.metaFromRequest(req),
    )
    if (res.isError()) {
      console.warn(`Error in OnWidgetQuestionCreatedAsync: ${res.error}`)
    }
    return res
  }
}
