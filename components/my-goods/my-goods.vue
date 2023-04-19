<template>
	<view class="goods-item">
		<!-- 左侧的盒子 -->
		<view class="goods-item-left">
			<radio :checked="goods.goods_state" color="#C00000" v-if="showRaido" @click="radioClickHandler"></radio>
			<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
		</view>
		<!-- 右侧的盒子 -->
		<view class="goods-item-right">
			<view class="goods-name">{{goods.goods_name}}</view>
			<view class="goods-info-box">
				<!-- 商品价格 -->
				<view class="goods-price">￥{{parseFloat(goods.goods_price).toFixed(2)}}</view>
				<!-- 商品数量 -->
				<uni-number-box :value="goods.goods_count" :min="1" v-if="showNum" @change="numChangeHandler"></uni-number-box>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-goods",
		// 定义 props 属性 用来接受外界传递到当前组件的数据
		props: {
			// 商品的信息对象
			goods: {
				type: Object,
				default: {}
			},
			showRaido: {
				type: Boolean,
				// 默认情况下不会展示radio组件
				default: false
			},
			showNum: {
				type: Boolean,
				// 默认情况下不会显示 uni-number-box 组件
				default: false
			}
		},
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		methods: {
			// 这是 radio 组件的 点击事件处理函数
			radioClickHandler() {
				this.$emit('radio-change', {
					goods_id: this.goods.goods_id,
					goods_state: !this.goods.goods_state
				})
			},

			// 监听到了 NumberBox 组件数量变化的事件
			// val 拿到当前 state 的最新值
			numChangeHandler(val) {
				// console.log(val);
				this.$emit('num-change', {
					goods_id: this.goods.goods_id,
					goods_count: +val // 无法保证 val 永远为数字 -0 将其转变为数字
				})
			}
		}
	}
</script>

<style lang="scss">
	.goods-item {
		// 让 goods-item 项占满整个屏幕的宽度
		width: 750rpx;
		// 设置盒模型为 border-box
		box-sizing: border-box;
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;

		.goods-item-left {
			margin-right: 5px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.goods-pic {
				display: block;
				width: 100px;
				height: 100px;
			}
		}

		.goods-item-right {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
			}

			.goods-info-box {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.goods-price {
					color: #C00000;
				}
			}
		}
	}
</style>