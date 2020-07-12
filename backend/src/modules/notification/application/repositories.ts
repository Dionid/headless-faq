import { Repository, Specification } from "@dddl/core/dist/dal"
import { Chat } from "modules/notification/domain/aggregates/chat/chat.aggregate"

export class AllAdminChats extends Specification<Chat> {}
export class ByChatId extends Specification<Chat> {
  constructor(public chatId: string) {
    super()
  }
}

export interface ChatRepository extends Repository<Chat> {}

export const CHAT_REPOSITORY_DI_TOKEN = "CHAT_REPOSITORY_DI_TOKEN"
