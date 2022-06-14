import {
  ButtonInteraction,
  CommandInteraction,
  MessageButton,
  MessageActionRow,
  Snowflake,
  MessageEmbed,
  User,
  MessageComponentInteraction,
} from 'discord.js'
import {
  ButtonComponent,
  Discord,
  Permission,
  SimpleCommand,
  SimpleCommandMessage,
  Slash,
  SlashOption,
} from 'discordx'
import { client } from '../client'
import { request } from 'express'
import * as uuid from 'uuid'
import { differenceInCalendarDays } from 'date-fns'
import config from '../config'
import crypto from 'crypto'
import weighted from 'weighted'
import {
  delay,
  ERoles,
  getNFTsForOwner,
  getRolesForUser,
} from '../utils/solUtils'
import _ from 'lodash'
import { prisma } from '../prisma'
import { updateApeRolesOfMember } from '../service'

export const host = config.webHost

export const airdropWebhost = config.airdropWebhost

async function requestVerification({
  discordId,
  guildId,
  ledgerVerifyAmount,
}: {
  discordId: string
  guildId: string
  ledgerVerifyAmount?: number
}) {
  let user = await prisma.user.findUnique({
    where: {
      discordId,
    },
  })
  if (!user) {
    user = await prisma.user.create({
      data: {
        discordId,
      },
    })
  }
  const verifyRequestId = uuid.v4()

  const verifyRequest = await prisma.verifyRequest.create({
    data: {
      id: verifyRequestId,
      userId: user.id,
      guildId: guildId,
      ledgerVerifyAmount: ledgerVerifyAmount,
    },
  })

  return verifyRequestId
}

/* async function requestAirdrop(discordId: string, guildId: string) {
  let user = await prisma.user.findUnique({
    where: {
      discordId,
    },
  })
  if (!user) {
    user = await prisma.user.create({
      data: {
        discordId,
      },
    })
  }

  const verifyRequestId = uuid.v4()

  let mintAccess = await prisma.mintAccess.findFirst({
    where: {
      userId: user.id,
    },
  })

  /* for (let i = 0; i < 1000; i++) {
    const mint = weighted.select(
      mints.map((m) => m.mint),
      mints.map((m) => m.mintCount)
    );
    if (mints.find((m) => m.mint == mint)?.mintCount === 7)
      console.log(i + " seven");
  }

  console.log(
    "t",
    mints.map((m) => ({ [m.mint]: m.mintCount })),
    weighted.select(mints.map((m) => ({ [m.mint]: m.mintCount })))
  ); */

/*
  const mint = weighted.select(
    mints.map((m) => m.mint),
    mints.map((m) => m.mintCount)
  )
  const mintId = mint

  if (!mintAccess) {
    mintAccess = await prisma.mintAccess.create({
      data: {
        userId: user.id,
        mintId: mintId,
      },
    })
  }

  if (mintAccess?.hasBeenUsed) {
    throw new Error('already received a airdrop')
  }

  if (!mintAccess.mintId) {
    mintAccess = await prisma.mintAccess.update({
      where: { id: mintAccess.id },
      data: {
        mintId: mintId,
      },
    })
  }

  return mintAccess
} */

@Discord()
class Main {
  @SimpleCommand('permcheck', { aliases: ['ptest'] })
  @Permission(false)
  @Permission({
    id: '462341082919731200',
    type: 'USER',
    permission: true,
  })
  async permFunc(command: SimpleCommandMessage) {
    command.message.reply('access granted')
  }

  @SimpleCommand('hola', { aliases: ['hi'] })
  hello(command: SimpleCommandMessage) {
    command.message.reply(`👋 ${command.message.member}`)
  }
  @Slash('testo')
  async testo(interaction: CommandInteraction) {
    console.log('ubotser.id', client.user?.id, client.user?.username)

    interaction.reply({ ephemeral: true, content: 'hola' })
  }

