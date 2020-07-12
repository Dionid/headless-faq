import { Question } from "modules/faq/domain/aggregates/question/question.aggregate"
import { EitherResultP, Result } from "@dddl/core/dist/rop"
import Telegraf from "telegraf"
import { session } from "telegraf"
import {
  AllAdminChats,
  ByChatId,
  ChatRepository,
} from "modules/notification/application/repositories"
import { TelegrafContext } from "telegraf/typings/context"
import { Chat } from "modules/notification/domain/aggregates/chat/chat.aggregate"
import { ChatId } from "modules/notification/domain/aggregates/chat/chat.id"
import { v4 } from "uuid"
import { NotFoundErr, UnauthorizedErr } from "@dddl/core/dist/errors"

export class TgService {
  constructor(
    private bot: Telegraf<TelegrafContext>,
    private chatRepository: ChatRepository,
    private authToken: string,
  ) {
    bot.use(session())
    bot.use(Telegraf.log())
    bot.start(this.cmdStart)
    bot.on("message", this.processMessage)
  }

  public launch = (): void => {
    this.bot.launch({
      polling: {
        timeout: 1000,
      },
    })
  }

  private cmdStart = async (ctx: TelegrafContext) => {
    if (!ctx.message) {
      console.error(new Error("No message in /start"))
      return
    }
    if (!ctx.message.from) {
      console.error(new Error("No message.from in /start"))
      return
    }

    const chat = await this.chatRepository.getBySpecs([
      new ByChatId(ctx.message.chat.id + ""),
    ])
    if (chat.isError()) {
      return Result.error(chat.error)
    }
    if (!chat.value) {
      await ctx.reply("Hi there! You must be authenticated! Send me your auth token.")
      return
    }

    await ctx.reply("Hi there! You are authenticated! Wait for new messages :)")
    return
  }

  public async sendWidgetQuestionCreated(question: Question): EitherResultP {
    const chats = await this.chatRepository.getAllBySpecs([new AllAdminChats()])
    if (chats.isError()) {
      return Result.error(chats.error)
    }
    if (chats.value.length === 0) {
      console.warn("No admin telegrams found")
      return Result.oku()
    }
    for (let i = 0; i < chats.value.length; i++) {
      const chat = chats.value[i]
      try {
        await this.bot.telegram.sendMessage(
          chat.state.chatId,
          `
New question in channel!
Question: ${question.state.content}
Creator: ${question.state.creator}`,
        )
      } catch (e) {
        return Result.error(e)
      }
    }
    return Result.oku()
  }

  private processMessage = async (ctx: TelegrafContext) => {
    const message = ctx.message
    if (!message) {
      console.error(new Error("No message"))
      return
    }
    if (!message.from) {
      console.error(new Error("No message.from"))
      return
    }

    if (message.text) {
      if (message.text.trim().includes("tg_auth_token:")) {
        const result = await this.signInByToken(
          message.text.trim().split("tg_auth_token:")[1],
          message.chat.id + "",
        )
        if (result.isError()) {
          if (result.error instanceof NotFoundErr) {
            await ctx.reply("Can't find user with this token, try again!")
          } else {
            await ctx.reply("There is error: " + result.error)
          }
          return
        }
        await ctx.reply("Congratilations! You are in")
        return
      }
    }
  }

  public async signInByToken(token: string, chatId: string): EitherResultP {
    // . Check token
    if (token !== this.authToken) {
      return Result.error(new UnauthorizedErr())
    }

    // . Save new Chat
    const chat = Chat.createWhenAdminSignIn(new ChatId(v4()), chatId)
    const result = await this.chatRepository.save(chat)
    if (result.isError()) {
      return Result.error(result.error)
    }

    return Result.oku()
  }
}
