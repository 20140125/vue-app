<template>
    <div>
        <waterfall align="center"
                   :line-gap="200"
                   :min-line-gap="100"
                   :max-line-gap="220"
                   :single-max-width="300"
                   @reflowed="reFlowed"
                   ref="waterfall"
                   :watch="fileListsPart">
            <waterfall-slot
                v-for="(item, index) in fileListsPart"
                :width="item.width || 100"
                :height="item.height || 100"
                :order="index"
                :key="index">
                <el-image fit="contain" :alt="item.name"  :src="item.href" :preview-src-list="[item.href]">
                    <div slot="placeholder" class="image-slot">
                        <span style="text-align: center">{{item.name}}</span>
                    </div>
                </el-image>
            </waterfall-slot>
        </waterfall>
    </div>
</template>

<script>
    import Waterfall from 'vue-waterfall/lib/waterfall'
    import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'
    export default {
        name: 'imageBed',
        components: {Waterfall, WaterfallSlot},
        props: {
            fileLists: {
                type: Array,
                default: () => []
            },
            pagination: {
                type: Object,
                default: () => {}
            },
            tabChange: {
                type: Boolean,
                default: () => false
            }
        },
        data () {
            return {
                fileListsPart: [],
                isBusy: false,
                id: 0
            }
        },
        created () {
            let __this = this
            document.body.addEventListener('click', function () {
                __this.shuffle()
            }, false)
        },
        watch: {
            fileLists: function () {
                this.getImageList()
            },
            tabChange: function () {
                this.fileListsPart = !this.tabChange ? this.fileListsPart : []
            }
        },
        methods: {
            /**
             * todo:图片列表
             */
            getImageList: function () {
                if (!this.isBusy && this.fileListsPart.length < this.pagination.total) {
                    this.isBusy = true
                    this.fileListsPart = this.fileListsPart.concat(this.fileLists)
                }
            },
            shuffle: function () {
                this.fileListsPart.sort(function () {
                    return Math.random() - 0.5
                })
            },
            reFlowed: function () {
                this.isBusy = false
            }
        }
    }
</script>

<style>
</style>
