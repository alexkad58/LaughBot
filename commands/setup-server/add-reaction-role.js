const { fetchCache, addToCache } = require('../../features/server-features/reaction-role')
const rolesMessageSchema = require('../../schemas/reaction-roles-schema')

module.exports = {
    expectedArgs: '<emoji> <role> <text>',
    name: 'Add reaction role',
    aliases: ['addreactionrole', 'addrr'], 
    category: 'Configuration',
    permissions: ['ADMINISTRATOR'],
    minArgs: 3,
    description: 'Adding new reaction role',
    callback: async ({ message, args }) => {
        const { guild } = message

        let emoji = args.shift()
        let role = args.shift()
        const displayName = args.join(' ')

        if (role.startsWith('<@&')) {
            role = role.substring(3, role.length - 1)
        }

        const newRole = guild.roles.cache.find(r => {
            return r.name === role || r.id === role
        }) || null

        if (!newRole) {
            message.react('🚫')
            return
        }

        role = newRole

        if (emoji.includes(':')) {
            const emojiName = emoji.split(':')[1]
            emoji = guild.emojis.cache.find(e => {
                return e.name === emojiName
            })
        }

        const [fetchedMessage] = fetchCache(guild.id)
        if (!fetchedMessage) {
            message.react('🚫')
            return
        }

        const newLine = `${emoji} ${displayName}`
        let { content } = fetchedMessage
        if (content.includes(emoji)) {
            const split = content.split('\n')

            for (a = 0; a < split.lengh; ++a) {
                if (split[a].includes(emoji)) {
                    split[a] = newLine
                }
            }

            content = split.join('\n')
        } else {
            content += `\n${newLine}`
            fetchedMessage.react(emoji)
        }

        fetchedMessage.edit(content)

        const obj = {
            guildId: guild.id,
            channelId: fetchedMessage.channel.id,
            messageId: fetchedMessage.id
        }

        await rolesMessageSchema.findOneAndUpdate(obj, {
            ...obj,
            $addToSet: {
                roles: {
                    emoji,
                    roleId: role.id
                }
            }
        }, {
            upsert: true
        })

        addToCache (guild.id, fetchedMessage, emoji, role.id)
    }
}