const fetch = require('node-fetch')
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const { fromBuffer } = require('file-type')

/**
 * Fetch Json from Url
 * 
 * @param {String} url 
 * @param {Object} options 
 */
const fetchJson = (url, options) =>
    new Promise((resolve,reject) => 
        fetch(url, options)
            .then(response => response.json())
            .then(json => resolve(json))
            .catch(err => {
                console.log(err)
                reject(err)
            })
    )

/**
 *Fetch Text from Url
 *  
 * @param {String} url 
 * @param {Object} options 
 */
const fetchText = (url, options) => {
    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then(response => response.text())
            .then(text => resolve(text))
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}

const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (e) {
		console.log(`Error : ${e}`)
	}
}

/**
 * Upload image to Telegra.ph server
 * @param {String} buffData image buffer
 */
const uploadImages = (buffData, type) => {
    return new Promise(async (resolve, reject) => {
        const { ext } = fromBuffer(buffData)
        const filePath = 'utils/temp.' + ext
        fs.writeFile(filePath, buffData, { encoding: 'base64' }, (err) => {
            if (err) return reject(err)
            console.log('Uploading image to Telegra.ph server...')
            const fileData = fs.readFileSync(filePath)
            const form = new FormData()
            form.append('file', fileData, 'tmp.' + ext)
            fetch('https://telegra.ph/upload', {
                method: 'POST',
                body: form
            })
            .then(res => res.json())
            .then(res => {
                if (res.error) return reject(res.error)
                resolve('https://telegra.ph' + res[0].src)
            })
            .then(() => fs.unlinkSync(filePath))
            .catch(err => reject(err))
        })
    })
}

module.exports = {
    fetchJson,
    fetchText,
    getBuffer,
    uploadImages
}