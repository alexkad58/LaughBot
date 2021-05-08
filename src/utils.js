const path = require('path')
const fs = require('fs')

const scanForGags = (gag) => {
    return new Promise((resolve, reject) => {
        const directoryPath = path.join(__dirname, './audio')
    
        let isGag = false
    
        fs.readdir(directoryPath, (err, files) => {
            if (err) return 
            files.forEach(file => {
                if (gag === file.slice(0, -4)) isGag = true
            }) 
            resolve(isGag)
        })
      })
}

const getNickName = (member) => {
    if (!member.nickname) return member.user.username
    return member.nickname
}

module.exports.scanForGags = scanForGags

module.exports.getNickName = getNickName