<template>
	<view class="my-container">
		<!-- 用户未登入时  显示登录组件 -->
		<my-login v-if="!token"></my-login>

		<!-- 用户已登录时  显示用户信息组件 -->
		<my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
	// 导入自己封装的mix模块
	import bagdeMix from '../../mixins/tabbar-badge.js'

	import {
		mapState
	} from 'vuex'
	export default {
		mixins: [bagdeMix],
		data() {
			return {

			};
		},
		computed: {
			// token 是用户登录成功之后的 token 字符串
			...mapState('m_user', ['token'])
		}
	}
</script>

<style lang="scss">
	page,
	.my-container {
		height: 100vh;
	}
</style>