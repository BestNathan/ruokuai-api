const expect = require('chai').expect
const Ruokuai = require('../lib')

let username = 'a308719298',
	password = 'zhangdage',
	softid = '44215',
	softkey = 'e47cab98bcdc4bec952ec7a20d053f07',
	id = 'df6c9958-ccc9-4947-b3c9-c94295a43748'

describe('test ruokuai class', () => {
	it('should thorw Error without username or password', () => {
		try {
			new Ruokuai({})
		} catch (error) {
			expect(error.message).to.be.equal('username and password are required!')
		}
	})

	it('should return a ruokuai object with four properties', () => {
		let ruokuai = new Ruokuai({ username, password })
		expect(ruokuai).to.be.which.have.property('username')
		expect(ruokuai).to.be.which.have.property('password')
		expect(ruokuai).to.be.which.have.property('softid')
		expect(ruokuai).to.be.which.have.property('softkey')
	})

	it('should have new value of softOptions', () => {
		let ruokuai = new Ruokuai({ username, password })
		ruokuai.setSoftOption({ softid, softkey })
		expect(ruokuai.softid).to.be.equal(softid)
		expect(ruokuai.softkey).to.be.equal(softkey)
	})

	it('should fetch user info of four properties', done => {
		let ruokuai = new Ruokuai({ username, password })
		ruokuai
			.info()
			.then(data => {
				expect(data).to.be.have.property('Score')
				expect(data).to.be.have.property('HistoryScore')
				expect(data).to.be.have.property('TotalScore')
				expect(data).to.be.have.property('TotalTopic')
				done()
			})
			.catch(done)
	})

	it('should return content of image', done => {
		let path = __dirname + '/create.jpg'
		new Ruokuai({ username, password, softid, softkey })
			.create(path, '3040')
			.then(data => {
				expect(data).to.have.property('Result')
				expect(data).to.have.property('Id')
				expect(data.Result).to.be.equal('mss4')
				done()
			})
			.catch(done)
	})

	it('should thorw an Error if pass wrong image type', done => {
		let path = {}
		new Ruokuai({ username, password, softid, softkey }).create(path, '3040').catch(e => {
			expect(e.message).to.be.include('must be Buffer or path of image')
			done()
		})
	})

	it('should thorw an Error if pass wrong image path', done => {
		let path = 'haha'
		new Ruokuai({ username, password, softid, softkey }).create(path, '3040').catch(e => {
			expect(e).to.be.instanceof(Error)
			done()
		})
	})

	it('should report success', done => {
		new Ruokuai({ username, password, softid, softkey })
			.report(id)
			.then(data => {
				expect(data).to.have.property('Result')
				expect(data.Result).to.be.contain('报告成功')
				done()
			})
			.catch(done)
	})

	it('should test register', done => {
		Ruokuai.register('a308719298', 'qqqq1111', '308719298@qq.com')
			.then(data => {
				expect(data).to.be.an('object')
				done()
			})
			.catch(done)
	})
})
