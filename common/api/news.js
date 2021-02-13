import request from '../request.js'

export function ArticleList(categoryId) {
	return request.middleware({
		url: '/article/category/' + categoryId,
		method: 'GET'
	})
}

export function CategoryList() {
	return request.middleware({
		url: '/category/listAll',
		method: 'GET'
	})
}

export function Article(articleId) {
	return request.middleware({
		url: '/article/' + articleId,
		method: 'GET'
	})
}