const {
    WAConnection
} = require('@adiwajshing/baileys')
const fs = require('fs')

const con = new WAConnection()
exports.WhatsApp = con

exports.connect = async () => {

    // Custom Browser
    con.browserDescription = ['SelfBot', 'Firefox', '88']

    con.on('open', () => {
        console.log('Credential updated!')
        fs.writeFileSync('./Midnight.json', JSON.stringify(con.base64EncodedAuthInfo(), null, '\t'))
    })

    con.on('qr', () => {
        console.log('Scan QR Code above!')
    })

    fs.existsSync('./Midnight.json') && con.loadAuthInfo('./Midnight.json')
    await con.connect({ timeoutMs: 10*1000 })
    fs.writeFileSync('./Midnight.json', JSON.stringify(con.base64EncodedAuthInfo(), null, '\t'))

    return con
}
