<template>
	<view class="wrap">
		<view class="main">
			<view class="title u-line-2">
				{{ title }}
			</view>
			<view class="info">
				<u-icon name="account" :label="username" />
				<u-icon name="calendar" :label="updateTime" style="margin-left: 10rpx;" />
			</view>
			<view class="tags">
				<view v-for="(item, index) in tags" :key="index">
					<u-tag class="tag" size="mini" mode="plain" :text="item.name" type="success" shape="circle" />
				</view>
			</view>
			<view class="content">
				<mp-html :content="html" lazy-load="true" selectable="true" />
			</view>
		</view>
		<u-gap height="45" style="padding: 20rpx;" />
		<view class="footer u-border-top">
			<view class="icon">
				<u-icon index="comment" size="45" name="chat" @click="iconClick" />
				<view v-if="!isLike">
					<u-icon index="like" size="45" name="heart" @click="iconClick" />
				</view>
				<view v-else>
					<u-icon index="like" size="45" name="heart-fill" color="#ff115c" @click="iconClick" />
				</view>
				<view v-if="!isCollect">
					<u-icon index="collect" size="45" name="star" @click="iconClick" />
				</view>
				<view v-else>
					<u-icon index="collect" size="45" name="star-fill" color="#ffc105" @click="iconClick" />
				</view>
				<u-icon index="forward" size="45" name="zhuanfa" @click="iconClick" />
			</view>
		</view>
		<u-toast ref="toast" />
	</view>
</template>

<script>
	import {
		Article
	} from "@/common/api/news.js"
	import {
		collectAdd,
		collectDeleteByArticle
	} from "@/common/api/collect.js"
	import {
		likeAdd,
		likeDelete
	} from "@/common/api/like.js"
	import mpHtml from "@/components/mp-html/mp-html.vue"

	export default {
		components: {
			mpHtml
		},
		data() {
			return {
				title: "",
				username: "",
				html: "",
				tags: [],
				updateTime: "",
				articleId: -1,
				isCollect: false,
				isLike: false,
				toastTitle: null,
				toastType: "default"
			}
		},
		onLoad(option) {
			uni.showLoading({
				title: "加载中..."
			})
			// console.log(option);
			this.articleId = option.query
			Article(option.query).then(resp => {
				// console.log(resp);
				this.title = resp.data.title
				this.username = resp.data.username
				this.html = resp.data.context
				this.pageView = resp.data.pageView
				this.isCollect = resp.data.collect
				this.isLike = resp.data.like
				if (resp.data.tags !== null) {
					this.tags = resp.data.tags
				}
				this.updateTime = this.$u.timeFormat(resp.data.updateTime, 'yyyy-mm-dd hh:MM')

				uni.setNavigationBarTitle({
					title: this.title
				})
			})

		},
		onReady() {
			uni.hideLoading()
		},
		methods: {
			iconClick(index) {
				// console.log(index);
				if (index === "comment") {

				} else if (index === "like") {
					this.like()
					return
				} else if (index === "collect") {
					this.collect()
					return
				} else if (index === "forward") {

				}
				this.toastTitle = "未开发"
				this.toastType = "warning"
				this.showToast()
			},
			like() {
				if (!this.isLike) {
					likeAdd({
						"articleId": this.articleId
					}).then(resp => {
						this.isLike = true
					}).catch(err => {
						this.toastTitle = err.message
						this.toastType = "error"
						this.showToast()
					})
				} else {
					likeDelete(this.articleId).then(resp => {
						this.isLike = false
					}).catch(err => {
						this.toastTitle = err.message
						this.toastType = "error"
						this.showToast()
					})
				}
			},
			collect() {
				// console.log(this.articleId);
				if (!this.isCollect) {
					collectAdd({
						"articleId": this.articleId
					}).then(resp => {
						this.toastTitle = "收藏成功"
						this.toastType = "success"
						this.showToast()
						this.isCollect = true
					}).catch(err => {
						this.toastTitle = err.message
						this.toastType = "error"
						this.showToast()
					})
				} else {
					collectDeleteByArticle(this.articleId).then(resp => {
						this.toastTitle = "取消成功"
						this.toastType = "success"
						this.showToast()
						this.isCollect = false
					}).catch(err => {
						this.toastTitle = err.message
						this.toastType = "error"
						this.showToast()
					})
				}
			},
			showToast() {
				this.$refs.toast.show({
					title: this.toastTitle,
					type: this.toastType
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		margin: 25rpx;
		margin-bottom: 0;
		display: flex;
		flex-direction: column;
	}

	.wrap .main {
		flex: 1;
	}

	.wrap .main .title {
		font-size: large;
		font-weight: bold;
		text-align: center;
		margin-bottom: 10rpx;
	}

	.wrap .main .info {
		margin: 10rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}

	.wrap .main .tags {
		margin-top: 10rpx;
		margin-bottom: 10rpx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.wrap .main .tags .tag {
		margin-left: 10rpx;
	}

	.wrap .main .content {
		margin: 10rpx;
		font-size: medium;
		text-indent: 50rpx;
		line-height: 1.5;
	}

	.wrap .footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ffffff;
		padding: 20rpx;
	}

	.wrap .footer .icon {
		display: flex;
		justify-content: space-around;
	}
</style>
