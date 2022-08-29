<template>
  <HomeLayout
    :back-button="true"
    :bottom-bar="false"
    :submit-button="true"
    :header-title="headerTitle"
    :saveParams="saveParams">
    <template #body>
      <div class="grid">
        <div class="grid-item">
          <el-input placeholder="请输入" v-model="params"></el-input>
        </div>
      </div>
    </template>
  </HomeLayout>
</template>

<script>
import HomeLayout from '@/components/HomeLayout';
export default {
  name: 'UsersConfig',
  components: { HomeLayout },
  data() {
    return {
      params: this.Permission[this.$route.params.param]
    };
  },
  computed: {
    usersConfig() {
      return this.$store.state.index.usersConfig;
    },
    headerTitle() {
      return `更改${this.usersConfig[this.$route.params.param]}`;
    }
  },
  methods: {
    saveParams() {
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    }
  }
};
</script>

<style scoped>

</style>
