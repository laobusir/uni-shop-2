<template>
	<view>
		<view class="scroll-view-container">
			<!-- 左侧滑动区 -->
			<scroll-view scroll-y="true" style="height: 100vh;" class="scroll-left-view">
				<block v-for="(item, index) in cateList" :key="index">
					<view :class="['scroll-left-view-item', index === active ? 'active' : '']" @click="activeChange(index)">
						{{item.cat_name}}
					</view>
				</block>
			</scroll-view>
			<!-- 右侧滑动区 -->
			<scroll-view scroll-y="true" style="height: 100vh;" :scroll-top="scroolTop">
				<view class="cate-lv2" v-for="(item2, index2) in cateLevel2" :key="index2">
					<view class="cate-lv2-title">
						/ {{item2.cat_name}} /
					</view>
					<!-- 动态渲染三级分类的列表数据 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="(item3, index3) in item2.children" :key="index3">
							<image :src="item3.cat_icon.replace('dev', 'web')" mode="widthFix" @click="gotoGoodsList(item3)"></image>
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 分类数据列表
				cateList: [],
				active: 0,
				// 二级分类的列表
				cateLevel2: [],
				// 滚动条距离顶部的距离
				scroolTop: 0
			};
		},
		onLoad() {
			// 调用方法获取分类列表的数据
			this.getCateList()
		},
		methods: {
			// 定义获取分类列表数据的方法
			async getCateList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories')
				// 请求失败时
				if (res.meta.status !== 200) return uni.$showMsg()

				// 请求成功时
				this.cateList = res.message
				// 为二级分类赋值
				this.cateLevel2 = res.message[0].children
			},

			activeChange(index) {
				this.active = index

				// 重新为二级分类赋值
				this.cateLevel2 = this.cateList[index].children
				// 让srollTop的值在0和1之间切换
				this.scroolTop = this.scroolTop === 0 ? 1 : 0
			},

			// 跳转到商品列表页面
			gotoGoodsList(item) {
				uni.navigateTo({
					url: '../../subpkg/goods_list/goods_list?cid=' + item.cat_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.scroll-left-view {
			width: 200px;

			.scroll-left-view-item {
				background-color: #f7f7f7;
				line-height: 60px;
				text-align: center;
				font-size: 12px;

				&.active {
					background-color: #FFFFFF;
					position: relative;

					&::before {
						content: '';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #C00000;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
		}

		.cate-lv2-title {
			font-size: 12px;
			font-weight: 700;
			text-align: center;
			padding: 15px 0;
		}

		.cate-lv3-list {
			display: flex;
			flex-wrap: wrap;

			.cate-lv3-item {
				width: 33.33%;
				margin-bottom: 10px;
				display: flex;
				flex-direction: column;
				align-items: center;

				image {
					width: 60px;
					height: 60px;
				}

				text {
					font-size: 12px;
				}
			}
		}
	}
</style>