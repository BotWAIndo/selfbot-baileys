// system
const con = require('./core/connect')
const wa = require('./core/helper')
const {
    MessageType,
    Mimetype
} = require('@adiwajshing/baileys')

// needed
const utils = require('./utils')
const fetcher = require('./utils/fetcher')
const meme = require('./utils/meme')
const translate = require('./utils/translate')
const moment = require('moment-timezone')
const durSetup = require('moment-duration-format')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const { exec } = require('child_process')

// -
durSetup(moment)
const ev = con.WhatsApp
const readyAt = new Date()
let prefix = '!'
let fakeImg = fs.readFileSync('./media/images/9739.png')
con.connect()

// some function
function runtime() {
    return `${moment.duration(Date.now() - readyAt.getTime()).format('D [hari], H [jam], m [menit], s [detik]')}`
}
function logger(cmd, group, subject, phone) {
    const time = moment().format('DD/MM/YY HH:mm:ss z')
    if (cmd && !group) return console.log(utils.color(`[${time}]`, 'yellow'), utils.color('[CMD]', 'aqua'), 'from', utils.color(phone.split('@')[0], 'lime'))
    if (cmd && group) return console.log(utils.color(`[${time}]`, 'yellow'), utils.color('[CMD]', 'aqua'), 'from', utils.color(phone.split('@')[0], 'lime'), 'in', utils.color(subject, 'lime'))
    if (!cmd && !group) return console.log(utils.color(`[${time}]`, 'yellow'), utils.color('[MSG]', 'aqua'), 'from', utils.color(phone.split('@')[0], 'lime'))
    if (!cmd && group) return console.log(utils.color(`[${time}]`, 'yellow'), utils.color('[MSG]', 'aqua'), 'from', utils.color(phone.split('@')[0], 'lime'), 'in', utils.color(subject, 'lime'))
}

