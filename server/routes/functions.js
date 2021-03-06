const dbcontroller = require('../controllers/dbcontroller.js')
const s3controller = require('../controllers/s3controller.js')

const registerUser = async (req, res) => {
	const formData = {
		username: req.body.username,
		password: req.body.password,
	}

	try {
		const user = await dbcontroller.userExists(formData.username)

		if (user === null) {
			const response = await dbcontroller.createAccount(formData)
			res.status(200).send({ Success: `${formData.username} created` })
		} else {
			res.status(400).send({ Error: `${formData.username} already exists` })
		}
	} catch (error) {
		console.log({ error })
		res.status(error.code).send(`${error.name}: ${error.message}`)
	}
}

const signIn = async (req, res) => {
	const formData = {
		username: req.body.username,
		password: req.body.password,
	}

	try {
		const user = await dbcontroller.getCredentials(formData.username)
		const authenticated = await dbcontroller.authenticateUser(
			user,
			formData.password
		)

		if (authenticated.result === true) {
			createSession(req.session, authenticated.user)
			res
				.status(301)
				.send({ authenticated: true, user: authenticated.user.username })
		} else {
			res.status(400).send({ message: 'Invalid username or password' })
		}
	} catch (error) {
		console.log(error)
		res.status(error.code).send(`${error.name}: ${error.message}`)
	}
}

const createSession = (session, user) => {
	if (session) {
		session.user = {
			userId: user.userid,
			username: user.username,
		}
	}
}

const logOut = (req, res) => {
	if (req.session) {
		req.session.destroy((error) => {
			if (error) {
				next(error)
			} else {
				res.redirect('/')
			}
		})
	}
}

const loadAllDoggos = (req, res) => {
	dbcontroller
		.loadAll()
		.then((doggos) => {
			res.status(200).send({ doggos })
		})
		.catch((error) => {
			res.status(500).send({ error: error.message })
			console.log(error)
		})
}

const getSignedUrl = (req, res) => {
	const doggoImageType = req.body.doggoImageType
	const userId = req.session.user.userId

	s3controller
		.getUploadUrl(userId, doggoImageType)
		.then((url) => {
			res.status(200).send(url)
		})
		.catch((error) => {
			res.status(500).send({ error: error.message })
			console.log(error)
		})
}

const addDogToDb = (req, res) => {
	const dogData = {
		userId: req.session.user.userId,
		doggoName: req.body.doggoName,
		imageUrl: req.body.doggoImage,
		description: req.body.description,
		username: req.session.user.username,
	}

	dbcontroller
		.addDoggo(dogData)
		.then((result) => {
			res.status(200).send({ message: 'SUCCESS' })
		})
		.catch((error) => {
			res.status(500).send({ error: error.message })
			console.log(error)
		})
}

const loadMyDoggos = (req, res) => {
	let userId = req.session.user.userId

	dbcontroller
		.loadMyDoggos(userId)
		.then((doggos) => {
			res.status(200).send({ doggos })
		})
		.catch((error) => {
			res.status(500).send({ error: error.message })
			console.log(error)
		})
}

const deleteDogFromDb = async (req, res) => {
	const doggoName = req.body.doggoName
	let doggoId = ''

	try {
		const doggo = await dbcontroller.getDoggo(doggoName)
		doggoId = doggo.doggoid
		await s3controller.deleteImage(doggo.imageurl)
		await dbcontroller.deleteDoggo(doggoId)
		res.status(200).send({ 'Doggo deleted': `Doggo ID: ${doggoId}` })
	} catch (error) {
		console.log(error)
		res.status(error.code).send(`${error.name}: ${error.message}`)
	}

	// dbcontroller
	// 	.getDoggo(doggoName)
	// 	.then((doggo) => {
	// 		doggoId = doggo.doggoid
	// 		return s3controller.deleteImage(doggo.imageurl)
	// 	})
	// 	.then((response) => {
	// 		return dbcontroller.deleteDoggo(doggoId)
	// 	})
	// 	.then((result) => {
	// 		res.status(200).send({ 'Doggo deleted': `Doggo ID: ${doggoId}` })
	// 	})
	// 	.catch((error) => {
	// 		res.status(500).send({ error: error.message })
	// 		console.log(error)
	// 	})
}

const updateDog = async (req, res) => {
	const doggoData = {
		doggoName: req.body.doggoName,
		newDogName: req.body.newDogName,
		newDogDesc: req.body.newDogDesc,
	}

	let doggoId = ''

	try {
		const doggo = await dbcontroller.getDoggo(doggoData.doggoName)
		doggoId = doggo.doggoid
		const response = await dbcontroller.updateDoggo(
			doggoId,
			doggoData.newDogName,
			doggoData.newDogDesc
		)
		res.status(200).send(await response)
	} catch (error) {
		res.status(error.code).send(`${error.name}: ${error.message}`)
	}
}

const likeDog = async (req, res) => {
	const doggoId = req.body.doggoId
	const userId = req.session.user.userId

	try {
		const result = await dbcontroller.likeDoggo(userId, doggoId)
		res.status(200).send(result)
	} catch (error) {
		console.log({ error })
		res.status(error.code).send(`${error.name}: ${error.message}`)
	}
}

const unlikeDog = async (req, res) => {
	const doggoId = req.body.doggoId
	const userId = req.session.user.userId

	try {
		const result = await dbcontroller.unlikeDoggo(userId, doggoId)
		res.status(200).send(result)
	} catch (error) {
		console.log({ error })
		res.status(error.code).send(`${error.name}: ${error.message}`)
	}
}

const checkIfLiked = async (req, res) => {
	const userId = req.session.user.userId
	const doggoId = req.params.id

	try {
		const result = await dbcontroller.checkIfLiked(userId, doggoId)
		if (!result) {
			res.status(200).send(false)
		} else {
			res.status(200).send(true)
		}
	} catch (error) {
		console.log({ error })
		res.status(error.code).send(`${error.name}: ${error.message}`)
	}
}

module.exports = {
	registerUser,
	createSession,
	signIn,
	logOut,
	loadAllDoggos,
	getSignedUrl,
	addDogToDb,
	loadMyDoggos,
	deleteDogFromDb,
	updateDog,
	likeDog,
	unlikeDog,
	checkIfLiked,
	dbcontroller,
	s3controller,
}
