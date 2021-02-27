<template>
	<view class="content">
		<view class="user">
			<u-avatar @click="avatarClick" class="avatar" :src="avatarUrl" size="large" />
			<button plain="true" type="default" open-type="getUserInfo" class="name" @getuserinfo="avatarClick">{{ nickName }}</button>
		</view>
		<u-gap id="gap" height="10" bg-color="#f3f4f6" />
		<view class="collect">
			<view class="label">我的收藏</view>
			<u-empty :show="emptyShow" margin-top="100" iconSize="400" text="您还没有收藏的内容" src="/static/no-collection.png" />
			<scroll-view scroll-y enable-back-to-top :style="{'height': 'calc(100vh - ' + scrollHeight + 'rpx)'}">
				<u-swipe-action v-for="(item, index) in collectList" :key="item.id" :show="item.show" :index="index" :options="swiperOption"
				 @click="swiperClick" @open="swiperOpen" @content-click="swiperContentClick">
					<view class="item u-border-bottom">
						<text class="title u-line-2">{{ item.title }}</text>
						<view style="margin-top: 10rpx; display: flex;">
							<u-icon class="u-content-color" name="account" size="30" :label="item.username" />
							<text class="u-content-color" style="margin-left: 20rpx;">收藏于 </text>
							<u-icon class="u-content-color" name="calendar" size="30" :label="item.createTime" />
						</view>
					</view>
				</u-swipe-action>
			</scroll-view>
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
	import {
		collectGet,
		collectDelete
	} from "@/common/api/collect.js"

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
				],
				collectList: [],
				swiperOption: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				scrollHeight: 300
			}
		},
		watch: {
			collectList: function(newList, oldList) {
				if (newList.length > 0) {
					this.emptyShow = false
				} else {
					this.emptyShow = true
				}
			}
		},
		onReady() {
			if (this.$store.state.vuex_user.is_login) {
				this.nickName = this.$store.state.vuex_user.nick_name
				this.avatarUrl = this.$store.state.vuex_user.avatar_url
			}
			
			let _this = this;
			uni.getSystemInfo({
				success: (sys) => {
					let winHeight = parseInt(sys.windowHeight * sys.pixelRatio)
					let tabbarHeight = parseInt(sys.screenHeight - sys.windowHeight - sys.statusBarHeight) 
					// console.log(tabbarHeight);

					const query = uni.createSelectorQuery()
					query.select(".user").boundingClientRect()
					query.select(".label").boundingClientRect()
					query.select("#gap").boundingClientRect()
					query.exec(function(data) {
						let height = 0
						data.forEach(element => {
							height += element.height
						})
						height *= 2
						// _this.scrollHeight = (sys.windowHeight - tabbarHeight - height ) * sys.pixelRatio
						_this.scrollHeight = height
					})
				}
			})
		},
		onShow() {
			this.getCollectList()
		},
		methods: {
			avatarClick() {
				uni.getSetting({
					success: (result) => {
						// console.log(result);
						if (result.authSetting["scope.userInfo"]) {
							if (this.$store.state.vuex_user.is_login) {
								this.actionSheetShow = true
							} else {
								this.onLogin()
							}
						} else {
							this.tipsTitle = "请允许小程序获取用户信息！"
							this.tipsType = "error"
							this.showTips()
						}
					}
				})
			},
			async onLogin(isUpdate) {
				if (isUpdate === null) {
					isUpdate = false;
				}

				uni.showLoading({
					title: isUpdate ? "更新中..." : "登录中..."
				})

				let promise = new Promise((resolve, reject) => {
					if (!isUpdate) {
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
											this.getCollectList()

											this.$u.vuex("vuex_user.nick_name", this.nickName)
											this.$u.vuex("vuex_user.avatar_url", this.avatarUrl)
											this.$u.vuex("vuex_user.is_login", true)
											this.$u.vuex("vuex_token", "Bearer " + resp.data.token)

											resolve("done!")
										}).catch(err => {
											console.log(err);
											this.tipsTitle = "未知错误"
											this.tipsType = "error"
											reject(err)
										})
									},
									fail: (err) => {
										this.tipsTitle = "登录失败，请允许小程序获取用户信息！"
										this.tipsType = "error"
										reject(err)
									}
								})
							}
						})
					} else {
						uni.getUserInfo({
							success: (res) => {
								// console.log(res);
								update(res.userInfo).then(resp => {
									// console.log(resp);
									this.tipsTitle = "更新成功！"
									this.tipsType = "success"
									this.avatarUrl = res.userInfo.avatarUrl
									this.nickName = res.userInfo.nickName

									this.$u.vuex("vuex_user.nick_name", this.nickName)
									this.$u.vuex("vuex_user.avatar_url", this.avatarUrl)

									resolve("done!")
								}).catch(err => {
									console.log(err);
									this.tipsTitle = err.message
									this.tipsType = "error"
									reject(err)
								})
							},
							fail: (err) => {
								this.tipsTitle = "更新失败，请允许小程序获取用户信息！"
								this.tipsType = "error"
								reject(err)
							}
						})
					}
				})

				let result = await promise;
				// console.log(result);

				uni.hideLoading()
				this.showTips()
				this.userWxInfo = Object.assign({}, defaultUserWxInfo)
			},
			actionSheetClick(index) {
				if (index === 0) {
					this.onLogin(true)
				} else if (index === 1) {
					this.$u.vuex("vuex_user.nick_name", '')
					this.$u.vuex("vuex_user.avatar_url", '')
					this.$u.vuex("vuex_user.is_login", false)
					this.$u.vuex("vuex_token", '')

					this.collectList = []
					this.avatarUrl = ''
					this.nickName = "点击登录"

					this.tipsTitle = "已退出登录"
					this.tipsType = "info"
					this.showTips()
				}
			},
			swiperClick(index, optionIndex) {
				if (optionIndex == 0) {
					//删除收藏项
					collectDelete(this.collectList[index].id).then(resp => {
						this.collectList.splice(index, 1);
					})
				}
			},
			swiperOpen(index) {
				this.collectList[index].show = true;
				this.collectList.map((val, idx) => {
					if (index != idx) this.collectList[idx].show = false;
				})
			},
			swiperContentClick(index) {
				// console.log(index);
				uni.navigateTo({
					url: '/pages/detail/detail?query=' + this.collectList[index].articleId
				});
			},
			getCollectList() {
				collectGet().then(resp => {
					console.log(resp);
					this.collectList = resp.data
					this.collectList.forEach(element => {
						element.createTime = this.$u.timeFrom((new Date(element.createTime)).getTime())
					})

				}).catch(err => {

				})
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
		border: none;
	}

	.content .collect {
		display: flex;
		flex-direction: column;
	}

	.content .collect .label {
		margin-top: 40rpx;
		margin-bottom: 20rpx;
		margin-left: 20rpx;
		padding-left: 10rpx;
		font-size: medium;
		font-weight: bold;
		border-left: 8rpx solid $u-type-primary;
	}

	.content .collect .item {
		display: flex;
		flex-direction: column;
		padding: 10rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.content .collect .item .title {
		text-align: left;
		font-size: 30rpx;
		color: $u-main-color;
		margin-top: 10rpx;
	}
</style>
