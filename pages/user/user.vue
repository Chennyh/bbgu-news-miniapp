<template>
	<view class="content">
		<view class="user">
			<u-avatar @click="avatarClick" class="avatar" :src="avatarUrl" size="large" />
			<view @click="onLogin" class="name">{{ nickName }}</view>
		</view>
		<u-gap height="10" bg-color="#f3f4f6" />
		<view class="collect">
			<view class="title">我的收藏</view>
			<u-empty :show="emptyShow" margin-top="100" iconSize="400" text="您还没有收藏的内容" src="/static/no-collection.png" />

			<!-- <scroll-view scroll-y="true" :style="{ height: scrollViewHeight + 'rpx' }">
				<view>1111</view>
				<view>2222</view>
			</scroll-view> -->

		</view>
		<u-top-tips ref="showTips" />
		<u-action-sheet @click="actionSheetClick" :tips="actionSheetTips" :list="actionSheetList" v-model="actionSheetShow"></u-action-sheet>
	</view>
</template>

<script>
	import {
		login,
		update
	} from "@/common/api/user.js"

	const defaultUserWxInfo = {
		code: "",
		encryptedData: "",
		rawData: "",
		signature: "",
		iv: ""
	}

	export default {
		data() {
			return {
				avatarUrl: '',
				nickName: '点击登录',
				emptyShow: true,
				userWxInfo: Object.assign({}, defaultUserWxInfo),
				tipsTitle: null,
				tipsType: null,
				actionSheetShow: false,
				actionSheetTips: {
					text: "请选择操作"
				},
				actionSheetList: [{
						text: "更新个人资料"
					},
					{
						text: "退出登录"
					}
				]
			}
		},
		onReady() {
			if (this.$store.state.vuex_user.is_login) {
				this.nickName = this.$store.state.vuex_user.nick_name
				this.avatarUrl = this.$store.state.vuex_user.avatar_url
			}
		},
		computed: {
			scrollViewHeight: function() {
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let winHeight = parseInt((sys.windowHeight - 100) * winrate)
				return winHeight
			}
		},
		methods: {
			avatarClick() {
				if (this.$store.state.vuex_user.is_login) {
					this.actionSheetShow = true
				} else {
					this.onLogin()
				}
			},
			async onLogin() {
				uni.showLoading({
					title: "登录中..."
				})

				let promise = new Promise((resolve, reject) => {
					uni.login({
						success: (res) => {
							// console.log(res);
							this.userWxInfo.code = res.code

							uni.getUserInfo({
								withCredentials: true,
								success: (res) => {
									// console.log(res);
									this.userWxInfo.encryptedData = res.encryptedData
									this.userWxInfo.rawData = res.rawData
									this.userWxInfo.signature = res.signature
									this.userWxInfo.iv = res.iv

									login(this.userWxInfo).then(resp => {
										// console.log(resp);
										this.tipsTitle = "登录成功！"
										this.tipsType = "success"
										this.avatarUrl = res.userInfo.avatarUrl
										this.nickName = res.userInfo.nickName

										this.$u.vuex("vuex_user.nick_name", this.nickName)
										this.$u.vuex("vuex_user.avatar_url", this.avatarUrl)
										this.$u.vuex("vuex_user.is_login", true)
										this.$u.vuex("vuex_token", "Bearer " + resp.data.token)

										resolve("done!")
									}).catch(err => {
										console.log(err);
										this.tipsTitle = "未知错误"
										this.tipsType = "error"
										resolve("done!")
									})
								},
								fail: () => {
									this.tipsTitle = "登录失败，请允许小程序获取用户信息！"
									this.tipsType = "error"
									resolve("done!")
								}
							})
						}
					})
				})

				let result = await promise;
				// console.log(result);

				uni.hideLoading()
				this.showTips()
				this.userWxInfo = Object.assign({}, defaultUserWxInfo)
			},
			async updateProfile() {
				uni.showLoading({
					title: "更新中..."
				})

				let promise = new Promise((resolve, reject) => {
					uni.getUserInfo({
						success: (res) => {
							// console.log(res);
							update(res.userInfo).then(resp => {
								console.log(resp);
								
								this.tipsTitle = "更新成功！"
								this.tipsType = "success"
								this.avatarUrl = res.userInfo.avatarUrl
								this.nickName = res.userInfo.nickName
								
								this.$u.vuex("vuex_user.nick_name", this.nickName)
								this.$u.vuex("vuex_user.avatar_url", this.avatarUrl)
								
								resolve("done!")
							}).catch(err => {
								console.log(err);
								this.tipsTitle = "未知错误"
								this.tipsType = "error"
								resolve("done!")
							})
						},
						fail: () => {
							this.tipsTitle = "更新失败"
							this.tipsType = "error"
							resolve("done!")
						}
					})
				})
				let result = await promise

				uni.hideLoading()
				this.showTips()
				this.userWxInfo = Object.assign({}, defaultUserWxInfo)
			},
			actionSheetClick(index) {
				if (index === 0) {
					this.updateProfile()
				} else if (index === 1) {
					this.$u.vuex("vuex_user.nick_name", '')
					this.$u.vuex("vuex_user.avatar_url", '')
					this.$u.vuex("vuex_user.is_login", false)
					this.$u.vuex("vuex_token", '')

					this.avatarUrl = ''
					this.nickName = "点击登录"
				}
			},
			showTips() {
				this.$refs.showTips.show({
					title: this.tipsTitle,
					type: this.tipsType,
					duration: '2000'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		display: flex;
		flex-direction: column;
	}

	.content .user {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.content .user .avatar {
		margin-top: 50rpx;
	}

	.content .user .name {
		margin-top: 10rpx;
		margin-bottom: 50rpx;
		font-size: medium;
		color: $u-content-color;
	}

	.content .collect {
		display: flex;
		flex-direction: column;
	}

	.content .collect .title {
		margin-top: 40rpx;
		margin-bottom: 20rpx;
		margin-left: 20rpx;
		padding-left: 10rpx;
		font-size: medium;
		font-weight: bold;
		border-left: 8rpx solid $u-type-primary;
	}
</style>
