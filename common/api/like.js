import request from '../request.js'

export function likeAdd(data) {
	return request.middleware({
		url: '/like',
		method: 'POST',
		data: data
	})
}

export function likeDelete(articleId) {
	return request.middleware({
		url: '/like/article/' + articleId,
		method: 'DELETE'
	})
}