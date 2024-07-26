<template>
  <el-table :data="databaseLists">
    <el-table-column :show-tooltip-when-overflow="true" label="表名" min-width="120" prop="name"></el-table-column>
    <el-table-column align="center" label="版本号" min-width="100" prop="version"></el-table-column>
    <el-table-column align="center" label="引擎" min-width="100" prop="engine"></el-table-column>
    <el-table-column align="center" label="数据表大小" min-width="120" prop="data_length" sortable></el-table-column>
    <el-table-column align="center" label="自增量" min-width="100" prop="auto_increment" sortable></el-table-column>
    <el-table-column
      :show-tooltip-when-overflow="true"
      align="center"
      label="字符集编码"
      min-width="120"
      prop="collation">
    </el-table-column>
    <el-table-column :show-tooltip-when-overflow="true" align="center" label="备注" min-width="150">
      <template #default="scope">
        <el-input
          v-if="scope.row.name === name"
          :ref="scope.row.name"
          v-model="scope.row.comment"
          placeholder="请输入数据表备注">
        </el-input>
        <div v-else v-html="scope.row.comment"></div>
      </template>
    </el-table-column>
    <el-table-column align="center" label="创建时间" min-width="160" prop="create_time" sortable></el-table-column>
    <el-table-column align="center" label="操作" width="300" fixed="right">
      <template #default="scope">
        <el-button
          v-if="scope.row.name === name"
          icon="el-icon-edit-outline"
          plain
          size="mini"
          type="primary"
          @click="updateComment(scope.row)">
          更新
        </el-button>
        <el-button v-else icon="el-icon-edit" plain size="mini" type="primary" @click="() => { name = scope.row.name }">
          修改
        </el-button>
        <el-button
          v-if="Permission.auth.indexOf(database.backup) > -1"
          plain
          size="mini"
          type="primary"
          @click="backupTable(scope.row)">
          备份
        </el-button>
        <el-button
          v-if="Permission.auth.indexOf(database.repair) > -1"
          plain
          size="mini"
          type="primary"
          @click="repairTable(scope.row)">
          修复
        </el-button>
        <el-button
          v-if="Permission.auth.indexOf(database.optimize) > -1"
          plain
          size="mini"
          type="primary"
          @click="optimizeTable(scope.row)">
          优化
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { database } from '@/api/urls';

export default {
  name: 'databaseLists',
  props: ['databaseLists'],
  data() {
    return {
      name: '',
      database
    };
  },
  methods: {
    /**
     * 数据表备份
     * @param table
     */
    async backupTable(table) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await this.$store.dispatch('UPDATE_ACTIONS', { url: database.backup, model: { name: table.name, form: 'all' } });
      loading.close();
    },
    /**
     * 数据表修复
     * @param table
     */
    async repairTable(table) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await this.$store.dispatch('UPDATE_ACTIONS', { url: database.repair, model: { name: table.name, engine: table.engine } });
      loading.close();
    },
    /**
     * 数据表优化
     * @param table
     */
    async optimizeTable(table) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await this.$store.dispatch('UPDATE_ACTIONS', { url: database.optimize, model: { name: table.name, engine: table.engine } });
      loading.close();
    },
    /**
     * 修改注释
     * @param table
     */
    async updateComment(table) {
      if (!table.comment) {
        this.$message.warning('请输入数据表备注');
        this.$refs[table.name].focus();
        return false;
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await this.$store.dispatch('UPDATE_ACTIONS', { url: database.alter, model: { name: table.name, comment: table.comment } });
      loading.close();
      this.name = '';
    }
  }
};
</script>

<style scoped>

</style>
