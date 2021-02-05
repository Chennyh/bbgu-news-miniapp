//设置bseUrl
let baseUrl = ''

if (process.env.NODE_ENV === 'development') {
	//测试环境
	baseUrl = "http://192.168.123.92:8080"
} else if (process.env.NODE_ENV === 'production') {
	//正式环境
	baseUrl = "http://api.chennyh.com"
}

export default baseUrl
