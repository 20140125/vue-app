<template>
  <el-table :data="lists" @selection-change="$emit('getMultipleSelection', $event)">
    <el-table-column type="selection" width="60"></el-table-column>
    <el-table-column label="文件名" width="600">
      <template #default="scope">
        <span
          v-if="scope.row.file_type !== 'file'"
          style="cursor: pointer;"
          @click="$emit('getFileLists', scope.row)"
          v-html="scope.row.filename">
        </span>
        <span v-else style="cursor: pointer;" @click="$emit('getFiles',scope.row)" v-html="scope.row.filename"></span>
      </template>
    </el-table-column>
    <el-table-column label="类型" width="100">
      <template #default="scope">
        <span v-html="scope.row.file_type.replace(/^\S/, s => s.toUpperCase())"></span>
      </template>
    </el-table-column>
    <el-table-column label="权限" prop="auth" width="100"></el-table-column>
    <el-table-column label="大小" prop="size" width="100"></el-table-column>
    <el-table-column label="修改时间" prop="time" width="150"></el-table-column>
    <el-table-column align="right" label="操作">
      <template #default="scope">
        <el-button
          v-if="scope.row.file_type !== 'file' && Permission.auth.indexOf(fileURL.save) > -1"
          size="mini"
          type="text"
          @click="$emit('addFile', scope.row)">
          添加
        </el-button>
        <el-button
          v-if="scope.row.file_type === 'file' && Permission.auth.indexOf(fileURL.read) > -1"
          size="mini"
          type="text"
          @click="$emit('getFiles', scope.row)">
          编辑
        </el-button>
        <el-button
          v-if="Permission.auth.indexOf(fileURL.rename) > -1"
          size="mini"
          type="text"
          @click="$emit('renameFile', scope.row)">
          重命名
        </el-button>
        <el-button
          v-if="Permission.auth.indexOf(fileURL.chmod) > -1"
          size="mini"
          type="text"
          @click="$emit('chmodFile',scope.row)">
          权限
        </el-button>
        <el-button
          v-if="Permission.auth.indexOf(fileURL.zip) > -1"
          size="mini"
          type="text"
          @click="$emit('composeFile',scope.row)">
          压缩
        </el-button>
        <el-button
          v-if="scope.row.file_type === 'file' && scope.row.filename.split('.')[1] === 'zip' && Permission.auth.indexOf(fileURL.unzip) > -1"
          size="mini"
          type="text"
          @click="$emit('unComposeFile',scope.row)">
          解压
        </el-button>
        <el-button
          v-if="Permission.auth.indexOf(fileURL.download) > -1"
          size="mini"
          type="text"
          @click="$emit('downloadFile',scope.row)">
          下载
        </el-button>
        <el-button
          v-if="Permission.auth.indexOf(fileURL.upload) > -1"
          size="mini"
          type="text"
          @click="$emit('uploadFile',scope.row)">
          上传
        </el-button>
        <el-button
          v-if="Permission.auth.indexOf(fileURL.delete) > -1"
          size="mini"
          type="text"
          @click="$emit('deleteFile',scope.row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'FileLists',
  props: ['lists', 'fileURL']
};
</script>

<style scoped>

</style>
