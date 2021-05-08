const gagSchema = require("../../schemas/gag-schema")
const { scanForGags } = require('../../src/utils')

let cache = {}

const fetchData = async () => {
    const results = await gagSchema.find()

    for (const result of results) {
        cache[result.userId] = result.gag
    }
}

const populateCache = async () => {
    cache = {}

    await fetchData()
} 

module.exports = (client, instance) => {
    populateCache()

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

module.exports.fetchData = fetchData

module.exports.config = {
    loadDBFirst: true
}