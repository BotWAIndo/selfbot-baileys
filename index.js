/**
 * Original creator: MhankBarBar
 * Rewrite from scratch: FaizBastomi
 * Lib creator: adiwajshing
 */
const {
    WAConnection,
    Mimetype,
    Presence,
    MessageType,
    GroupSettingChange,
    waMessageKey,
    Browsers
} = require('@adiwajshing/baileys')
const fs = require('fs')
const { color, processTime, sleep, getGroupAdmins, getRandom, hilih } = require('./utils/index')
const { fetchJson, getBuffer, fetchText, uploadImages } = require('./utils/fetcher')
const { custom, random } = require('./utils/meme')
const { exec, spawn } = require('child_process')
const translate = require('./utils/translate')
const moment = require('moment-timezone')
const ffmpeg = require('fluent-ffmpeg')
const fetch = require('node-fetch')
const figlet = require('figlet')
const lolcatjs = require('lolcatjs')
const phoneNum = require('awesome-phonenumber')
const { menuId } = require('./teks')

var prefix = '.'
var fake = '𝐒𝐄𝐋𝐅𝐁𝐎𝐓'
var numbernya = '0'
var readyAt = new Date().valueOf()
var ramadhan = new Date("2021","03","12").valueOf() //Don't remove this
let gambar64 = "" || fs.readFileSync('./media/images/9739.png')

function kyun() {
    const uptime = moment(Date.now() - readyAt).format("D [hari], H [jam], m [menit], s [detik]")
    return `- [ 𝙍𝙐𝙉𝙏𝙄𝙈𝙀 ] - \n${uptime}`
}

