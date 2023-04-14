<template>
	<view>
		<view class="search-box">
			<uni-search-bar @input="input" :radius="100" cancel-button="none"></uni-search-bar>
		</view>

		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item, index) in searchResults" :key="index" @click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>

		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clean"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item, index) in histories" :key="index" inverted="true"
					@click="gotoGoodsList(item)" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 定义防斗的延时器 timerId
				timer: null,
				// 定义搜索关键词
				kw: '',
				// 搜索结果列表
				searchResults: [],
				// 搜索历史的数组
				historyList: []
			}
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		methods: {
			// input 输入事件的处理函数
			input(e) {
				clearTimeout()
				this.timer = setTimeout(() => {
					// console.log(e);
					this.kw = e
					// 根据关键词查询搜索建议列表
					this.getSearchList()
				}, 1000)
			},

			// 定义根据搜索关键词 搜索商品建议列表
			async getSearchList() {
				// 判断关键词是否为空
				if (this.kw === '') {
					this.searchResults = []
					return
				}
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.kw
				})
				// 请求失败时
				if (res.meta.status !== 200) return uni.$showMsg()
				// console.log(res);
				// 请求成功时
				this.searchResults = res.message
				this.saveSearchHistory()
			},

			// 点击搜索建议的 Item 项，跳转到商品详情页面
			gotoDetail(goods_id) {
				// 指定详情页面的 URL 地址，并传递 goods_id 参数
				uni.navigateTo({
					url: '../../subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
			},

			saveSearchHistory() {
				// 解决关键词重复的问题方法一(不能解决重复元素更新问题)
				// if (this.historyList.includes(this.kw)) return
				// this.historyList.push(this.kw)

				// 解决关键词重复的问题方法二
				// 1. 将 Array 数组转化为 Set 对象
				const set = new Set(this.historyList)
				// 2. 调用 Set 对象的 delete 方法，移除对应的元素
				set.delete(this.kw)
				// 3. 调用 Set 对象的 add 方法，向 Set 中添加元素
				set.add(this.kw)
				// 4. 将 Set 对象转化为 Array 数组
				this.historyList = Array.from(set)

				// 对搜索历史数据 进行持久化存储
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},

			// 清空搜索历史记录
			clean() {
				this.historyList = []
				uni.setStorageSync('kw', '[]')
			},

			// 点击搜索历史跳转到商品列表页面
			gotoGoodsList(kw) {
				uni.navigateTo({
					url: '../../subpkg/goods_list/goods_list?query=' + kw
				})
			}
		},
		// 定义histories计算属性解决关键字前后顺序问题
		computed: {
			histories() {
				return [...this.historyList].reverse()
			}
		}
	}
</script>

<style lang="scss">
	.search-box {
		/* 吸顶效果 */
		position: sticky;
		top: 0;
		z-index: 1;
	}

	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.goods-name {
				// 文字不允许换行（单行文本）
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后，使用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
</style>