<template>
    <router-view :class="ClassName"/>
</template>
<script>
    export default {
        name: 'App',
        provide () {
            return {
                reload: this.reload
            }
        },
        data () {
            return {
                ClassName: 'clear_box',
                isRouterAlive: true,
                wxProgram: require('./assets/wx_program.jpg')
            }
        },
        methods: {
            reload: function () {
                this.isRouterAlive = false
                this.$nextTick(function () {
                    this.isRouterAlive = true
                })
            }
        },
        mounted () {
            this.$notify({
                title: '小程序码',
                dangerouslyUseHTMLString: true,
                duration: 5000,
                offset: 150,
                showClose: false,
                message: '<img src="' + this.wxProgram + '" width="150px" height="150px">'
            })
        }
    }
</script>

<style>
    .el-notification {
        width: 200px !important;
    }
    .el-notification__title{
        text-align: center !important;
    }
    .el-loading-mask {
        z-index: 2!important;
    }
    .clear_box{
        margin: 0 !important;
        padding: 0 !important;
        overflow-x: hidden !important;
    }
    body{
        margin: 0 !important;
        padding: 0 !important;
        overflow-x: hidden !important;
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
    #avatar .el-form-item__content {
        margin-left: 0!important;
    }
    .el-avatar>img {
        width: 100%;
    }
    .CodeMirror {
        border: 1px solid #eee;
        min-height: 300px;
        height: auto !important;
        z-index: 1;
    }
    .CodeMirror-scroll {
        height: auto;
        min-height: 500px;
        max-height: 1000px;
        overflow-y: hidden;
        overflow-x: auto;
    }
    .CodeMirror-hscrollbar{
        left: 0 !important;
        height:2px !important;
    }
   .el-card{
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
    }
    .menu {
        z-index:100;
        position: absolute;
        border-radius: 5px;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        border: 1px solid #393D49;
        color: #606266;
        background-color: #393D49;
    }
    #menu li:hover {
        background-color: #393D49;
        color: #ffd04b !important;
        cursor: pointer;
    }
    a:link{
        text-decoration: none;
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
</style>
