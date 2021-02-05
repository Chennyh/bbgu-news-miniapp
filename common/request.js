import Request from './luch-request/index.js'
import baseUrl from './getBaseUrl.js'
import store from "@/store"

//创建实例
const service = new Request({
	baseURL: baseUrl
})

//request拦截器
service.interceptors.request.use(config => {
	// if(store.state.vuex_user.is_login){
		config.header['Authorization'] = store.state.vuex_token // 让每个请求携带自定义token 请根据实际情况自行修改
		// config.header = {
		// 	'Authorization': store.state.vuex_token // 让每个请求携带自定义token 请根据实际情况自行修改
		// }
	// }
	console.log(config);
	return config
}, error => {
	//请求出错执行
	console.log(error);
	return Promise.reject(error)
})

//response拦截器
service.interceptors.response.use(response => {
	const res = response.data
	if (res.code !== 200) {
		//返回码为非200处理错误
		console.log('err:' + res.message);

		//401 用户未登录
		if (res.code === 401) {
			console.log("用户未登录");
		}

		return Promise.reject(res)
	} else {
		return response.data
	}
}, error => {
	console.log('err:' + error);
	return Promise.reject(error)
})

export default service
