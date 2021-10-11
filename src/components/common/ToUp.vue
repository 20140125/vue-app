<template>
    <el-button icon="el-icon-caret-top" id="toUp" v-if="ToUpBtn" @click="toUp" round size="mini" type="primary">{{ buttonValue }}</el-button>
</template>

<script>

export default {
    name: 'ToUp',
    props: {
        /* 按钮名称 */
        buttonValue: {
            type: String,
            default: () => 'UP'
        },
        /* 上升配速 */
        speed: {
            type: Number,
            default: () => 8.888
        },
        /* 按钮展示时机 */
        showTimes: {
            type: Number,
            default: () => 500
        },
        /* 定时器时间 */
        interval: {
            type: Number,
            default: () => 50
        }
    },
    data() {
        return {
            ToUpBtn: false
        };
    },
    created() {
        this.$nextTick(() => {
            window.addEventListener('scroll', () => {
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                this.ToUpBtn = scrollTop >= this.showTimes;
            });
        });
    },
    methods: {
        /**
         * todo:返回顶部
         */
        toUp() {
            /* 每次开启定时器都重新计算速度 */
            let timer = setInterval(() => {
                /* 获取滚动条的滚动高度 */
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                /* 用于设置速度差，产生缓动的效果 */
                let speed = Math.floor(-scrollTop / this.speed);
                /* 用纯数字赋值 */
                document.documentElement.scrollTop = document.body.scrollTop = scrollTop + speed;
                if (scrollTop === 0) {
                    clearInterval(timer);
                }
            }, this.interval);
        }
    }
};
</script>

<style lang="less">
#toUp {
    box-shadow: 0 2px 5px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    text-align: center;
    line-height: 20px;
    border-radius: 30px;
    position: fixed;
    bottom: 90px;
    right: 15px;
    z-index: 2004
}
</style>
