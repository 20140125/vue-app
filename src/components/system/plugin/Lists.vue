<template>
  <el-table :data="(pluginList || {}).children" border>
    <el-table-column label="#ID" align="center" prop="id"></el-table-column>
    <el-table-column label="插件名称" align="center">
      <template #default="scope">
        <el-button
          :disabled="scope.row.status === 2"
          :type="scope.row.status === 1 ? 'primary' : 'info'"
          plain
          style="width: 140px;"
          @click="toLogin(scope.row)"
          size="small">
          {{ scope.row.name.toUpperCase() }} 授权登录
        </el-button>
      </template>
    </el-table-column>
    <el-table-column label="插件状态" align="center">
      <template #default="scope">
        <el-button
          :type="['primary', 'danger'][scope.row.status - 1]"
          size="small"
          plain>
          {{ ['启用', '禁用'][scope.row.status - 1] }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="left">
      <template #default="scope">
        <el-tooltip
          placement="right-start"
          :content="scope.row.status === 1 ? `卸载插件后，将禁用${scope.row.name.toUpperCase()}授权登录` : `安装插件后，将启用${scope.row.name.toUpperCase()}授权登录`">
          <el-button
            :icon="scope.row.status === 1 ? 'el-icon-delete-solid' : 'el-icon-circle-plus'"
            size="small"
            type="primary"
            plain
            @click="$emit('updatePlugin', scope.row)">
            {{ scope.row.status === 1 ? '卸载插件' : '安装插件' }}
          </el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  name: 'PluginLists',
  props: {
    pluginList: {
      type:Object,
       default: () => {}
    }
  },
  methods: {
    /**
     * todo:授权登录
     * @param item
     */
    toLogin(item) {
      item.status === 1 ? window.open(item.value) : '';
    }
  }
};
</script>

<style scoped>

</style>
