  
const privateVoiceChannelSchema = require('../../schemas/private-voice-channel-schema')
const { fetch } = require('../../features/server-features/private-voice-channel')

module.exports = {
    name: 'Set private vc',
    aliases: ['setpvc', 'spvc'], 
    category: 'Configuration',
    permissions: ['ADMINISTRATOR'],
    description: 'Set up server private voice channel',
    callback: async ({ message, instance, client }) => {
        if (!message.guild) return

        const { guild, channel } = message

        const parentName = instance.messageHandler.get(guild, 'PRIVATE_ROOM_PARENT')
        const channelName = instance.messageHandler.get(guild, 'PRIVATE_ROOM_NAME')

        guild.channels.create(`・━━━━━ ${parentName} ━━━━・`, { type: 'category' }).then(category => {
            guild.channels.create(`➡・${channelName}`, { type: 'voice', parent: category.id }).then(async vc => {
                await privateVoiceChannelSchema.findOneAndUpdate({ 
                    guildId: guild.id
                }, {
                    guildId: guild.id,
                    channelId: vc.id,
                    parentId: category.id
                },{
                    upsert: true
                })
            })
        })

        await fetch(client)
    } 
}