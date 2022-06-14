import { prisma } from './prisma'
import { getRolesForUser } from './utils/solUtils'
import { assignRoleToMember } from './utils/discordUtils'
import { GuildMember } from 'discord.js'

export const apeOwnerRoleName = 'SAC Holder'

export const allApeRoleNames = [
  'Chimpion',
  'Businessman',
  'Farmer',
  'Scientist',
  'Artist',
  apeOwnerRoleName,
  '420 Sealz',
  'Bob Marley',
  'Pablo Escobar',
  'Caesare',
  'Iron Mike',
  'OG',
  'Zombie Ape',
  'Chong',
  'Cheech',
  'NAC Holder',
]

export async function updateApeRolesOfMember(member: GuildMember) {
  const guild = member.guild

  const dbUser = await prisma.user.findUnique({
    where: {
      discordId: member.user.id,
    },
  })

  if (!dbUser || !dbUser.address) throw new Error('db User not found')

  const roles = await getRolesForUser(dbUser.address)


  const apeRoles = guild.roles.cache
    .toJSON()
    .filter((r) => allApeRoleNames.includes(r.name))

  await member.roles.remove(apeRoles)

  for (const role of roles) {
    try {
      await assignRoleToMember(member, {
        name: role,
      })
    } catch (e) {
      console.error(`error at assigning role "${role}" to member`, e)
    }
  }
  console.log(
    `assigned ${roles.join(', ') || 'no roles'} to ${member.user.username}`
  )
  return roles
}
