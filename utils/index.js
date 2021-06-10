const chalk = require('chalk')
const moment = require('moment-timezone')
const phoneNum = require('awesome-phonenumber')
moment.tz.setDefault('Asia/Jakarta').locale('id')

const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

const processTime = (timestamp, now) => {
    return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

const getGroupAdmins = (participants) => {
	admins = []
	for (let i of participants) {
		i.isAdmin ? admins.push(i.jid) : ''
	}
	return admins
}

const random = () => {
    return `${Math.floor(Math.random() * 10000)}`
}

const random_1 = (ext) => {
    return `${~~(Math.random() * 1e4)}${ext}`
}
const hilih = (text) => { // by LoL-Human and MRHRTZ@kali~:#
    const K = new RegExp("[AIUEOaiueo]", "g")
    text = text.replace(K, "i")
    return text
}

/**
 * vcard
 * @param {String} jid the id contact
 * @param {String} name the contact displayName
 * @returns 
 */
const vcard = (jid, name) => {
    let phone = jid.replace(/[^0-9]/g,'')
    if (!name) name = phone
    return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=CELL;waid=${phone}:${phoneNum('+'+phone).getNumber('international')}\nEND:VCARD`.trim()
}

module.exports = {
    color,
    processTime,
    vcard,
    getGroupAdmins,
    random,
    random_1,
    hilih
}
