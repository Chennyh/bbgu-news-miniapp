<template>
	<view>
		<u-card :show-head="false" @click="click">
			<view slot="body">
				<text class="u-line-2">{{newItem.title}}</text>
			</view>
			<view slot="foot">
				<u-icon name="account" size="34" :label="newItem.username"></u-icon>
				<u-icon style="margin-left: 10rpx;" name="eye" size="34" :label="newItem.pageView + ' 浏览'"></u-icon>
				<u-icon style="margin-left: 10rpx;" name="chat" size="34" label="0 评论"></u-icon>
				<view style="float: right;">
					<u-icon name="calendar" size="34" :label="this.$u.timeFrom((new Date(newItem.createTime)).getTime())"></u-icon>
				</view>
			</view>
		</u-card>
	</view>
</template>

<script>
	export default {
		name: "NewsItem",
		props: {
			newItem: {
				type: Object,
				default: function(e) {
					return {}
				}
			}
		},
		methods: {
			click() {
				this.$emit('click');
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
