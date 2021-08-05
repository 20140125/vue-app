<template>
    <router-view></router-view>
</template>

<script>

export default {
    name: 'App',
    data () {
        return {
            loading: true,
            throttle: 1500
        }
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                this.loading = false
            }, this.throttle)
        })
    }
}
</script>

<style lang="less">
body{
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    .el-overlay{
        background-color: rgba(0, 0, 0, 0.9);
    }
    .el-dialog {
        margin-top: 10vh;
        .el-dialog__header {
            background-color: #272822;
        }
        .el-dialog__title {
            color: #FFFFFF;
            font-size: 16px;
        }
        .el-dialog__body {
            .el-select {
                width: 100%;
            }
        }
        .el-date-editor--datetime {
            width: 100%;
        }
        .el-main {
            padding: 0 !important
        }
    }
    #app {
        .el-cascader {
            width: 100%;
        }
        .el-tabs__header{
            background-color: #FFFFFF;
        }
    }
    /* 滚动槽 */
    ::-webkit-scrollbar {
        -webkit-box-shadow:inset 0 0 5px rgb(255, 255, 255);
        opacity:0.3;
        width:5px;
    }
    /* 滚动槽 */
    ::-webkit-scrollbar-track {
        -webkit-box-shadow:inset 0 0 0 rgb(255, 255, 255);
        opacity:0.3;
        border-radius:1px;
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        border-radius:1px;
        background: #a7b2b8;
        opacity:0.3;
        -webkit-box-shadow:inset 0 0 0 #fff;
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb:window-inactive {
        background: #a7b2b8;
        opacity:0.3;
        border-radius:1px;
    }
}
</style>
