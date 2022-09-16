<template>
  <BaseLayout :loading="loading">
    <template #body>
      <DatabaseLists :database-lists="databaseLists"></DatabaseLists>
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout';
import DatabaseLists from '@/components/system/database/Lists';

export default {
  name: 'Database',
  components: { DatabaseLists, BaseLayout },
  data() {
    return {
      loading: true
    };
  },
  computed: {
    databaseLists() {
      return JSON.parse(JSON.stringify(this.$store.state.database.databaseLists || []));
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getDatabaseLists();
    });
  },
  methods: {
    /**
     * todo:获取数据表
     * @param refresh
     */
    async getDatabaseLists(refresh = true) {
      await this.$store.dispatch('database/getDatabaseLists', { refresh: refresh });
      this.loading = false;
    }
  }
};
</script>

<style scoped>

</style>
