import { OmitAndModify } from "@dddl/core/dist/common"
import { AggregateRootWithState } from "@dddl/core/dist/domain"
import { ChatId } from "modules/notification/domain/aggregates/chat/chat.id"
import { NotificationsChat } from "apps/common/adapters/dal/sch/db-introspection"

export type ChatState = OmitAndModify<NotificationsChat, { id: any }, {}>

export class Chat extends AggregateRootWithState<ChatId, ChatState> {
  public static __createByRepository(id: ChatId, state: ChatState) {
    return new Chat(id, state)
  }

  public static createWhenAdminSignIn(id: ChatId, chatId: string) {
    const chat = new Chat(id, {
      updatedAt: new Date(),
      createdAt: new Date(),
      isAdmin: true,
      chatId: chatId,
    })
    return chat
  }
}
