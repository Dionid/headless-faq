import { DomainEvent } from "@dddl/eda"
import { QuestionId } from "./question.id"
import { v4 } from "uuid"

export class QuestionCreated extends DomainEvent {
  constructor(public readonly questionId: QuestionId) {
    super(v4())
  }
}
