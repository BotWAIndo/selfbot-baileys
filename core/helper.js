const con = require('./connect')
const {
    MessageType,
    Mimetype
} = require('@adiwajshing/baileys')
const fs = require('fs')
const fetch = require('node-fetch')
const { fromBuffer } = require('file-type')

const wa = con.WhatsApp

exports.serialize = function (chat) {
    m = JSON.parse(JSON.stringify(chat)).messages[0];
    const content = m.message;
  
    try {
      const tipe = Object.keys(content)[0];
      m.type = tipe;
    } catch {
      m.type = null;
    }
  
    if (m.type === 'viewOnceMessage') {
      m.message = m.message.viewOnceMessage.message;
  
      try {
        const tipe = Object.keys(m.message)[0];
        m.type = tipe;
      } catch {
        m.type = null;
      }
    }
  
    if (m.type === 'ephemeralMessage') {
      m.message = m.message.ephemeralMessage.message;
      const tipe = Object.keys(m.message)[0];
  
      if (tipe === 'viewOnceMessage') {
        m.message = m.message.viewOnceMessage.message;
  
        try {
          const tipe = Object.keys(m.message)[0];
          m.type = tipe;
        } catch {
          m.type = null;
        }
      }
  
      try {
        const tipe = Object.keys(m.message)[0];
        m.type = tipe;
      } catch {
        m.type = null;
      }
  
      m.isEphemeral = true;
    } else {
      m.isEphemeral = false;
    }
  
    m.isGroup = m.key.remoteJid.endsWith('@g.us');
    m.from = m.key.remoteJid;
  
    try {
      const quote = m.message[m.type].contextInfo;
      if (quote.quotedMessage['ephemeralMessage']) {
        const tipe = Object.keys(quote.quotedMessage['ephemeralMessage'].message)[0];
        console.log(tipe);
  
        if (tipe === 'viewOnceMessage') {
          m.quoted = {
            type: 'view_once',
            stanzaId: quote.stanzaId,
            participant: quote.participant,
            message: quote.quotedMessage.ephemeralMessage.message.viewOnceMessage.message
          }
        } else {
          m.quoted = {
            type: 'ephemeral',
            stanzaId: quote.stanzaId,
            participant: quote.participant,
            message: quote.quotedMessage.ephemeralMessage.message,
          };
        }
      } else if (quote.quotedMessage['viewOnceMessage']) {
        m.quoted = {
          type: 'view_once',
          stanzaId: quote.stanzaId,
          participant: quote.participant,
          message: quote.quotedMessage.viewOnceMessage.message
        };
      } else {
        m.quoted= {
          type: 'normal',
          stanzaId: quote.stanzaId,
          participant: quote.participant,
          message: quote.quotedMessage
        }
      }
    } catch {
      m.quoted = null;
    }
  
    try {
      const mention = m.message[m.type].contextInfo.mentionedJid;
      m.mentionedJid = mention;
    } catch {
      m.mentionedJid = null;
    }
  
    if (m.isGroup) {
      m.sender = m.participant;
    } else {
      m.sender = m.key.remoteJid;
    }
  
    if (m.key.fromMe) {
      m.sender = wa.user.jid;
    }
  
    const txt =
      m.type === 'conversation' && m.message[m.type]
        ? m.message[m.type]
        : m.type == 'imageMessage' && m.message[m.type].caption
        ? m.message[m.type].caption
        : m.type == 'videoMessage' && m.message[m.type].caption
        ? m.message[m.type].caption
        : m.type == 'extendedTextMessage' && m.message[m.type].text
        ? m.message[m.type].text
        : m.type == 'buttonsResponseMessage' && m.message[m.type].selectedButtonId
        ? m.message[m.type].selectedButtonId
        : m.type == 'listResponseMessage' && m.message[m.type].singleSelectReply.selectedRowId
        ? m.message[m.type].singleSelectReply.selectedRowId
        : '';
    m.body = txt;
  
    return m;
  };

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
    wa.sendMessage(jid, text, MessageType.text, { quoted: m, detctLinks: false })
}

/**
 * mentions
 * @param {String} jid the id of chat
 * @param {String} text your text
 * @param {Array} participants participants jid in array
 * @param {Object} m message want to quote
 */
exports.mentions = function(jid, text, participants, m={}) {
    if (!text) throw new Error('Parameter \'text\' must be filled.')
    if (typeof text !== 'string') throw new TypeError(`\'text\' need to be string. Received ${typeof text}`)
    wa.sendMessage(jid, text, MessageType.extendedText, { quoted: m, contextInfo: { mentionedJid: participants }})
}