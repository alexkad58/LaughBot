  
const serverStatSchema = require('../../schemas/server-stat-schema')

let statCache = {}

const getDate = () => {
    const now = new Date()
    var dateString = now.toString().split(" ").slice(0, -6).join(' ')

    return dateString
}

const getOnline = async (guild) => {
    let onlineUsers = 0
    let notDisturbUsers = 0
    let afkUsers = 0

    await guild.members.fetch()

    onlineUsers = guild.members.cache.filter(member => member.presence.status == "online").size
    notDisturbUsers = guild.members.cache.filter(member => member.presence.status == "dnd").size
    afkUsers = guild.members.cache.filter(member => member.presence.status == "idle").size

    const finalOnline = `🟢${onlineUsers}  🔴${notDisturbUsers}  🌙${afkUsers}`

    return finalOnline
}

const updateServerStat = (client) => {
    Object.keys(statCache).forEach(async guildId => {
        const guild = client.guilds.cache.get(guildId)
        const dateChannel =  await guild.channels.cache.get(statCache[guildId][0])
        const onlineChannel = await guild.channels.cache.get(statCache[guildId][1])

        dateChannel.edit({ name: `${getDate()}` })
        onlineChannel.edit({ name: `${await getOnline(guild)}` })
    })
}

const fetchData = async (client) => {
    const results = await serverStatSchema.find({})
    for(const result of results) {
        const guild = client.guilds.cache.get(result.guildId)
        if (guild) {
            const dateChannel = guild.channels.cache.get(result.dateChannelId)
            const onlineChannel = guild.channels.cache.get(result.onlineChannelId)
            if (dateChannel && onlineChannel) {
                statCache[result.guildId] = [result.dateChannelId, result.onlineChannelId]
            }
        }
    }

    updateServerStat(client)
}

const populateCache = async (client) => {

    await fetchData(client)

    setTimeout(() => { populateCache(client) }, 1000 * 60 * 10)
}

module.exports = (client, instance) => {
    populateCache(client)
    
}

module.exports.config = {
    loadDBFirst: true
}

module.exports.fetch = fetchData