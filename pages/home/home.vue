<template>
	<view>
		<!-- 搜索页面 -->
		<view class="search-box">
			<my-search @click="gotoSearch"></my-search>
		</view>

		<!-- 轮播图的区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="2000" :duration="1000" :circular="true">
			<swiper-item v-for="(item, index) in swiperList" :key="index">
				<navigator class="swiper-item" :url="'../../subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<img :src="item.image_src">
				</navigator>
			</swiper-item>
		</swiper>

		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item, index) in navList" :key="index" @click="navClickHandler(item)">
				<img :src="item.image_src" class="nav-img">
			</view>
		</view>

		<!-- 楼层区域 -->
		<view class="floor-list">
			<view class="floor-item" v-for="(item, index) in floorList" :key="index">
				<!-- 楼层的标题区域 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层的图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧的大盒子区域 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}"
							mode="widthFix">
						</image>
					</navigator>
					<!-- 右侧四个小盒子的区域 -->
					<view class="right-img-box">
						<navigator class="right-img-list" v-for="(item2, index2) in item.product_list.slice(1)" :key="index2"
							:url="item2.url">
							<image :src="item2.image_src" mode="widthFix" class="right-img-item"
								:style="{width: item2.image_width + 'rpx'}">
							</image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		$http
	} from '@escook/request-miniprogram';
	export default {
		data() {
			return {
				// 这是轮播图的数据列表
				swiperList: [],
				// 分类导航的数据列表
				navList: [],
				// 楼层区域的数据列表
				floorList: []
			};
		},
		onLoad() {
			// 调用方法获取轮播图数据
			this.getSwiperList()
			// 调用方法获取分类导航的数据列表
			this.getNavList(),
				// 调用方法获取楼层的数据列表
				this.getFloorList()
		},
		methods: {
			// 获取轮播图数据的方法
			async getSwiperList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/swiperdata')
				// console.log(res
				// 请求失败时
				if (res.meta.status !== 200) return uni.$showMsg()

				// 请求成功时
				this.swiperList = res.message
				uni.$showMsg('数据请求成功！')
			},

			// 获取分类导航的数据列表的方法
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/catitems')
				// 请求失败时
				if (res.meta.status !== 200) return uni.$showMsg()

				// 请求成功时
				this.navList = res.message
			},

			// 获取楼层数据列表的方法
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/floordata')
				// 请求失败时
				if (res.meta.status !== 200) return uni.$showMsg()

				// 请求成功时
				// 对数据进行处理
				res.message.forEach(floor => {
					floor.product_list.forEach(item => {
						item.url = '../../subpkg/goods_list/goods_list?' + item.navigator_url.split('?')[1]
					})
				})
				this.floorList = res.message
			},

			// 点击切换到分类页面的方法
			navClickHandler(item) {
				// 判断点击的是哪个 nav
				if (item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},

			// 跳转到搜索页面
			gotoSearch() {
				uni.navigateTo({
					url: '../../subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}

	.floor-title {
		height: 60rpx;
		width: 100%;
		display: flex;
	}

	.floor-img-box {
		display: flex;
		padding-left: 10rpx;
	}

	.right-img-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.search-box {
		// 实现吸顶的效果
		position: sticky;
		// 吸顶的位置 
		top: 0;
		z-index: 1;
	}
</style>