ev.on('chat-update', async (msg) => {
    try {
        if (!msg.hasNewMessage) return;
        msg = wa.serialize(msg)
        if (!msg.message) return;
        if (msg.key && msg.key.remoteJid === 'status@broadcast') return ev.logger.info(`Receive broadcast in ${msg.key.remoteJid}`);
        if (!msg.key.fromMe) return;
        const { from, sender, mentionedJid, quoted, isGroup, type, isEphemeral } = msg
        let { body } = msg
        body = (type === 'conversation' && body.startsWith(prefix)) ? body : (((type == 'imageMessage' || type == 'videoMessage') && body) && body.startsWith(prefix)) ? body : (type === 'extendedTextMessage' && body.startsWith(prefix)) ? body : ''
        const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
        const arg = body.substring(body.indexOf(' ') + 1)
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)

        const content = JSON.stringify(msg.quoted)
        const isMedia = (type === 'imageMessage' || type === 'videoMessage')
        const isQStick = type === 'extendedTextMessage' && content.includes('stickerMessage')
        const isQImg = type === 'extendedTextMessage' && content.includes('imageMessage')
        const isQVid = type === 'extendedTextMessage' && content.includes('videoMessage')
        const { text, extendedText, contact, contactsArray, location, liveLocation, image, video, sticker, document, audio, groupInviteMessage } = MessageType

        const groupMeta = isGroup ? await ev.groupMetadata(from) : ''
        const groupSub = isGroup ? groupMeta.subject : ''
        const groupMems = isGroup ? groupMeta.participants : ''
        const groupAdmins = isGroup ? utils.getGroupAdmins(groupMems) : ''
        const isMeAdmin = groupAdmins.includes(ev.user.jid)

        // logging event
        logger(isCmd, isGroup, groupSub, sender)

        switch(command) {
            case 'ping': case 'speed':
                wa.reply(from, `*${utils.processTime(msg.messageTimestamp, moment())} _seconds_*`, msg)
                break
            case 'stik': case 'stiker': case 'stick': case 's':
                if (isMedia && !msg.message.videoMessage || isQImg) {
                    const encmed = isQImg ? quoted : msg
                    const rand = utils.random()
                    const rand_1 = utils.random_1('.webp')
                    const path = await ev.downloadAndSaveMediaMessage(encmed, `./temp/${rand}`)
                    ffmpeg(path)
                    .on('start', function(cmd) {
                        console.log('[FFMPEG]', cmd)
                    })
                    .on('error', function(err) {
                        fs.unlinkSync(path)
                        console.log('[FFMPEG]', err)
                    })
                    .on('end', () => {
                        console.log('[FFMPEG] Finish')
                        ev.sendMessage(from, fs.readFileSync(`./temp/${rand_1}`), sticker, { quoted: msg })
                        fs.unlinkSync(path)
                        fs.unlinkSync(`./temp/${rand_1}`)
                    })
                    .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                    .toFormat('webp')
                    .save(`./temp/${rand_1}`)
                } else if (isMedia && msg.message.videoMessage.seconds <= 11 || isQVid && quoted.message.videoMessage.seconds <= 11) {
                    const encmed = isQVid ? quoted : msg
                    const rand = utils.random()
                    const rand_1 = utils.random_1('.webp')
                    const path = await ev.downloadAndSaveMediaMessage(encmed, `./temp/${rand}`)
                    ffmpeg(path)
                    .inputFormat(path.split('.')[1])
                    .on('start', function(cmd) {
                        console.log('[FFMPEG]', cmd)
                    })
                    .on('error', function(e) {
                        fs.unlinkSync(path)
                        console.log('[FFMPEG]', e)
                    })
                    .on('end', () => {
                        ev.sendMessage(from, fs.readFileSync(`./temp/${rand_1}`), sticker, { quoted: msg })
                        fs.unlinkSync(path)
                        fs.unlinkSync(`./temp/${rand_1}`)
                    })
                    .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                    .toFormat('webp')
                    .save(`./temp/${rand_1}`)
                } else {
                    wa.reply(from, 'what?', msg)
                }
                break
            case 'toimg': case 'tomedia':
                if (isQStick && !quoted.message.stickerMessage.isAnimated) {
                    const rand = utils.random()
                    const rand_1 = utils.random_1('.png')
                    const path = await ev.downloadAndSaveMediaMessage(quoted, `./temp/${rand}`)
                    exec(`ffmpeg -i ${path} ./temp/${rand_1}`, (e) => {
                        if (e) return console.log('[FFMPEG]', 'toimg', e) && fs.unlinkSync(path)
                        ev.sendMessage(from, fs.readFileSync(`./temp/${rand_1}`), image, { quoted: msg })
                        .then(() => {
                            fs.unlinkSync(path)
                            fs.unlinkSync(`./temp/${rand_1}`)
                        })
                    })
                } else {
                    wa.reply(from, `currently, can\'t decode animated sticker!\n\nNote: please, reply the sticker`, msg)
                }
                break
            case 'memeimg': case 'mememaker':
                if (isMedia && !msg.message.videoMessage || isQImg) {
                    if (!body.includes('|')) return wa.reply(from, `How to: ${prefix}${command} top text|bottom text`, msg)
                    const encmed = isQImg ? quoted : msg
                    const top = arg.split('|')[0]
                    const bottom = arg.split('|')[1]
                    const med = await ev.downloadMediaMessage(encmed, `buffer`)
                    const getUrl = await fetcher.uploadImages(med)
                    const memeRes = await meme.custom(getUrl, top, bottom)
                    ev.sendMessage(from, memeRes, image, { quoted: msg })
                }
                break
            case 'tagall': case 'tga': case 'announce':{
                let mems_id = new Array()
                let teks = '*[ TAGALL ]*\n\n'
                teks += `${args}\n\n`
                for (let f of groupMems) {
                    teks += `- @${f.jid.split('@')[0]}\n`
                    mems_id.push(f.jid)
                }
                wa.mentions(from, teks, mems_id, msg)
            }
            break
            case 'h': case 'hidetag': case 'hide':{
                let mems_id = new Array()
                for (let f of groupMems) {
                    mems_id.push(f.jid)
                }
                ev.sendMessage(from, `${args}`, text, { contextInfo: { mentionedJid: mems_id }})
            }
            break
            case 'kontak': case 'vcard':{
                if (!body.includes('|')) return wa.reply(from, `How to: ${prefix}${command} 0|WhatsApp`, msg)
                let phone = arg.split('|')[0]
                let displayName = arg.split('|')[1] || null
                let vc = utils.vcard(phone, displayName)
                ev.sendMessage(from, { displayName, vcard: vc }, contact, { quoted: msg })
            }
            break
            case 'add': case '+':
                if (!isMeAdmin) return wa.reply(from, 'You\'re not admin.', msg)
                if (!quoted) {
                    if (args.length < 1) return wa.reply(from, `How to: ${prefix}${command} 123456789\nor ${prefix}${command} +1 (234) 567-8901`, msg)
                    const phone = args.join(' ').replace(/[^0-9]/g,'')
                    ev.sendMessage(from, `Sure add @${phone}, to this group.`, extendedText, { quoted: msg, contextInfo: { mentionedJid: [phone+'@s.whatsapp.net'] }})
                    .then(async () => {
                        const s = await ev.groupAdd(from, [phone+'@s.whatsapp.net'])
                        if (s[phone+'@c.us'] !== 200) return ev.sendMessage(from, `Can\'t add @${phone}, because they're turn on the private invite or they recently leave this group.`, text, { quoted: msg, contextInfo: { mentionedJid: [phone+'@s.whatsapp.net'] }})
                        else return wa.reply(from, 'Sucess adding them.', msg)
                    })
                } else {
                    const phone = quoted.participant
                    ev.sendMessage(from, `Sure add @${phone.split('@')[0]}, to this group`, extendedText, { quoted: msg, contextInfo: { mentionedJid: [phone] }})
                    .then(async () => {
                        const s = await ev.groupAdd(from, [phone])
                        if (s[phone.split('@')[0]+'@c.us'] !== 200) return wa.mentions(from, `Can\'t add @${phone.split('@')[0]}, because they're turn on the private invite or they recently leave this group.`, [phone], msg)
                        else return wa.reply(from, 'Sucess adding them.', msg)
                    })
                }
                break
            case 'kick': case 'remove':
                if (!isMeAdmin) return wa.reply(from, 'You\'re not admin.', msg)
                if (mentionedJid) {
                    const phone = mentionedJid[0]
                    if (phone === ev.user.jid) return wa.reply(from, 'Can\'t kick yourself and there is a risk, you will get banned.', msg)
                    ev.sendMessage(from, `Sure kick @${phone.split('@')[0]}, from this group.`, extendedText, { quoted: msg, contextInfo: { mentionedJid: [phone] }})
                    .then(async () => {
                        await ev.groupRemove(from, [phone])
                        wa.reply(from, 'Sucess kick them.', msg)
                    })
                } else if (quoted) {
                    const phone = quoted.participant
                    if (phone === ev.user.jid) return wa.reply(from, 'Can\'t kick yourself and there is a risk, you will get banned', msg)
                    ev.sendMessage(from, `Sure kick @${phone.split('@')[0]}, from this group.`, extendedText, { quoted: msg, contextInfo: { mentionedJid: [phone] }})
                    .then(async () => {
                        await ev.groupRemove(from, [phone])
                        wa.reply(from, 'Sucess kick them.', msg)
                    })
                } else {
                    wa.reply(from, `How to: ${prefix}${command} @user\nor you can just reply message of target with *${prefix}${command}*`, msg)
                }
                break
            case 'imgtourl': case 'uploadimg':
                if (isMedia && !msg.message.videoMessage || isQImg) {
                    const encmed = isQImg ? quoted : msg
                    const buffer = await ev.downloadMediaMessage(encmed, 'buffer')
                    const getUrl = await fetcher.uploadImages(buffer)
                    wa.reply(from, `Here a link to your image: ${getUrl}`, msg)
                } else {
                    wa.reply(from, 'Currently only support image uploading.', msg)
                }
                break
            case 'runtime': case 'uptime': case 'aktif':
                wa.reply(from, runtime(), msg)
                break
            case 'help': case 'menu':
                wa.reply(from, require('./teks/help').menu(prefix), msg)
                break
        }
    } catch(e) {
        console.log(e)
    }
})