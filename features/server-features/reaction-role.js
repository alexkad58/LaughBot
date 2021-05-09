const rolesMessageSchema = require('../../schemas/reaction-roles-schema')

const cache = {}

const fetchCache = (guildId) => cache[guildId] || []

const addToCache = async (guildId, message, emoji, roleId) => {
    const array = cache[guildId] || [message, {}]

    if (emoji && roleId) {
        array[1][emoji] = roleId
    }

    await message.channel.messages.fetch(message.id, true, true)

    cache[guildId] = array
}

const handleReaction = (reaction, user, adding) => {
    const { message } = reaction
    const { guild } = message

    const [fetchedMessage, roles] = fetchCache(guild.id)
    if (!fetchedMessage) {
        return
    }

    if (fetchedMessage.id === message.id) {
        const toCompare = reaction.emoji.id || reaction.emoji.name

        for (const key of Object.keys(roles)) {
            if (key === toCompare) {
                const role = guild.roles.cache.get(roles[key])
                if (role) {
                    const member = guild.members.cache.get(user.id)

                    if (adding) {
                        member.roles.add(role)
                    } else {
                        member.roles.remove(role)
                    }
                }
                return
            }
        }
    }
}

module.exports = async (client) => {
    client.on('messageReactionAdd', (reaction, user) => {
        handleReaction(reaction, user, true)
    })
    client.on('messageReactionRemove', (reaction, user) => {
        handleReaction(reaction, user, false)
    })

    const results = await rolesMessageSchema.find()

    for (result of results) {
        const { guildId, channelId, messageId, roles } = result

        const guild = await client.guilds.cache.get(guildId)

        if (!guild) {
            await rolesMessageSchema.deleteOne({ guildId })
            return
        }

        const channel = await guild.channels.cache.get(channelId)

        if (!channel) {
            await rolesMessageSchema.deleteOne({ channelId })
            return
        }

        try {
            const cacheMessage = true
            const skipCache = true
            const fetchedMessage = await channel.messages.fetch(messageId, cacheMessage, skipCache)

            if (fetchedMessage) {
                const newRoles = {}

                for (role of roles) {
                    const { emoji, roleId } = role
                    newRoles[emoji] = roleId
                }
                cache[guildId] = [fetchedMessage, newRoles]
            }
        } catch (e) {
            await rolesMessageSchema.deleteOne({ messageId })
        }
    }
}

module.exports.config = {
    loadDBFirst: true
}

module.exports.fetchCache = fetchCache
module.exports.addToCache = addToCache