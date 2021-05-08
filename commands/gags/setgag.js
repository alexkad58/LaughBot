const gagSchema = require('../../schemas/gag-schema')
const { scanForGags } = require('../../src/utils')
const { fetchData } = require('../../features/gags/gag-feature')

module.exports = {
    name: 'Gag set',
    description: 'Sets a gag',
    category: 'Gags',
    aliases: ['setgag', 'sg'],
    minArgs: 1,
    expectedArgs: '<gag>',
    callback: async ({ message, text }) => {
        scanForGags(text).then(async isGag => {
            if (!isGag) return message.react('🚫')

            await gagSchema.findOneAndUpdate({
                userId: message.author.id
            }, {
                userId: message.author.id,
                gag: text
            }, {
                upsert: true
            })
            fetchData()
            message.react('👌')
        })
    }
}