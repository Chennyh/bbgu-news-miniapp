<template>
	<view class="wrap" v-if="vuex_user.is_login">
		<view class="u-tabs-box">
			<u-tabs-swiper ref="uTabs" :list="tabsList" :current="tabCurrent" @change="tabChange()" />
		</view>
		<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="item in tabsList" :key="item.id">
				<news-page :categoryId="item.id" ref="page" />
			</swiper-item>
		</swiper>
	</view>
	<view v-else>
		<u-empty show="true" margin-top="100" iconSize="400" text="请登录后在查看哦~" src="/static/no-login.png" />
		<u-button class="login-btn" size="medium" ripple="true" @click="goLogin">去登录</u-button>
	</view>
</template>

<script>
	import {
		ArticleList,
		CategoryList
	} from "@/common/api/news.js"
	import newsPage from "@/components/news-page.vue"

	export default {
		components: {
			newsPage
		},
		data() {
			return {
				tabsList: null,
				articleList: [],
				tabCurrent: 0,
				swiperCurrent: 0,
				emptyShow: false
			}
		},
		onLoad() {
			if (this.$store.state.vuex_user.is_login) {
				this.getTabsList()
			}
			
		},
		onReady() {
			// if (this.$store.state.vuex_user.is_login) {
			// 	setTimeout(() => {
			// 		if(this.$refs.page[this.tabCurrent].articleList.length === 0){
			// 			this.$refs.page[this.tabCurrent].refresh()
			// 		}
			// 	}, 500)
			// }
		},
		onShow() {
			if (this.$store.state.vuex_user.is_login) {
				if (this.tabsList === null) {
					this.getTabsList()
				}
				setTimeout(() => {
					if (this.$refs.page[this.tabCurrent].articleList.length === 0) {
						this.$refs.page[this.tabCurrent].refresh()
					}
				}, 1000)
			}
		},
		methods: {
			getTabsList() {
				CategoryList().then(resp => {
					// console.log(resp);
					this.tabsList = resp.data
				}).catch(err => {
					// console.log(err);
				})
			},
			tabChange(index) {
				this.swiperCurrent = index
			},
			goLogin() {
				uni.switchTab({
					url: "/pages/user/user"
				})
			},
			transition({
				detail: {
					dx
				}
			}) {
				this.$refs.uTabs.setDx(dx);
			},
			animationfinish({
				detail: {
					current
				}
			}) {
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.tabCurrent = current;
				if (this.$refs.page[current].articleList.length === 0) {
					this.$refs.page[current].refresh()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}

	.login-btn {
		display: flex;
		flex-direction: column;
		margin-top: 30rpx;
	}
</style>
