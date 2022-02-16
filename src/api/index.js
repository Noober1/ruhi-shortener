const express = require('express');
const randomString = require('../lib/randomString');
const monk = require('monk');
const db = monk(process.env.MONGO_URI)
const urls = db.get('urls')
const schema = require('../lib/schema');
const router = express.Router();
const QRCode = require('qrcode')

const generatePermalink = async() => {
	const generateString = randomString(7)
	const getData = await urls.findOne({
		permalink: generateString
	})
	if (getData) {
		generateString()
	} else {
		return generateString
	}
}

router.get('/', (req,res) => {
	return res.json({
		app:'shortener'
	})
})

router
	.route('/buat')
	.get(async(req,res,next) => {
		return res.render('buat')
	})
	.post(async(req,res,next) => {
		const {permalink, url} = req.body
		console.log('body', req.body)
		try {
			let generatedPermalink = ''
			if (typeof url == 'undefined') {
				throw new Error('URL tidak valid')
			}
			
			if (permalink) {
				const isPermalinkExist = await urls.findOne({
					permalink: permalink
				})
				if (isPermalinkExist) {
					throw new Error('Permalink sudah dipakai')
				}
				generatedPermalink = permalink
			} else {
				generatedPermalink = await generatePermalink()
			}
			
			const dataToInsert = await schema.validateAsync({
				url: url,
				permalink: generatedPermalink,
				dateCreated: new Date()
			})

			const inserting = await urls.insert(dataToInsert)

			const generateQR = await QRCode.toDataURL(generatedPermalink)

			// return res.send(`Berhasil dibuat, url: ${process.env.BASE_URL}/${generatedPermalink}, gambar = ${generateQR}`)
			return res.render('buat', {
				generated:true,
				url: `${process.env.BASE_URL}/${generatedPermalink}`,
				QRUrl: generateQR
			})
		} catch (error) {
			next(error)
		}
	})

router.get('/not-found', (req,res) => {
	return res.render('not-found')
})

router
	.route('/:permalink')
	.get(async(req,res,next) => {
		try {
			const getData = await urls.findOne({
				permalink: req.params.permalink
			})
			if (!getData) {
				return res.redirect('/not-found')
			}
			return res.redirect(getData.url)
		} catch (error) {
			next(error)
		}
	})

module.exports = router;
