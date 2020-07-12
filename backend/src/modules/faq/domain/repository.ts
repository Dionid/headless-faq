import { Repository } from "@dddl/core/dist/dal"
import { Question } from "modules/faq/domain/aggregates/question/question.aggregate"

export interface QuestionRepository extends Repository<Question> {}

export const QUESTION_REPOSITORY_DI_TOKEN = "QUESTION_REPOSITORY_DI_TOKEN"
