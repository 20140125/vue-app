<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
    #app {
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
    .CodeMirror {
        border: 1px solid #eee;
        min-height: 300px;
        height: auto !important;
    }
    .CodeMirror-scroll {
        height: auto;
        min-height: 500px;
        max-height: 1000px;
        overflow-y: hidden;
        overflow-x: auto;
    }
    .menu__item {
        display: block;
        text-align: center;
        margin-top: 10px;
        margin-right: 33px;
    }
    .menu {
        padding-bottom: 10px;
        z-index:100;
        position: absolute;
        border-radius: 5px;
        border: 1px solid #393D49;
        color: #606266;
        background-color: #393D49;
    }
    #menu li:hover {
        background-color: #ffffff;
        color: #606266;
        cursor: pointer;
    }
    a:link{
        text-decoration: none;
    }
    .code .el-input__inner{
        background-color: #1b1e21 !important;
        color: #fff !important;
    }
    /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
        width:10px;
    }
    /* 滚动槽 */
    ::-webkit-scrollbar-track {
        -webkit-box-shadow:inset 0 0 6px rgb(245, 223, 210);
        border-radius:10px;
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        border-radius:10px;
        background: rgb(245,245,245);
        -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.5);
    }
    ::-webkit-scrollbar-thumb:window-inactive {
        background: rgb(245,245,245);
    }
</style>