async function starts() {
    const client = new WAConnection()

    client.logger.level = 'warn'
    client.browserDescription=Browsers.macOS("Firefox")

    client.on('qr', () => {
        console.log('[', color('!', 'red') ,']', 'Please, scan the QR code!')
    })

    fs.existsSync('./Midnight.json') && client.loadAuthInfo('./Midnight.json')
    client.on('connecting', () => {
        console.log(color('Connecting to WhatsApp...', 'green'))
    })
    client.on('open', () => {
        console.log(color('Connected', 'green'))
        lolcatjs.fromString(figlet.textSync('Welcome', 'Larry 3D'))
    })
    await client.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./Midnight.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

    client.on('chat-update', async (mek) => {
        try {
            if (!mek.hasNewMessage) return
            mek = JSON.parse(JSON.stringify(mek)).messages[0]
            if (!mek.message) return
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            const content = JSON.stringify(mek.message)
            const from = mek.key.remoteJid
            const type = Object.keys(mek.message)[0]
            const { text, extendedText, liveLocation, contact, contactsArray, location, image, video, sticker, document, audio, product } = MessageType
            const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
            body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
            budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
            const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
            const arg = body.substring(body.indexOf(' ') + 1)
            const args = body.trim().split(/ +/).slice(1)
            const isCmd = body.startsWith(prefix)

            const botNumber = client.user.jid
            const ownerNumber = ["6285382618855@s.whatsapp.net"] // Replace with your number
            const isGroup = from.endsWith('@g.us')
            const sender = isGroup ? mek.participant : mek.key.remoteJid
            const sender1 = sender === undefined ? botNumber : sender
            const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
            const groupName = isGroup ? groupMetadata.subject : ''
            const groupId = isGroup ? groupMetadata.jid : ''
            const groupMembers = isGroup ? groupMetadata.participants : ''
            const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
            const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
            const isGroupAdmins = groupAdmins.includes(sender) || false
            const isOwner = ownerNumber.includes(sender)
            pushname2 = client.contacts[sender1] != undefined ? client.contacts[sender1].vname || client.contacts[sender1].notify : undefined
            const isUrl = (url) => {
                return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
            }
            const reply = (text) => {
                client.sendMessage(from, text, MessageType.text, {quoted:mek})
            }
            const sendMess = (jid, text) => {
                client.sendMessage(jid, text, MessageType.text)
            }
            const mentions = (teks, memberr, quoted=null) => {
                (quoted === null || quoted === undefined || quoted === false) ? client.sendMessage(from, teks, MessageType.extendedText, { contextInfo: { "mentionedJid": memberr } }) 
                : client.sendMessage(from, teks, MessageType.extendedText, { contextInfo: {"mentionedJid": memberr } })
            }

            const isMedia = (type === 'imageMessage' || type === 'videoMessage')
            const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
            const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
            const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
            if (!isGroup && !isCmd) console.log(color(`[${time}]`, 'yellow'), color("[ PRIVATE ]", "aqua"), 'message from', color(sender1.split("@")[0]))
            if (isGroup && !isCmd) console.log(color(`[${time}]`, 'yellow'), color('[ GROUP ]', 'aqua'), 'message from', color(sender1.split("@")[0]), 'in', color(groupName))
            if (!mek.key.fromMe && isGroup && isCmd) console.log(color(`[${time}]`, 'yellow'), color('[ GROUP ]', 'aqua'), 'message from', color(sender1.split("@")[0]), 'in', color(groupName))
            if (isGroup && isCmd) console.log(color(`[${time}]`, 'yellow'), color('[ EXEC ]'), 'from', color(sender1.split("@")[0]), 'in', color(groupName))
            if (!isGroup && isCmd) console.log(color(`[${time}]`, 'yellow'), color("[ EXEC ]"), 'from', color(sender1.split("@")[0]))
            
            if (mek.key.fromMe) {
                switch(command) {
                    case 'ping':
                        case 'speed':
                            reply(`Pong, *${processTime(mek.messageTimestamp, moment())} _Seconds_*`)
                            break
                    case 'help': {
                        const teks = {
                            text: menuId.Help(prefix, ramadhan),
                            contextInfo: {
                                participant: `0@s.whatsapp.net`,
                                remoteJid: "status@broadcast",
                                quotedMessage: {
                                    productMessage: {
                                        product: {
                                            currencyCode: "USD",
                                            description: fake,
                                            title: fake,
                                            priceAmount1000: "999999999",
                                            productImageCount: 1,
                                            productImage: {
                                                mimetype: "image/png",
                                                jpegThumbnail: gambar64
                                            }
                                        },
                                        businessOwnerJid: "0@s.whatsapp.net"
                                    }
                                }
                            }
                        }
                        client.sendMessage(from, teks, text)
                    }
                    break
                    case 'h':
                        case 'hidetag':
                        var value = args.join(" ")
                        var grup = await client.groupMetadata(from)
                        var member = grup['participants']
                        var mem = []
                        member.map( async adm => {
                            mem.push(adm.jid)
                        })
                        var options = {
                            text: value,
                            contextInfo: {
                                mentionedJid: mem
                            }
                        }
                        client.sendMessage(from, options, text)
                        break
                    case 'f':
                        var value = args.join(" ")
                        var options = {
                            text: value,
                            contextInfo: {
                                participant: '0@s.whatsapp.net',
                                remoteJid: 'status@broadcast',
                                isForwarded: true,
                                forwardingScore: 300,
                                quotedMessage: {
                                    documentMessage: {
                                        fileName: fake,
                                        jpegThumbnail: gambar64,
                                        mimetype: 'application/pdf',
                                        pageCount: 200
                                    }
                                }
                            }
                        }
                        client.sendMessage(from, options, text)
                        break
                    case '.':
                    let code = args.join(" ")
                try {

                if (!code) return client.reply(from, 'No JavaScript Code', id)
                let evaled;

                if (code.includes("--silent") && code.includes("--async")) {
                code = code.replace("--async", "").replace("--silent", "");

                return await eval(`(async () => { ${code} })()`)
                } else if (code.includes("--async")) {
                code = code.replace("--async", "");
        
                evaled = await eval(`(async () => { ${code} })()`);
                } else if (code.includes("--silent")) {
                code = code.replace("--silent", "");
        
                return await eval(code);
                } else evaled = await eval(code);

              if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled, { depth: 0 });
  
            let output = clean(evaled);
            var options = {
                contextInfo: {
                    participant: '0@s.whatsapp.net',
                    quotedMessage: {
                        extendedTextMessage: {
                            text: "𝐄𝐗𝐄𝐂𝐔𝐓𝐎𝐑"
                        }
                    }
                }
            }
            client.sendMessage(from, `${output}`, text, options)
            } catch(err) {
                outerr = clean(err)
                reply(`Error: ${outerr}`)
            }
            function clean(text) {
            if (typeof text === "string")
              return text
                .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                .replace(/@/g, `@${String.fromCharCode(8203)}`);
            // eslint-disable-line prefer-template
            else return text;
            }
            break
            case 'setprefix':
                if (args.length < 1) return
                prefix = args[0]
                reply(`*Prefix berhasil diubah ke ${prefix}*`)
                break
            case 'setnomor':
                if (args.length < 1) return
                numbernya = args[0]
                reply(`*Berhasil ubah nomor ke ${numbernya}*`)
                break
            case 'setpesan':
                if (args.length < 1) return
                fake = args.join(" ")
                reply(`*Berhasil mengubah pesan reply ke: ${fake}*`)
                break
            case 'runtime':
                teks = `${kyun()}`
                const rtime = {
                    contextInfo: {
                        participant: `${numbernya}@s.whatsapp.net`,
                        remoteJid: 'status@broadcast',
                        quotedMessage: {
                            extendedTextMessage: {
                                text: "-[ 𝙎𝙏𝘼𝙏𝙐𝙎 ]-"
                            }
                        }
                    }
                }
                client.sendMessage(from, `${teks}`, text, rtime)
                break
            case 'toimg':
                if ((isQuotedSticker && mek.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated === false)) {
                    encmedia = JSON.parse(JSON.stringify(mek).replace("quotedM","m")).message.extendedTextMessage.contextInfo
                    media = await client.downloadAndSaveMediaMessage(encmedia)
                    ran = getRandom('.png')
                    exec(`ffmpeg -i ${media} ${ran}`, (err) => {
                        fs.unlinkSync(media)
                        if (err) return reply('ada yang error')
                        buffer = fs.readFileSync(ran)
                        client.sendMessage(from, buffer, image, {quoted:mek, caption: "nih dah jadi"})
                        fs.unlinkSync(ran)
                    })
                } else if ((isQuotedSticker && mek.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated)) {
                    encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
                    media = await client.downloadAndSaveMediaMessage(encmedia)
                    ran = getRandom('.gif')
                    ranw = getRandom('.mp4')
                    spawn('./webp2gif', [
                        media,
                        ran
                    ]).on('error', (err) => {
                        reply(`Error: ${err}`).then(() => {
                            console.log(err)
                        })
                        fs.unlinkSync(media)
                    }).on('close', () => {
                        fs.unlinkSync(media)
                        exec(`ffmpeg -i ${ran} -pix_fmt yuv420p ${ranw}`, (err) => {
                            if (err) return reply('error')
                            client.sendMessage(from, fs.readFileSync(ranw), video, {quoted:mek, mimetype: 'video/gif'})
                            fs.unlinkSync(ran)
                            fs.unlinkSync(ranw)
                        })
                    })
                } else {
                    reply('reply stickernya bang')
                }
                break
                case 'stik':
                case 'stiker':
                case 'sticker':
                    if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
                        const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
                        const media = await client.downloadAndSaveMediaMessage(encmedia)
                        ran = getRandom('.webp')
                        await ffmpeg(`./${media}`)
                            .input(media)
                            .on('start', function (cmd) {
                                console.log(`Started : ${cmd}`)
                            })
                            .on('error', function (err) {
                                console.log(`Error : ${err}`)
                                fs.unlinkSync(media)
                                reply(mess.error.stick)
                            })
                            .on('end', function () {
                                console.log('Finish')
                                client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
                                fs.unlinkSync(media)
                                fs.unlinkSync(ran)
                            })
                            .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                            .toFormat('webp')
                            .save(ran)
						} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
                            const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
                            const media = await client.downloadAndSaveMediaMessage(encmedia)
                            ran = getRandom('.webp')
                            reply('bentar nyet')
                            await ffmpeg(`./${media}`)
                            .inputFormat(media.split('.')[1])
                            .on('start', function (cmd) {
                                console.log(`Started: ${cmd}`)
                            })
                            .on('error', function (err) {
                                console.log(`Error: ${err}`)
                                fs.unlinkSync(media)
                                tipe = media.endsWith('.mp4') ? 'video' : 'gif'
                                reply(`Gagal mengkonversi ${tipe} menjadi sticker`)
                            })
                            .on('end', function () {
                                console.log('Finish')
                                client.sendMessage(from, fs.readFileSync(ran), sticker, { quoted: mek })
                                fs.unlinkSync(media)
                                fs.unlinkSync(ran)
                            })
                            .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                            .toFormat('webp')
                            .save(ran)
                        } else {
                            reply('Tidak ada video/gif/gambar yang akan dijadikan stiker!\nMaksimal durasi video 11detik')
                        }
                break
                case 'meme':
                    reply('Bentar om, lagi nyari...')
                    var { author, title, postLink, url } = await random()
                    var buffer = await getBuffer(url)
                    var options = {
                        caption: '-[ 𝙈𝙀𝙈𝙀𝙂𝙀𝙉 ]-',
                        contextInfo: {
                            participant: `${numbernya}@s.whatsapp.net`,
                            quotedMessage: {
                                extendedTextMessage: {
                                    text: `*Author: ${author}*\n*Title: ${title}*\n*Link: ${postLink}*`
                                }
                            }
                        }
                    }
                    client.sendMessage(from, buffer, image, options)
                    break
                case 'memeimg':
                    case 'memeimage':
                            if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length > 0) {
                                const top = arg.split('|')[0]
                                const bottom = arg.split('|')[1]
                                const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace("quotedM","m")).message.extendedTextMessage.contextInfo : mek
                                const media = await client.downloadMediaMessage(encmedia, 'buffer')
                                const getUrl = await uploadImages(media, false)
                                const memeRes = await custom(getUrl, top, bottom)
                                client.sendMessage(from, memeRes, image, {quoted: mek, caption: 'dah jadi nih bang.'})
                            }
                            break
                case 'imgtourl':
                    if ((isMedia && !mek.videoMessage || isQuotedImage) && args.length == 0) {
                        reply('*Bentar...*')
                        const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace("quotedM","m")).message.extendedTextMessage.contextInfo : mek
                        const media = await client.downloadMediaMessage(encmedia, 'buffer')
                        const getUrl = await uploadImages(media, false)
                        sendMess(from, `${getUrl}`)
                    }
                    break
                case 'wait':
                    case 'whatnimek':
                        if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
                            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace("quotedM","m")).message.extendedTextMessage.contextInfo : mek
                            const media = await client.downloadMediaMessage(encmedia, 'buffer')
                            const img64 = `data:image/jpeg;base64,${media.toString('base64')}`
                            fetch('https://trace.moe/api/search', {
                                method: 'POST',
                                body: JSON.stringify({ image: img64 }),
                                headers: { "Content-Type": "application/json" }
                            })
                            .then(respon => respon.json())
                            .then(async (resolt) => {
                                if (resolt.docs && resolt.docs.length <= 0) {
                                    reply('Gak tau anime apaan!')
                                }
                                const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                                var teksnime = ''
                                if (similarity < 0.92) {
                                    teksnime += '*Saya memiliki keyakinan rendah dengan request ini*\n\n'
                                }
                                teksnime += `➸ *Title Japanese* : ${title}\n➸ *Title chinese* : ${title_chinese}\n➸ *Title Romaji* : ${title_romaji}\n➸ *Title English* : ${title_english}\n`
                                teksnime += `➸ *Ecchi* : ${is_adult}\n`
                                teksnime += `➸ *Eps* : ${episode.toString()}\n`
                                teksnime += `➸ *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                                var imek = `https://media.trace.moe/image/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`
                                var buffer = await getBuffer(imek)
                                
                                client.sendMessage(from, buffer, image, { quoted: mek, caption: teksnime })
                            })
                            .catch(err => console.log('[',color('!', 'red'),']', color(err, 'red')))
                        }
                        break
                case 'tga':
                    members_id = []
                    teks = args.join(" ")
                    teks += "\n\n"
                    for (let mem of groupMembers) {
                        teks += `# @${mem.jid.split("@")[0]}\n`
                        members_id.push(mem.jid)
                    }
                    mentions(teks, members_id)
                    break
                case 'tga2':
                    members_id = []
                    teks = "*Tagall v2*"
                    teks += "\n\n"
                    for (let mem of groupMembers) {
                        teks += `~> @${mem.jid.split("@")[0]}\n`
                        members_id.push(mem.jid)
                    }
                    client.sendMessage(from, teks, text, {quoted:mek, contextInfo: { "mentionedJid": members_id}})
                    break
                case 'tga3':
                    members_id = []
                    teks = "*Tagall v3*"
                    teks += "\n\n"
                    for (let mem of groupMembers) {
                        teks += `<#> https://wa.me/${mem.jid.split("@")[0]}\n`
                        members_id.push(mem.jid)
                    }
                    client.sendMessage(from, teks, text, {contextInfo: {"mentionedJid": members_id }})
                    break
                case 'setnick':
                    entah = args.join(" ")
                    client.updateProfileName(entah).then(() => {
                        reply(`Sukses mengubah ke ${entah}`)
                    }).catch((err) => { reply(`Error: ${err}`) })
                    break
                case 'setpict':
                    if ((isMedia && !mek.message.videoMessage || isQuotedImage)) {
                        const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
                        const media = await client.downloadMediaMessage(encmedia, 'buffer')
                        client.updateProfilePicture(botNumber, media).then(() => {
                            reply('Sukses update profile picture')
                        }).catch((err) => {
                            reply(`Error: ${err}`)
                        })
                    } else {
                        reply('bukan gambar')
                    }
                    break
                case 'del':
                    case 'delete':
                        if (args[0] === 'priv' || args[0] === 'private') {
                            memew = client.chats.array.filter(v => v.jid.endsWith("@s.whatsapp.net") || v.jid.endsWith("@c.us")).map(v => v.jid)
                            for (let ids of memew) client.modifyChat(ids, 'delete')
                            reply(`Sukses menghapus *${memew.length}* personal chat`)
                        } else {
                            reply("*Masukan type chat yang ingin dibersihkan*\n1. private -> Personal Chat")
                        }
                        break
                case 'hilih':
                    entah = args.join(" ")
                    imni = hilih(entah)
                    reply(imni)
                    break
                case 'grup':
                    case 'group':
                        if (!isGroup) return
                        if (args.length == 0) return reply('Masukan parameter _<setting>_ | _<yes/no>_')
                        if (arg.split("|")[0] === 'pesan' && arg.split('|')[1] === 'yes') {
                            client.groupSettingChange(from, GroupSettingChange.messageSend, true)
                            reply('*Berhasil*')
                        } else if ((arg.split("|")[0] === 'egrup' || arg.split("|")[0] === 'egroup') && arg.split('|')[1] === 'yes') {
                            client.groupSettingChange(from, GroupSettingChange.settingsChange, true)
                            reply('*Berhasil*')
                        } else if (arg.split("|")[0] === 'pesan' && arg.split('|')[1] === 'no') {
                            client.groupSettingChange(from, GroupSettingChange.messageSend, false)
                            reply('*Berhasil*')
                        } else if ((arg.split("|")[0] === 'egrup' || arg.split("|")[0] === 'egroup') && arg.split('|')[1] === 'no') {
                            client.groupSettingChange(from, GroupSettingChange.settingsChange, false)
                            reply('*Berhasil*')
                        } else {
                            reply('_*Parameter Setting*_\n1. pesan\n2. egrup')
                        }
                        break
                case 'kontag':
                    entah = args[0]
                    if (isNaN(entah)) return reply('Invalid phone number');
                    members_ids = []
                    for (let mem of groupMembers) {
                        members_ids.push(mem.jid)
                    }
                    vcard = 'BEGIN:VCARD\n'
                              + 'VERSION:3.0\n'
                              + 'FN:Kontag Boss\n'
                              + `TEL;type=CELL;type=VOICE;waid=${entah}:${phoneNum('+' + entah).getNumber('internasional')}\n`
                              + 'END:VCARD'.trim()
                        client.sendMessage(from, {displayName: 'Kontag', vcard: vcard}, contact, {contextInfo: {"mentionedJid": members_ids}})
                        break
                case 'kontak':
                    entah = args[0]
                    disname = args[1]
                    if (isNaN(entah)) return reply('Invalid phone number'.toUpperCase());
                    vcard = 'BEGIN:VCARD\n'
                              + 'VERSION:3.0\n'
                              + `FN:${disname}\n`
                              + `TEL;type=CELL;type=VOICE;waid=${entah}:${phoneNum('+' + entah).getNumber('internasional')}\n`
                              + 'END:VCARD'.trim()
                        client.sendMessage(from, {displayName: disname, vcard: vcard}, contact)
                        break
                case 'tr':
                        if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) {
                            tolang = args[0]
                            entah = body.slice(3+args[0].length+1)
                            translate(entah, tolang)
                            .then((res) => { reply(`${res}`) })
                        } else {
                            tolang = args[0]
                            entah = mek.message.extendedTextMessage.contextInfo.quotedMessage.conversation
                            translate(entah, tolang)
                            .then((res) => { reply(`${res}`) })
                        }
                        break
                case 'tomp3':
                    if ((isMedia && mek.message.videoMessage.seconds <= 30 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds <= 30)) {
                        const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
                        const media = await client.downloadAndSaveMediaMessage(encmedia, "video")
                        exec(`ffmpeg -y -i ${media} -b:a 192K -ar 44100 -vn -f mp3 tomp3.mp3`, function(err) {
                            fs.unlinkSync(media)
                            if (err) return reply("error om")
                            client.sendMessage(from, fs.readFileSync('./tomp3.mp3'), audio, {mimetype: 'audio/ogg', quoted: mek})
                            fs.unlinkSync('./tomp3.mp3')
                        })
                    }
                    break
            default:
                }
            }
        } catch(err) {
            console.log('[',color('!', 'red'),']', color(err, 'red'))
        }
    })
}

starts()
