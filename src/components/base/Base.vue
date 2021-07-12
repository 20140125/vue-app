<template>
    <el-container>
        <el-header>
            <!--Header头部 Start-->
            <Header @setLayout="setLayout" ref="header"></Header>
            <!--Header头部 End-->
        </el-header>
        <el-container>
            <!--导航栏 Start-->
            <Menu :aside-style="asideStyle" :is-collapse="isCollapse"></Menu>
            <!--导航栏 End-->
            <el-container direction="vertical">
                <el-main :style="mainStyle">
                    <!--站内通知 Start-->
                    <WebPush ref='webPush'></WebPush>
                    <!--站内通知 End-->
                    <!--详细内容 Start-->
                    <Content></Content>
                    <!--详细内容 End-->
                </el-main>
                <!--底部 Start-->
                <el-footer><el-link href="mailto:fl140125@gmail.com">fl140125@gmail.com</el-link></el-footer>
                <!--底部 End-->
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
import WebPush from '@/components/base/WebPush'
import Header from '@/components/base/Header'
import Menu from '@/components/base/Menu'
import Content from '@/components/base/Content'
export default {
    name: 'BaseLayout',
    components: { Content, Menu, Header, WebPush },
    data () {
        return {
            mainStyle: { margin: '60px 0 60px 200px', 'line-height': '35px'},
            asideStyle: { width: '200px', 'min-height': (window.innerHeight - 60) + 'px' },
            isCollapse: false
        }
    },
    methods: {
        /**
         * todo:设置布局
         * @param item
         * @param isCollapse
         */
        setLayout(item, isCollapse) {
            this.mainStyle = item.mainStyle
            this.asideStyle = item.asideStyle
            this.isCollapse = isCollapse
        }
    }
}
</script>

<style scoped>
.el-header {
    background-color: #393d49;
    color: #333;
    text-align: center;
    line-height: 60px;
    height: 64px;
    position: fixed;
    width: 100%;
    z-index: 2002
}
.el-footer {
    background-color: #cccccc;
    color: #333;
    text-align: center;
    line-height: 60px;
    /*固定底部布局*/
    position: fixed;
    width: 100%;
    height: 100%;
    bottom: 0;
    z-index: 2001
}
.el-aside {
    background-color: #393d49;
    color: #333;
    line-height: 200px;
    position: fixed;
    z-index: 2002;
    margin-top: 60px;
}
</style>
