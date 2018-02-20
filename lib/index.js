'use strict'
const FormData = require('form-data')
const axios = require('axios')
const fs = require('fs')
const qs = require('querystring')

const baseUrl = 'http://api.ruokuai.com/'
const urls = {
	create: `${baseUrl}create.json`,
	info: `${baseUrl}info.json`,
	report: `${baseUrl}reporterror.json`,
	register: `${baseUrl}register.json`
}

module.exports = class Ruokuai {
	constructor({ username = '', password = '', softid = '1', softkey = 'b40ffbee5c1cf4e38028c197eb2fc751' }) {
		if (!username || !password) {
			throw new Error('username and password are required!')
		}

		this.username = username
		this.password = password
		this.softid = softid
		this.softkey = softkey
	}
	setSoftOption({ softid = '1', softkey = 'b40ffbee5c1cf4e38028c197eb2fc751' }) {
		this.softid = softid
		this.softkey = softkey
	}
	_request(url, form) {
		return axios
			.post(url, form, {
				headers: form.getHeaders()
			})
			.then(res => res.data)
	}
	info() {
		let form = new FormData()
		form.append('username', this.username)
		form.append('password', this.password)
		return this._request(urls.info, form)
	}
	create(image, type) {
		return new Promise((resolve, reject) => {
			if (!Buffer.isBuffer(image) && typeof image !== 'string') {
				reject(new Error('image must be Buffer or path of image'))
			}

			if (typeof image === 'string') {
				try {
					image = fs.readFileSync(image)
				} catch (e) {
					reject(e)
				}
			}

			let form = new FormData()
			form.append('username', this.username)
			form.append('password', this.password)
			form.append('typeid', type)
			form.append('timeout', '90')
			form.append('softid', this.softid)
			form.append('softkey', this.softkey)
			form.append('image', image, {
				filename: '1.jpg',
				contentType: 'application/octet-stream'
			})
			this._request(urls.create, form)
				.then(data => {
					if (data.Error) {
						reject(new Error(data.Error))
					} else if (data.Result) {
						resolve(data)
					} else {
						reject(new Error('Unknown Error'))
					}
				})
				.catch(e => reject(e))
		})
	}
	report(id) {
		let form = new FormData()
		form.append('username', this.username)
		form.append('password', this.password)
		form.append('softid', this.softid)
		form.append('softkey', this.softkey)
		form.append('id', id)
		return this._request(urls.report, form)
	}
	static register(username, password, email) {
		return axios.post(urls.register, qs.stringify({ username, password, email })).then(res => res.data)
	}
}
