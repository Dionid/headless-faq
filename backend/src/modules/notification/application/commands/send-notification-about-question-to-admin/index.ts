import { EitherResultP, Result } from "@dddl/core/dist/rop"
import {
  QUESTION_REPOSITORY_DI_TOKEN,
  QuestionRepository,
} from "modules/faq/domain/repository"
import { Question } from "modules/faq/domain/aggregates/question/question.aggregate"
import { Inject } from "typedi"
import { CommandHandler, CommandRequest } from "@dddl/core/dist/cqrs"
import { SendNotificationAboutQuestionToAdminCommand } from "modules/notification/application/commands/send-notification-about-question-to-admin/command"

export interface NotificationSender {
  sendWidgetQuestionCreated(question: Question): EitherResultP
}

export const NOTIFICATION_SENDER_DI_TOKEN = "NOTIFICATION_SENDER_DI_TOKEN"

export class SendNotificationAboutQuestionToAdmin
  implements CommandHandler<SendNotificationAboutQuestionToAdminCommand> {
  constructor(
    @Inject(QUESTION_REPOSITORY_DI_TOKEN) private questionRepository: QuestionRepository,
    @Inject(NOTIFICATION_SENDER_DI_TOKEN) private notificationService: NotificationSender,
  ) {}

  async handle(
    req: CommandRequest<SendNotificationAboutQuestionToAdminCommand>,
  ): EitherResultP {
    const { data } = req
    // . Get Question
    const question = await this.questionRepository.getByPk({
      value: data.questionId.value,
    })
    if (question.isError()) {
      return Result.error(question.error)
    }
    if (!question.value) {
      return Result.error(new Error("No question with this ID!"))
    }

    // . Send to admin
    const res = await this.notificationService.sendWidgetQuestionCreated(question.value)
    if (res.isError()) {
      return Result.error(res.error)
    }

    return Result.oku()
  }
}
