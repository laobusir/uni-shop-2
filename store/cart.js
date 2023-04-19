export default {
	// 为当前模块开启命名空间
	namespaced: true,

	// 模块的 state 数据
	state: () => ({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含如下 6 个属性：
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
	}),

	// 模块的 mutations 方法
	mutations: {
		addToCart(state, goods) {
			const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
			// console.log(findResult);

			if (!findResult) {
				state.cart.push(goods)
			} else {
				findResult.goods_count++
			}
			// console.log(state.cart);

			this.commit('m_cart/saveToStorage')
		},

		// 持久化存储购物车中商品的方法
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},

		// 更新购物车中商品的勾选状态
		updateGoodsState(state, goods) {
			const findResult = state.cart.find(item => item.goods_id === goods.goods_id)

			// 有对应的商品信息对象
			if (findResult) {
				// 更新对应商品的勾选状态
				findResult.goods_state = goods.goods_state
				// 持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},

		// 更新购物车中商品的数量
		updateGoodsCount(state, goods) {
			// 根据 goods_id 查询购物车中对应商品的信息对象
			const findResult = state.cart.find(item => item.goods_id === goods.goods_id)

			if (findResult) {
				// 更新对应商品的数量
				findResult.goods_count = goods.goods_count
				// 持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},

		// 根据 Id 从购物车中删除对应的商品信息
		removeGoodsById(state, goods_id) {
			// 调用数组的 filter 方法进行过滤
			state.cart = state.cart.filter(item => item.goods_id !== goods_id)
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		},

		// 更新所有商品的勾选状态
		updateAllGoodsState(state, newState) {
			state.cart.forEach(item => item.goods_state = newState)

			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		}
	},

	// 模块的 getters 属性
	getters: {
		// 购物车中所有商品的总数量
		total(state) {
			// let sum = 0
			// state.cart.forEach(item => sum += item.goods_count)
			// return sum
			return state.cart.reduce((total, item) => total += item.goods_count, 0)
		},

		// 勾选商品的总数量
		checkedCount(state) {
			// 先使用 filter 方法，从购物车中过滤器已勾选的商品
			// 再使用 reduce 方法，将已勾选的商品总数量进行累加
			// reduce() 的返回值就是已勾选的商品的总数量
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
		},

		// 勾选商品的总价格
		checkedGoodsAmount(state) {
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count * item.goods_price,
				0).toFixed(2)
		}
	},
}