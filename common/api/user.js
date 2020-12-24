import request from '../request.js'

export function getUser(id) {
	return request.middleware({
		url: '/user/' + id,
		method: 'GET'
	})
}
