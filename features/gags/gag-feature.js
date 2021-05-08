const gagSchema = require("../../schemas/gag-schema")
const { scanForGags } = require('../../src/utils')

let cache = {}

const fetchData = async (client) => {
    const results = await gagSchema.find()

    for (const result of results) {
        cache[result.userId] = result.gag
    }
}

const populateCache = async (client) => {
    cache = {}

    await fetchData(client)
} 

module.exports = (client, instance) => {
    populateCache(client)

    client.on('voiceStateUpdate', (oldState, newState) => {
        if(!cache[newState.id]) return
        if(!(oldState.selfMute == true && newState.selfMute == false && newState.channel)) return 

        const gag = cache[newState.id]

        scanForGags(gag).then(isGag => {
            if (!isGag) return

            newState.channel.join().then(async connection => {
                connection.play(`src/audio/${gag}.mp3`)
            })
        })
    })
}

module.exports.config = {
    loadDBFirst: true
}