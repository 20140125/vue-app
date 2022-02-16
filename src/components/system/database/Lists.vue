<template>
  <el-table :data="databaseLists">
    <el-table-column label="表名" prop="name" :show-tooltip-when-overflow="true" min-width="120"></el-table-column>
    <el-table-column label="版本号" prop="version" min-width="100" align="center"></el-table-column>
    <el-table-column label="引擎" prop="engine" min-width="100" align="center"></el-table-column>
    <el-table-column label="数据表大小" prop="data_length" align="center" sortable min-width="120"></el-table-column>
    <el-table-column label="自增量" prop="auto_increment" align="center" sortable min-width="100"></el-table-column>
    <el-table-column
      label="字符集编码"
      prop="collation"
      :show-tooltip-when-overflow="true"
      min-width="120"
      align="center">
    </el-table-column>
    <el-table-column label="备注" align="center" min-width="150" :show-tooltip-when-overflow="true">
      <template #default="scope">
        <el-input
          v-model="scope.row.comment"
          :ref="scope.row.name"
          v-if="scope.row.name === name"
          placeholder="请输入数据表备注">
        </el-input>
        <div v-html="scope.row.comment" v-else></div>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" sortable prop="create_time" align="center" min-width="160"></el-table-column>
    <el-table-column width="300" align="right" label="操作">
      <template #default="scope">
        <el-button
          type="primary"
          plain
          size="mini"
          @click="updateComment(scope.row)"
          icon="el-icon-edit-outline"
          v-if="scope.row.name === name">
          更新
        </el-button>
        <el-button type="primary" plain size="mini" @click="setComment(scope.row)" v-else icon="el-icon-edit">修改
        </el-button>
        <el-button
          v-if="Permission.auth.indexOf(URLS.backup) > -1"
          type="primary"
          plain
          size="mini"
          @click="backupTable(scope.row)">
          备份
        </el-button>
        <el-button
          v-if="Permission.auth.indexOf(URLS.repair) > -1"
          type="primary"
          plain
          size="mini"
          @click="repairTable(scope.row)">
          修复
        </el-button>
        <el-button
          v-if="Permission.auth.indexOf(URLS.optimize) > -1"
          type="primary"
          plain
          size="mini"
          @click="optimizeTable(scope.row)">
          优化
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import URLS from '../../../api/urls';

export default {
  name: 'databaseLists',
  props: ['databaseLists'],
  data() {
    return {
      edit: false,
      name: '',
      URLS: URLS.database
    };
  },
  methods: {
    /**
     * TODO：数据表备份
     * @param table
     */
    async backupTable(table) {
      await this.$store.dispatch('UPDATE_ACTIONS', {
        url: URLS.database.backup,
        model: { name: table.name, form: 'all' }
      }).then(() => {
        this.$parent.$parent.$parent.$parent.getDatabaseLists(false);
      });
    },
    /**
     * TODO：数据表修复
     * @param table
     */
    async repairTable(table) {
      await this.$store.dispatch('UPDATE_ACTIONS', {
        url: URLS.database.repair,
        model: { name: table.name, engine: table.engine }
      }).then(() => {
        this.$parent.$parent.$parent.$parent.getDatabaseLists(false);
      });
    },
    /**
     * TODO：数据表优化
     * @param table
     */
    async optimizeTable(table) {
      await this.$store.dispatch('UPDATE_ACTIONS', {
        url: URLS.database.optimize,
        model: { name: table.name, engine: table.engine }
      }).then(() => {
        this.$parent.$parent.$parent.$parent.getDatabaseLists(false);
      });
    },
    /**
     * TODO：设置
     * @param table
     */
    setComment(table) {
      this.name = table.name;
      this.edit = true;
    },
    /**
     * TODO：修改注释
     * @param table
     */
    async updateComment(table) {
      if (!table.comment) {
        this.$message.warning('请输入数据表备注');
        this.$refs[table.name].focus();
        return false;
      }
      await this.$store.dispatch('UPDATE_ACTIONS', {
        url: URLS.database.alter,
        model: { name: table.name, comment: table.comment }
      }).then(() => {
        this.$parent.$parent.$parent.$parent.getDatabaseLists(false);
        this.edit = false;
      });
    }
  }
};
</script>

<style scoped>

</style>
