//设置bseUrl
let baseUrl = ''

if (process.env.NODE_ENV === 'development') {
	//测试环境
	baseUrl = "http://localhost:8080"
} else if (process.env.NODE_ENV === 'production') {
	//正式环境
	baseUrl = "https://api.chennyh.com"
}

export default baseUrl
