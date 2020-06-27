import { Service } from "typedi"
import { CommandRequest } from "@dddl/cqrs"
import { EitherResultP } from "@dddl/rop"
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