  /*  @Slash('airdrop')
  async airdrop(interaction: CommandInteraction) {
    try {
      const guild =
        interaction.guild ??
        (await client.guilds.fetch(interaction?.guildId ?? ''))

      if (!guild) throw new Error('no guild defined')

      const airdrop = await requestAirdrop(interaction.user.id, guild.id)

      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Click here to request the airdrop')
        .setURL(
          airdropWebhost +
            '?mintAccessId=' +
            airdrop.id +
            '&mintId=' +
            airdrop.mintId
        )

      const user = await client.users.fetch(interaction.user.id)

      if (!user) throw new Error('fatal: discord user not found')

      // user.send({
      //   content: `Click to get airdrop`,
      //   embeds: [embed],
      // });

      interaction.reply({
        content: `Click to get airdrop`,
        embeds: [embed],
        ephemeral: true,
      })
    } catch (e: any) {
      console.error('error at /airdrop', e)

      try {
        const user = await client.users.fetch(interaction.user.id)
        // user.send(
        //   "Error at /airdrop. If you already received an airdrop, you cant get another one"
        // );

        interaction.reply({
          content: e.message,
          ephemeral: true,
        })
      } catch (e) {
        console.error('error at /airdrop', e)
      }
    }
  } */

  @Slash('verifysol')
  async verifySol(interaction: CommandInteraction) {
    try {
      interaction.deferReply({ ephemeral: true })
      const guild =
        interaction.guild ??
        (await client.guilds.fetch(interaction?.guildId ?? ''))

      if (!guild) throw new Error('no guild defined')

      const verifyRequestId = await requestVerification({
        discordId: interaction.user.id,
        guildId: guild.id,
      })

      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Click here to verify sol address')
        .setURL(`${config.webHost}/verify?id=${verifyRequestId}`)

      const user = await client.users.fetch(interaction.user.id)

      if (!user) throw new Error('fatal: discord user not found')

      // user.send({
      //   content: `click to verify sol adress`,
      //   embeds: [embed],
      // });

      interaction.editReply({
        content: `click to verify sol adress`,
        embeds: [embed],
      })
    } catch (e) {
      console.error('error at /verifysol', e)
    }
  }

  @Slash('verifyledger')
  async verifyLedger(interaction: CommandInteraction) {
    try {
      interaction.deferReply({ ephemeral: true })
      const guild =
        interaction.guild ??
        (await client.guilds.fetch(interaction?.guildId ?? ''))

      if (!guild) throw new Error('no guild defined')

      const randomLamportAmount = _.random(1, 99999, false)

      const verifyRequestId = await requestVerification({
        discordId: interaction.user.id,
        guildId: guild.id,
        ledgerVerifyAmount: randomLamportAmount,
      })

      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Click here to verify your ledger')
        .setURL(
          `${config.webHost}/verifyLedger?id=${verifyRequestId}&amount=${randomLamportAmount}`
        )

      const user = await client.users.fetch(interaction.user.id)

      if (!user) throw new Error('fatal: discord user not found')

      // user.send({
      //   content: `click to verify sol adress`,
      //   embeds: [embed],
      // });

      interaction.editReply({
        content: `click to verify sol adress`,
        embeds: [embed],
      })
    } catch (e) {
      console.error('error at /verifysol', e)
    }
  }

  /*  @Slash('verifyledger')
  async verifyledger(interaction: CommandInteraction) {
    try {
      interaction.deferReply({ ephemeral: true })

      interaction.editReply({
        content: `click to verify sol adress`,
        embeds: [embed],
      })
    } catch (e) {
      console.error('error at /verifysol', e)
    }
  } */

  @Slash('verifyrole')
  async verifRole(interaction: MessageComponentInteraction) {
    try {
      await interaction.deferReply({
        ephemeral: true,
      })

      const guild =
        interaction.guild ??
        (await client.guilds.fetch(interaction?.guildId ?? ''))

      if (!guild) throw new Error('no guild defined')

      const member = await guild.members.fetch(interaction.user.id)

      const dbUser = await prisma.user.findUnique({
        where: {
          discordId: member.user.id,
        },
      })

      if (!dbUser || !dbUser.address) {
        await interaction.editReply({
          content: 'you need to run /verifysol first',
        })
        return
      }

      console.log('hoila')

      const roles = await updateApeRolesOfMember(member)

      if (roles.length === 0) {
        return await interaction.editReply({
          content:
            'sorry non chimpion, you dont own any ape with your verified sol address, run /verifysol with your ape owner address',
        })
      }

      if (roles.length > 1) {
        return await interaction.editReply({
          content: `You are now a verified owner of: ${roles.join(
            ', '
          )}! Probably puffin? haha 
          `,
        })
      }
    } catch (e) {
      console.error('error at /verifrole', e)
    }
  }
}
