<template>
    <div class="emotion">
        <div class="emotion-box" :style="{height: height + 'px' }">
            <el-tabs type="border-card" tab-position="top" @tab-click="changeEmotionLists" v-model="type" v-infinite-scroll="scrollEmotion">
                <el-tab-pane v-for="(emotionType,index) in emotionTypeLists" :name="emotionType.type" :key="index" :label="emotionType.title">
                    <div class="emotion-box-line" v-for="(emotion, index) in emotionList" :key="index">
                        <div class="emotion-item" >
                            <el-image :src="emotion.icon" :alt="emotion.title" style="width: 30px;height: 30px;" lazy @click.native="clickHandler(emotion)"></el-image>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import apiLists from '../../api/api'
    export default {
        props: {
            height: {
                type: Number,
                default: () => 300
            }
        },
        data () {
            return {
                emotionTypeLists: [
                    {'type': '1', 'title': '表情', 'id': 'emotion'},
                    {'type': '2', 'title': '人物', 'id': 'person'},
                    {'type': '3', 'title': '动作', 'id': 'action'},
                    {'type': '4', 'title': '家庭', 'id': 'family'},
                    {'type': '5', 'title': '自然', 'id': 'natural'},
                    {'type': '6', 'title': '食物', 'id': 'food'},
                    {'type': '7', 'title': '体育', 'id': 'sport'},
                    {'type': '8', 'title': '建筑', 'id': 'building'},
                    {'type': '9', 'title': '用品', 'id': 'supplies'},
                    {'type': '10', 'title': '符号', 'id': 'symbol'},
                    {'type': '11', 'title': '国旗', 'id': 'flag'}
                ],
                type: '1',
                emotionList: [],
                limit: 55,
                page: 1,
                pages: 0,
                offsetPage: 0
            }
        },
        methods: {
            /**
             * todo:图标切换
             * @param typeObj
             */
            changeEmotionLists: function (typeObj) {
                this.type = typeObj.name
                this.page = 1
                this.emotionList = []
                this.showEmotionLists(this.page, this.limit)
            },
            /**
             * todo:点击图标
             * @param emotion
             */
            clickHandler (emotion) {
                this.$emit('clickEmotion', emotion)
            },
            /**
             * TODO:展示表情数据
             * @param page
             * @param limit
             */
            showEmotionLists: function (page, limit) {
                apiLists.EmotionLists({type: this.type, limit: limit, page: page}).then(response => {
                    this.pages = response.data.item.pages
                    let data = response.data.item.data
                    for (let i in data) {
                        this.emotionList.push(data[i])
                    }
                })
            },
            /**
             * TODO:数据流加载
             */
            scrollEmotion: function () {
                this.offsetPage = this.offsetPage + 1
                if (this.offsetPage <= this.pages) {
                    this.page++
                    this.showEmotionLists(this.page, this.limit)
                }
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.showEmotionLists(this.page, this.limit)
            })
        }
    }
</script>
<style scoped>
    .emotion{
        position: absolute;
        bottom: 310px;
        width: 500px;
        /*left: 300px;*/
    }
    .emotion-box {
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
        padding: 0 0 5px 10px;
        overflow-x: hidden;
        overflow-y: auto;
        position: initial;
        z-index:2000
    }
    .emotion-box-line {
        display: flex;
        float: left;
    }
    .emotion-item {
        flex: 1;
        margin-left: 13px;
        margin-top: 10px;
        cursor: pointer;
    }
</style>
