import { Command } from "@dddl/cqrs"
import { IsNotEmpty, IsString } from "class-validator"
import { QuestionId } from "modules/faq/domain/aggregates/question/question.id"

export class SendNotificationAboutQuestionToAdminCommand extends Command {
  @IsNotEmpty()
  public readonly questionId: QuestionId
  constructor(questionId: QuestionId) {
    super()
    this.questionId = questionId
  }
}
