const chai = require('chai'),
	should = chai.should(),
	expect = chai.expect

chai.use(require('chai-as-promised'))
const chaiHttp = require('chai-http')
const sinon = require('sinon')

const dbcontroller = require('../../controllers/dbcontroller.js')
const s3controller = require('../../controllers/s3controller.js')

chai.use(chaiHttp)

describe('DB controller unit tests', () => {
	afterEach(() => {
		sinon.restore()
	})

	it('createAccount should create a user account', (done) => {
		const userStub = {
			result: null,
			formData: { username: 'test1', password: 'test1' },
		}

		const bcryptStub = sinon.stub(dbcontroller.bcrypt, 'hash').resolves('hi')

		const noneStub = sinon.stub(dbcontroller.db, 'none').resolves(userStub)

		dbcontroller
			.createAccount(userStub.formData)
			.then((res) => {
				res.should.be.a('object')
				res.result.should.equal(userStub)
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('userExists should return an existing user', (done) => {
		const userIdStub = { userid: 10 }

		const oneOrNoneStub = sinon
			.stub(dbcontroller.db, 'oneOrNone')
			.resolves(userIdStub)

		dbcontroller
			.userExists('test1')
			.then((res) => {
				res.should.be.a('object')
				res.should.equal(userIdStub)
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('deleteUser should delete a user', (done) => {
		const oneOrNoneStub = sinon
			.stub(dbcontroller.db, 'oneOrNone')
			.resolves(null)

		dbcontroller
			.deleteUser('fakeUser')
			.then((result) => {
				expect(result).to.be.a('null')
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('getCredentials should return username and password', (done) => {
		const userCredStub = {
			userid: 1,
			username: 'fakeUsername',
			password: 'fakePassword',
		}
		const oneOrNoneStub = sinon
			.stub(dbcontroller.db, 'oneOrNone')
			.resolves(userCredStub)

		dbcontroller
			.getCredentials()
			.then((res) => {
				res.should.be.a('object')
				res.should.equal(userCredStub)
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('authenticateUser should authenticate user', (done) => {
		const bcryptStub = sinon.stub(dbcontroller.bcrypt, 'compare').resolves(true)

		dbcontroller
			.authenticateUser('fakeUser', 'test')
			.then((res) => {
				res.should.be.a('object')
				res.result.should.be.a('boolean')
				res.result.should.equal(true)
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('authenticateUser should reject fake user', (done) => {
		const bcryptStub = sinon
			.stub(dbcontroller.bcrypt, 'compare')
			.resolves(false)

		dbcontroller
			.authenticateUser('fakeUser', 'wrongPassword')
			.then((res) => {
				res.should.be.a('object')
				res.result.should.be.a('boolean')
				res.result.should.equal(false)
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('addDoggo should add a doggo in the db', (done) => {
		const doggoData = {
			doggoName: 'test dog',
			description: 'test dog',
			imageUrl: 'test dog',
			userId: 53,
		}
		const noneStub = sinon.stub(dbcontroller.db, 'none').resolves(null)

		dbcontroller
			.addDoggo(doggoData)
			.then((res) => {
				expect(res).to.be.a('null')
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('getDoggo should return doggo data', (done) => {
		const doggoStub = {
			doggoname: 'stubbyBoi',
			description: 'stubby',
			imgUrl: 'http://www.stubby.boi',
		}
		const oneStub = sinon.stub(dbcontroller.db, 'one').resolves(doggoStub)

		dbcontroller
			.getDoggo('test dog')
			.then((doggo) => {
				doggo.should.be.a('object')
				doggo.should.equal(doggoStub)
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('updateDoggo should return updated doggo data', (done) => {
		let doggoId = ''
		const newDogName = 'test dog 2.0'
		const newDogDesc = 'updated test doggo'

		const doggoStub = { doggoId, newDogName, newDogDesc }

		const anyStub = sinon.stub(dbcontroller.db, 'any').resolves(doggoStub)

		dbcontroller
			.updateDoggo(doggoId, newDogName, newDogDesc)
			.then((res) => {
				res.should.equal(doggoStub)
				res.should.be.a('object')
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('deleteDoggo should delete doggo from db', (done) => {
		const noneStub = sinon.stub(dbcontroller.db, 'none').resolves(null)

		dbcontroller
			.deleteDoggo('stubbyDogToDelete')
			.then((res) => {
				expect(res).to.be.a('null')
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('likeDoggo should create a like entry in DB', (done) => {
		const dbData = {
			doggoid: 5,
			userid: 5,
			dateliked: '2020-03-15 20:46:55.72179',
		}
		const anyStub = sinon.stub(dbcontroller.db, 'any').resolves(dbData)

		dbcontroller
			.likeDoggo(5, 5)
			.then((res) => {
				expect(res).to.deep.equal(dbData)
				done()
			})
			.catch((err) => {
				console.log(err)
				expect(err).to.be.a('null')
			})
	})
})
