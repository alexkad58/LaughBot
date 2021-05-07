  
const byeMessageSchema = require('../../schemas/bye-message-schema')

module.exports = {
    name: 'Set bye message',
    aliases: ['setbye', 'sbye'], 
    category: 'Configuration',
    permissions: ['ADMINISTRATOR'],
    minArgs: 1,
    description: 'Set up server bye message',
    callback: async ({ message, text }) => {
        const { channel, guild } = message
        await byeMessageSchema.findOneAndUpdate({
            guildId: guild.id
        },{
            guildId: guild.id,
            channelId: channel.id,
            text
        },{
            upsert: true
        })

        setTimeout(() => {
            message.delete()
        }, 2000)
    } 
}