import { CreateRoleOptions, GuildMember, Message } from 'discord.js'
import { client } from '../client'

export async function assignRoleToMember(
  member: GuildMember,
  opts: CreateRoleOptions
) {
  const guild = member.guild

  let role = guild.roles.cache.find((c) => c.name == opts.name)

  if (!role) {
    console.log(`should create new role ${opts.name}`, role)
    role = await guild.roles.create({
      ...opts,
    })
  }

  await member.roles.add(role)
}

export function getSolAdressFromText(tweet: string) {
  const adresses = tweet.match(/(\b[a-zA-Z0-9]{32,44}\b)/g)
  return adresses && adresses?.length > 0 ? adresses[0] : null
}

export async function getAllMessagesFromChannel(
  guildId: string,
  channelId: string
) {
  const guild = await client.guilds.fetch(guildId)

  const channel = await guild.channels.fetch(channelId)

  const allMessages: Message[] = []

  while (1) {
    if (channel?.type === 'GUILD_TEXT') {
      const messages = (
        await channel.messages.fetch({
          limit: 100,
          before:
            allMessages.length > 0
              ? allMessages[allMessages.length - 1].id
              : undefined,
        })
      ).toJSON()

      if (messages.length === 0) {
        break
      }

      allMessages.push(...messages)
    }
  }

  return allMessages
}
