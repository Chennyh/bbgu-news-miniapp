import Request from './luch-request/index.js'
import baseUrl from './getBaseUrl.js'
import store from "@/store"

//创建实例
const service = new Request({
	baseURL: baseUrl
})

//request拦截器
service.interceptors.request.use(config => {
	if (store.state.vuex_user.is_login) {
		config.header['Authorization'] = store.state.vuex_token // 让每个请求携带自定义token 请根据实际情况自行修改
	}
	// console.log(config);
	return config
}, error => {
	//请求出错执行
	console.log(error);
	return Promise.reject(error)
})

service.interceptors.response.use(async (response) => {
	const res = response.data
	if (res.code !== 200) {
		//返回码为非200处理错误
		console.log('err:' + res.message);
		// uni.showToast({
		// 	title: res.message,
		// 	icon: "none"
		// })

		//401 用户未登录
		if (res.code === 401) {
			if (store.state.vuex_user.is_login) {
				//toekn过期处理 , TODO:添加无感刷新功能
				console.log("toekn过期");
				uni.showToast({
					title: "token已过期，请重新登录！",
					icon: "none"
				})
			} else {
				console.log("用户未登录");
				uni.showToast({
					title: "用户未登录，请先登录！",
					icon: "none"
				})
			}
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
