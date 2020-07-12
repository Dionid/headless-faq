import { Service } from "typedi"
import { CommandRequest } from "@dddl/core/dist/cqrs"
import { EitherResultP } from "@dddl/core/dist/rop"
import { SendNotificationAboutQuestionToAdmin } from "modules/notification/application/commands/send-notification-about-question-to-admin"
import { SendNotificationAboutQuestionToAdminCommand } from "modules/notification/application/commands/send-notification-about-question-to-admin/command"

@Service()
export class SendNotificationAboutQuestionToAdminUserAPI {
  constructor(private uc: SendNotificationAboutQuestionToAdmin) {}

  async handle(
    req: CommandRequest<SendNotificationAboutQuestionToAdminCommand>,
  ): EitherResultP<undefined> {
    return this.uc.handle(req)
  }
}
