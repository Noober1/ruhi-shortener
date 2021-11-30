const express = require('express');
const randomString = require('../lib/randomString');
const monk = require('monk');
const db = monk(process.env.MONGO_URI)
const urls = db.get('urls')
const schema = require('../lib/schema');
const router = express.Router();

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
		try {
			let permalink = ''
			if (!req.query.url) {
				throw new Error('URL tidak valid')
			}
			
			if (req?.query?.permalink) {
				const isPermalinkExist = await urls.findOne({
					permalink: req.query.permalink
				})
				if (isPermalinkExist) {
					throw new Error('Permalink sudah dipakai')
				}
				permalink = req.query.permalink
			} else {
				permalink = await generatePermalink()
			}
			
			const dataToInsert = await schema.validateAsync({
				url: req.query.url,
				permalink: permalink,
				dateCreated: new Date()
			})

			const inserting = await urls.insert(dataToInsert)
			return res.send(`Berhasil dibuat, url: ${process.env.BASE_URL}/${permalink}`)
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
