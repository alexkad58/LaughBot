  
const serverStatSchema = require('../../schemas/server-stat-schema')
const { fetch } = require('../../features/server-features/server-stat-feature')

module.exports = {
    name: 'Create server statistic channels',
    aliases: ['createserverstat', 'css'], 
    category: 'Configuration',
    permissions: ['ADMINISTRATOR'],
    description: 'Create server live statistic channels',
    guildOnly: true,
    callback: async ({ message, instance, client }) => {
        if (!message.guild) return

        const { guild, channel } = message

        let weekDay = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'][new Date().getDay()]

            const dateChannel = await guild.channels.create(`...`, { type: 'voice' })
            const onlineChannel = await guild.channels.create(`...`, { type: 'voice' })

            dateChannel.updateOverwrite(guild.roles.everyone, {
                CONNECT: false
            })

            onlineChannel.updateOverwrite(guild.roles.everyone, {
                CONNECT: false
            })

            await serverStatSchema.findOneAndUpdate({
                guildId: guild.id
            }, {
                guildId: guild.id,
                dateChannelId: dateChannel.id,
                onlineChannelId: onlineChannel.id
            }, {
                upsert: true
            })

        await fetch(client)
    } 
}