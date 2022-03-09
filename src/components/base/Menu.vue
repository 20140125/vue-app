<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <el-skeleton-item
        v-for="item in 5"
        :key="item"
        :style="`width: ${(item + 1) * Math.random() * 100 | 0}%`"
        class="template" variant="text">
      </el-skeleton-item>
    </template>
    <template #default>
      <el-menu
        :active-text-color="activeColor" :collapse="isCollapse"
        background-color="#393d49"
        text-color="#fff"
        unique-opened>
        <el-submenu v-for="(menu,index) in menuLists" :key="index" :index="menu.id.toString()">
          <template #title>
            <i class="el-icon-monitor"></i>
            <span v-html="menu.name"></span>
          </template>
          <el-menu-item
            v-for="(child,index) in menu.__children"
            :key="index"
            :index="child.id.toString()"
            @click="goto(child)">
            <template #title>
              <i class="el-icon-s-home"></i>
              <span v-html="child.name"></span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </template>
  </el-skeleton>
</template>

<script>
export default {
  name: 'Menu',
  props: ['isCollapse'],
  computed: {
    menuLists() {
      return this.$store.state.home.menuLists;
    }
  },
  data() {
    return {
      loading: true,
      activeColor: this.$store.getters.activeColor
    };
  },
  mounted() {
    this.$nextTick(async () => {
      if (this.$store.state.baseLayout.token) {
        await this.$store.dispatch('home/getMenu');
        setTimeout(() => {
          this.loading = false;
        }, Math.random() * 1000 | 0);
      }
    });
  },
  methods: {
    /**
     * todo:窗口切换
     * @param item
     * @return {Promise<void>}
     */
    async goto(item) {
      let params = { label: item.name, value: item.href };
      await this.$store.dispatch('home/addTabs', params).then(() => {
        this.$router.push({ path: params.value });
      });
    }
  }
};
</script>

<style lang="less">
.template {
  background: #333333 !important;
}

.el-menu--collapse {
  border-right: none !important;
}
</style>
