<template>
	<view class="wrap">
		<view class="title">
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
</template>

<script>
	import {
		Article
	} from "@/common/api/news.js"
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
				updateTime: ""
			}
		},
		onLoad(option) {
			uni.showLoading({
				title: "加载中..."
			})
			// console.log(option);
			Article(option.query).then(resp => {
				// console.log(resp);
				this.title = resp.data.title
				this.username = resp.data.username
				this.html = resp.data.context
				this.pageView = resp.data.pageView
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

		}
	}
</script>

<style scoped>
	.wrap {
		margin: 25rpx;
		display: flex;
		flex-direction: column;
	}

	.wrap .title {
		font-size: large;
		font-weight: bold;
		text-align: center;
		margin-bottom: 10rpx;
	}

	.wrap .info {
		margin: 10rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}

	.wrap .tags {
		margin-top: 10rpx;
		margin-bottom: 10rpx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-end;
	}
	.wrap .tags .tag{
		margin-left: 10rpx;
	}

	.wrap .content {
		margin: 10rpx;
		font-size: medium;
		text-indent: 50rpx;
		line-height: 1.5;
	}
</style>
