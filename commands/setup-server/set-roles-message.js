const rolesMessageSchema = require('../../schemas/reaction-roles-schema')
const { addToCache } = require('../../features/server-features/reaction-role')

module.exports   = {
    name: 'Set roles message',
    aliases: ['setrolesmessage', 'srlsmsg'], 
    category: 'Configuration',
    permissions: ['ADMINISTRATOR'],
    minArgs: 1,
    description: 'Set up server roles message',

    callback: async ({ message, args, client, prefix, instance }) => {
        const { guild, mentions } = message 
        const { channels } = mentions
        const targetChannel = channels.first() || message.channel

        if (channels.first()) {
            args.shift()
        }

        const text2 = args.join(' ')

        const newMessage = await targetChannel.send(text2)

        addToCache(guild.id, newMessage)

        new rolesMessageSchema({
            guildId: guild.id,
            channelId: targetChannel.id,
            messageId: newMessage.id
        })
            .save()
            .catch(() => {
                message.react('🚫')
            })
    }
}