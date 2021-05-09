  
const welcomeMessageSchema = require('../../schemas/welcome-message-schema')

module.exports = (client, instance) => {
    client.on('guildMemberAdd', async (member) => {
        const cache = {}
        let data = cache[member.guild.id]
        if (!data) {
            const results = await welcomeMessageSchema.findOne({ guildId: member.guild.id })
            if (!results) return
            cache[member.guild.id] = data = [results.channelId, results.text]    
        }
        if (!data) return
        const channelId = data[0]
        const text = data[1]
        const channel = member.guild.channels.cache.get(channelId)
        if (!channel) return
        channel.send(text.replace(`<@>`, `<@${member.id}>`))
    })
}

module.exports.config = {
    loadDBFirst: true
}