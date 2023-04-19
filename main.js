// #ifndef VUE3
import Vue from 'vue'
import App from './App'

import store from 'store/store.js'

// 导入网络请求的包
import {
	$http
} from '@escook/request-miniprogram'

uni.$http = $http

// 配置请求的 根路径
$http.baseUrl = 'https://www.uinav.com'

// 封装弹出框的方法
uni.$showMsg = function(title = '数据请求失败！', duraction = 1500) {
	uni.showToast({
		title,
		duraction,
		icon: 'none'
	})
}

// 请求拦截器
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...'
	})
}

// 响应拦截器
$http.afterRequest = function(options) {
	uni.hideLoading()
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif