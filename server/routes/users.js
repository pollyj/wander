const express = require('express')
const router = express.Router()
const path = require('path')
const func = require('./functions.js')

router.use('/', (req, res, next) => {
	if (req.session.user) {
		return next()
	}
	res.redirect('/')
})

router.use('/', express.static(path.join(__dirname, '../../client')))

// Serve home.html
router.get('/home', (req, res) => {
	res.sendFile(path.join(__dirname, '../../client/home.html'))
})

// my doggos page
router.get('/my-doggos', (req, res) => {
	res.sendFile(path.join(__dirname, '../../client/my-doggos.html'))
})

router.get('/load-my-doggos', func.loadMyDoggos)

// add doggos page
router.get('/add-doggos', (req, res) => {
	res.sendFile(path.join(__dirname, '../../client/add-doggos.html'))
})

router.post('/add-doggos/upload', func.getSignedUrl)

router.post('/add-doggos/db', func.addDogToDb)

router.delete('/delete-doggo', func.deleteDogFromDb)

router.put('/edit-doggo', func.updateDog)

router.post('/like-doggo', func.likeDog)
router.delete('/unlike-doggo', func.unlikeDog)

router.get('/check-like/:id', func.checkIfLiked)

module.exports = router
