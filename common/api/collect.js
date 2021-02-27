import request from '../request.js'

export function collectAdd(data) {
	return request.middleware({
		url: '/collect',
		method: 'POST',
		data: data
	})
}

export function collectDeleteByArticle(articleId) {
	return request.middleware({
		url: '/collect/article/' + articleId,
		method: 'DELETE'
	})
}

export function collectDelete(collectId) {
	return request.middleware({
		url: '/collect/' + collectId,
		method: 'DELETE'
	})
}

export function collectGet() {
	return request.middleware({
		url: '/collect',
		method: 'GET'
	})
}