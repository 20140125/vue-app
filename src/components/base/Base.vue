<template>
  <el-container
    id="base"
    v-water-mark="{ text: username, textColor: 'rgba(0, 0, 0, .2)', font: '25px consolas, sans-serif', row: 130, col: 850 }">
    <el-header>
      <!--Header头部-->
      <Header ref="header" :layoutNums="layoutNums" @setLayout="setLayout"></Header>
    </el-header>
    <el-container>
      <el-container direction="vertical">
        <el-row :gutter="24">
          <el-col :span="layoutNums.aside" :style="layoutNums.style" class="el-aside">
            <!-- 导航栏 -->
            <Menu :is-collapse="isCollapse"></Menu>
          </el-col>
          <el-col :span="layoutNums.content" class="content">
            <!-- 站内通知 -->
            <WebPush></WebPush>
            <!-- 详细内容 -->
            <Content></Content>
            <!-- 返回顶部 -->
            <ToUp></ToUp>
          </el-col>
        </el-row>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import WebPush from '@/components/base/WebPush';
import Header from '@/components/base/Header';
import Menu from '@/components/base/Menu';
import Content from '@/components/base/Content';
import ToUp from '@/components/common/ToUp';
import URLS from '@/api/urls';
import { setTime } from '@/utils/func';

export default {
  name: 'BaseLayout',
  components: { ToUp, Content, Menu, Header, WebPush },
  data() {
    return {
      isCollapse: false,
      username: `${this.$store.state.baseLayout.username}【${(this.Permission || {}).local || URLS.baseURL}】${(this.Permission || {}).now_time || setTime(new Date())}`,
      layoutNums: {
        aside: 3,
        content: 21,
        style: { 'min-height': `${window.innerHeight > window.outerHeight ? (window.innerHeight - 130) : (window.outerHeight - 130)}px` }
      }
    };
  },
  methods: {
    /**
     * 设置布局
     * @param isCollapse
     */
    setLayout(isCollapse) {
      this.layoutNums = isCollapse ?
        {
          aside: 1,
          content: 23,
          style: { 'min-height': `${window.innerHeight > window.outerHeight ? (window.innerHeight - 130) : (window.outerHeight - 130)}px` }
        }
        : {
          aside: 3,
          content: 21,
          style: { 'min-height': `${window.innerHeight > window.outerHeight ? (window.innerHeight - 130) : (window.outerHeight - 130)}px` }
        };
      this.isCollapse = isCollapse;
    }
  }
};
</script>

<style lang="less">
#base {
  .el-header {
    background-color: #393d49;
    color: #333;
    text-align: center;
    line-height: 60px;
    height: 64px;
    position: fixed;
    width: 100%;
    z-index: 2002;
    box-shadow: 0 10px 10px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }

  .el-aside {
    margin-top: 60px;
    overflow: hidden;
    background-color: #393d49;
    padding: 0 !important;

    i {
      margin-right: 15px !important;
    }
  }

  .content {
    margin-top: 70px;
    margin-bottom: 40px !important;
  }

  .el-row {
    margin: 0 !important;
    padding: 0 !important
  }
}
</style>
