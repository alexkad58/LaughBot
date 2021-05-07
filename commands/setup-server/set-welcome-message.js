  
const welcomeMessageSchema = require('../../schemas/welcome-message-schema')

module.exports = {
    name: 'Set welcome message',
    aliases: ['setwelcome', 'swel'], 
    category: 'Configuration',
    permissions: ['ADMINISTRATOR'],
    minArgs: 1,
    description: 'Set up server welcome message',
    callback: async ({ message, text }) => {
        const { channel, guild } = message
        await welcomeMessageSchema.findOneAndUpdate({
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