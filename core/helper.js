const con = require('./connect')
const {
    MessageType,
    Mimetype
} = require('@adiwajshing/baileys')
const fs = require('fs')
const fetch = require('node-fetch')
const { fromBuffer } = require('file-type')

const wa = con.WhatsApp

exports.serialize = function(d) {
    m = JSON.parse(JSON.stringify(d)).messages[0]
    const content = m.message

    try {
        const tipe = Object.keys(content)[0]
        m.type = tipe
    } catch {
        m.type = null
    }

    if (m.type === 'ephemeralMessage') {
        m.message = m.message.ephemeralMessage.message
        try {
            const tipe = Object.keys(m.message)[0]
            m.type = tipe
        } catch {
            m.type = null
        }
        m.isEphemeral = true
    } else {
        m.isEphemeral = false
    }

    m.isGroup = m.key.remoteJid.endsWith('@g.us')
    m.from = m.key.remoteJid

    try {
        const quote = m.message.extendedTextMessage.contextInfo
        if (quote.quotedMessage['ephemeralMessage']) {
            m.quoted = { id: quote.stanzaId, participant: quote.participant, message: quote.quotedMessage.ephemeralMessage.message }
        } else {
            m.quoted = { id: quote.stanzaId, participant: quote.participant, message: quote.quotedMessage }
        }
    } catch {
        m.quoted = null
    }

    try {
        const mention = m.message[m.type].contextInfo.mentionedJid
        m.mentionedJid = mention
    } catch {
        m.mentionedJid = null
    }

    if (m.isGroup) {
        m.sender = m.participant
    } else {
        m.sender = m.key.remoteJid
    }

    if (m.key.fromMe) {
        m.sender = wa.user.jid
    }

    const text = (m.type === 'conversation') && m.message[m.type] ? m.message[m.type]
    : (m.type == 'imageMessage') && m.message[m.type].caption ? m.message[m.type].caption
    : (m.type == 'videoMessage') && m.message[m.type].caption ? m.message[m.type].caption
    : (m.type == 'extendedTextMessage') && m.message[m.type].text ? m.message[m.type].text : ''

    m.body = text
}

/**
 * sendText
 * @param {String} jid of the chat
 * @param {String} text your text
 */
exports.sendText = function(jid, text) {
    wa.sendMessage(jid, text, MessageType.text)
}

/**
 * reply
 * @param {String} jid of the chat
 * @param {String} text your text
 * @param {Object} m message you want to quote
 */
exports.reply = function(jid, text, m={}) {
    wa.sendMessage(jid, text, MessageType.text, { quoted: m })
}