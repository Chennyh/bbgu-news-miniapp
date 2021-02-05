import request from '../request.js'

export function login(data) {
	return request.middleware({
		url: '/wx/login',
		method: 'POST',
		data: data
	})
}

export function update(data) {
	return request.middleware({
		url: '/wx',
		method: 'PUT',
		data: data
	})
}