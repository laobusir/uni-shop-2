<template>
	<view>
		<view class="goods-list">
			<view v-for="(item, index) in goodsList" :key="index" @click="gotoDetail(item)">
				<!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
				<my-goods :goods="item"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 定义请求对象参数
				queryObj: {
					// 查询关键词
					query: '',
					// 分类ID
					cid: '',
					// 页数索引
					pagenum: 1,
					// 每页显示的数据
					pagesize: 10
				},
				// 定义商品列表的数据
				goodsList: [],
				// 总数量，用来实现分页
				total: 0,
				// 节流阀
				isLoading: false
			};
		},
		onLoad(options) {
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''

			// 调用获取商品列表数据的方法
			this.getGoodsList()
		},
		methods: {
			// 定义获取商品列表数据的方法
			async getGoodsList(cb) {
				// 打开节流阀
				this.isLoading = true
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)

				// 关闭节流阀
				this.isLoading = false
				cb && cb()
				// 请求失败时
				if (res.meta.status !== 200) return uni.$showMsg()

				// 请求成功时 赋值数据
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
			},
			// 点击跳转到商品详情页
			gotoDetail(item) {
				uni.navigateTo({
					url: '../../subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			}
		},
		onReachBottom() {
			// 判断是否还有下一页数据
			if (this.goodsList.length >= this.total) return uni.$showMsg('数据加载完毕！')

			// 判断是否正在请求其它数据，如果是，则不发起额外的请求
			if (this.isLoading) return

			// 让页码值自增加1
			this.queryObj.pagenum++
			this.getGoodsList()
		},
		// 下拉刷新的事件
		onPullDownRefresh() {
			// 重置关键数据
			this.queryObj.pagenum = 1
			this.isLoading = false
			this.goodsList = []
			this.total = 0
			// 重新发起数据请求
			this.getGoodsList(() => uni.stopPullDownRefresh())
		},
	}
</script>

<style lang="scss">
</style>