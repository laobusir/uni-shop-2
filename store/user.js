export default {
	// 为当前模块开启命名空间
	namespaced: true,

	// 数据
	state: () => ({
		// 读取本地的收货地址数据，初始化 address 对象
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		// 登录成功之后的 token 字符串
		token: uni.getStorageSync('token') || '',
		// 用户的信息对象
		userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
		// 重定向的 Object 对象
		redirectInfo: null
	}),

	// 方法
	mutations: {
		// 更新收货地址
		updateAddress(state, address) {
			state.address = address

			//  通过 this.commit() 方法，调用 m_user 模块下的 saveAddressToStorage 方法将 address 对象持久化存储到本地
			this.commit('m_user/saveAddressToStorage')
		},

		// 持久化存储 address
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		},


		// 更新用户的基本信息
		updateUserInfo(state, userinfo) {
			state.userinfo = userinfo

			//  通过 this.commit() 方法，调用 m_user 模块下的 saveUserInfoToStorage 方法将 userinfo 对象持久化存储到本地
			this.commit('m_user/saveUserInfoToStorage')
		},

		// 持久化存储 userinfo
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
		},


		// 更新 token 字符串
		updateToken(state, token) {
			state.token = token

			//  通过 this.commit() 方法，调用 m_user 模块下的 saveTokenToStorage 方法将 token 持久化存储到本地
			this.commit('m_user/saveTokenToStorage')
		},

		// 持久化存储 token
		saveTokenToStorage(state) {
			uni.setStorageSync('token', state.token)
		},


		// 更新重定向的信息对象
		updateRedirection(state, info) {
			state.redirectInfo = info
			// console.log(state.redirectInfo);
		}
	},

	getters: {
		// 收货详细地址的计算属性
		addstr(state) {
			if (!state.address.provinceName) return ''
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		}
	}
}