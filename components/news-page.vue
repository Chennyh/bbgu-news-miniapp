<template>
	<view class="wrap">
		<scroll-view scroll-y enable-back-to-top refresher-enabled refresher-threshold="100" @refresherrefresh="onRefresher"
		 :refresher-triggered="triggered" :style="{'height':scrollH + 'rpx;'}">
			<view class="page-box">
				<u-empty :show="emptyShow" margin-top="150" iconSize="500" text="暂时还没有新闻哦~" src="/static/no-news.png" />
				<view class="new" v-for="(item, index) in articleList" :key="index">
					<news-item :newItem="item" @click="goDetail(item.id)" />
				</view>
			</view>
		</scroll-view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		ArticleList
	} from "@/common/api/news.js"
	import newsItem from "@/components/news-item.vue"

	export default {
		name: "NewsPage",
		props: {
			categoryId: {
				type: Number,
				default: 0
			}
		},
		components: {
			newsItem
		},
		computed: {
			scrollH: function() {
				let sys = uni.getSystemInfoSync();
				let winHeight = parseInt(sys.windowHeight * (750 / sys.windowWidth))
				let tabbarHeight = parseInt(sys.screenHeight - sys.windowHeight - sys.statusBarHeight)
				return winHeight - tabbarHeight + 10
			}
		},
		watch: {
			articleList: function(newList, oldList) {
				if (newList.length > 0) {
					this.emptyShow = false
				} else {
					this.emptyShow = true
				}
			}
		},
		data() {
			return {
				articleList: [],
				emptyShow: false,
				triggered: false,
				toastTitle: "无数据",
				toastType: "default"
			};
		},
		methods: {
			async loadData() {
				let promise = new Promise((resolve, reject) => {
					ArticleList(this.categoryId).then(resp => {
						// console.log(resp);
						let _articleList = resp.data.list
						let num = _articleList.length - this.articleList.length
						if (num > 0) {
							this.toastTitle = "更新了 " + num + " 条数据"
							this.toastType = "success"
						} else {
							this.toastTitle = "没有更新的新闻拉~"
							this.toastType = "primary"
						}
						this.articleList = _articleList
						resolve("done!")
					}).catch(err => {
						this.articleList = []
						resolve("done!")
					})
				})
				await promise
				console.log(this.articleList);
			},
			showToast() {
				this.$refs.uToast.show({
					title: this.toastTitle,
					type: this.toastType
				})
				this.toastType = "default"
				this.toastTitle = "无数据"
			},
			onRefresher() {
				if (this._freshing) return;
				this._freshing = true;
				this.triggered = true
				this.loadData().then(() => {
					this.triggered = false;
					this._freshing = false;
					this.showToast()
				})
			},
			goDetail(id) {
				// console.log(id);
				uni.navigateTo({
					url: '/pages/detail/detail?query=' + id
				});
			},
			refresh() {
				this.triggered = true;
			}
		}
	}
</script>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}
</style>
