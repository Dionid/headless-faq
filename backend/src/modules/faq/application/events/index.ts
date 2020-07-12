import { IntegrationEvent } from "@dddl/core/dist/eda"
import { v4 } from "uuid"
import { QuestionId } from "modules/faq/domain/aggregates/question/question.id"

export class WidgetQuestionCreated extends IntegrationEvent {
  constructor(public readonly questionId: QuestionId) {
    super(v4())
  }
}
