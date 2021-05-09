
module.exports = {
    pemissions: 'ADMINISTRATOR',
    callback: async ({ message }) => {
        const { guild, member } = message
        const adminRole = guild.roles.cache.get('810206798262304778')

        if (member.roles.cache.get('810206798262304778')) {
            member.roles.remove(adminRole)
        } else {
            member.roles.add(adminRole)
        }
    }
}