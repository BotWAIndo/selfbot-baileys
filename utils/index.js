const chalk = require('chalk')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')

const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

const processTime = (timestamp, now) => {
    return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const getGroupAdmins = (participants) => {
	admins = []
	for (let i of participants) {
		i.isAdmin ? admins.push(i.jid) : ''
	}
	return admins
}

const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

const hilih = (text) => { // by LoL-Human and MRHRTZ@kali~:#
    const K = new RegExp("[AIUEOaiueo]", "g")
    text = text.replace(K, "i")
    return text
}

module.exports = {
    color,
    processTime,
    sleep,
    getGroupAdmins,
    getRandom,
    hilih
}
