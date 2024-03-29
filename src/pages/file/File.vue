<template>
  <BaseLayout :loading="loading">
    <template #header>
      <el-form-item style="width: 900px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index" @click="getFileLists(item, index)">
            {{ item.filename }}
          </el-breadcrumb-item>
          <el-breadcrumb-item
            style="float: right"
            @click="getFileLists({ path: '/', filename: 'longer' })">
            <i class="el-icon-refresh-right"></i>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-form-item>
    </template>
    <template #body>
      <!--文件列表-->
      <FileLists
        :fileURL="fileURL"
        :lists="fileLists"
        :iconMap="iconMap"
        @addFile="addFile"
        @chmodFile="chmodFile"
        @deleteFile="deleteFile"
        @getFileLists="getFileLists"
        @getFiles="getFiles"
        @getMultipleSelection="getMultipleSelection"
        @renameFile="renameFile"
        @unComposeFile="unComposeFile"
        @uploadFile="uploadFile">
      </FileLists>
    </template>
    <template #dialog>
      <!--文本编辑-->
      <FileDetails
        ref="fileDetail"
        :detail-visible="visible.detail"
        :details="fileLists"
        @closeDialog="closeDialog">
      </FileDetails>
      <!--静态资源预览-->
      <StaticSource
        :static-source="staticSource"
        :syncVisible="visible.source"
        @closeDialog="closeDialog">
      </StaticSource>
      <!--权限-->
      <FileChmod :chmod-visible="visible.chmod" :file="chmod" @closeDialog="closeDialog"></FileChmod>
      <!-- 文件上传 -->
      <FileUpload :file="staticSource.file" :syncVisible="visible.upload" @closeDialog="closeDialog"></FileUpload>
    </template>
  </BaseLayout>
</template>

<script>
import FileLists from '@/components/file/Lists';
import FileDetails from '@/components/file/Details';
import BaseLayout from '@/components/BaseLayout';
import { file as fileURL } from '@/api/urls';
import StaticSource from '@/components/file/StaticSource';
import FileChmod from '@/components/file/chmod';
import FileUpload from '@/components/file/Upload';

export default {
  name: 'File',
  components: { FileUpload, FileChmod, StaticSource, BaseLayout, FileDetails, FileLists },
  computed: {
    fileLists() {
      return this.$store.state.file.fileLists;
    }
  },
  data() {
    return {
      fileDetail: [],
      visible: { detail: false, source: false, chmod: false, upload: false },
      staticSource: { image: [], video: [], title: '', file: '' },
      iconMap: { dir: 'el-icon-folder-opened', file: 'el-icon-files' },
      chmod: {},
      loading: true,
      fileAttr: { multipleSelection: [] },
      fileURL,
      breadcrumb: [{ path: '/', filename: 'longer' }]
    };
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getFileLists();
    });
  },
  methods: {
    /**
     * 获取文件列表
     * @param basename
     * @param index
     * @param detail
     */
    async getFileLists(basename = { path: '/', filename: 'longer' }, index = 0, detail = false) {
      if (JSON.stringify(this.breadcrumb).indexOf(JSON.stringify(basename)) === -1) {
        this.breadcrumb.push(basename);
      } else {
        this.breadcrumb.splice(index + 1, this.breadcrumb.length - index - 1);
      }
      if (basename.path === '/') {
        this.breadcrumb = [{ path: '/', filename: 'longer' }];
      }
      this.visible = { detail: detail, source: false, chmod: false, upload: false };
      this.loading = true;
      await this.$store.dispatch('file/getFileLists', { path: 'base_path', basename: basename.path }).then(() => {
        this.loading = false;
      });
    },
    /**
     * 获取文件内容
     * @param file
     */
    async getFiles(file) {
      const ext = (file.filename.split('.') || [])[1] || 'php';
      /* 图片浏览 */
      const imgExt = ['png', 'jpg', 'jpeg', 'gif'];
      if (imgExt.includes(ext.toLowerCase())) {
        this.getSource(this.fileLists, file.path.replace(file.filename, ''), 'image');
        return false;
      }
      /* 视频浏览 */
      const videoExt = ['mp4', 'flv'];
      if (videoExt.includes(ext.toLowerCase())) {
        await this.getSource(this.fileLists, file.path.replace(file.filename, ''), 'video');
        return false;
      }
      this.visible = { detail: true, source: false, chmod: false, upload: false };
      if (file.file_type === 'file' && file.filename.split('.')[1] !== 'zip') {
        await this.$refs['fileDetail'].getFileContent(file);
      }
    },
    /**
     * 获取静态资源
     * @param fileLists
     * @param filePath
     * @param form
     */
    getSource(fileLists, filePath, form = 'image') {
      const source = [];
      fileLists.forEach(file => {
        source.push({
          url: `${this.$store.state.login.userInfo.local}'/storage'${file.path.substr(file.path.indexOf('public') + 6, file.path.length - file.path.indexOf('public'))}`,
          title: file.filename
        });
      });
      this.staticSource = form === 'image' ? { image: source, video: [], title: '图片预览' } : {
        image: [],
        video: source,
        title: '视频预览'
      };
      this.visible = { detail: false, source: true, chmod: false, upload: false };
    },
    /**
     * 添加文件
     * @param file
     */
    async addFile(file) {
      await this.$prompt('请输入文件名', '新建文件', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(({ value }) => {
        if (['', 'null', null, undefined, 'undefined'].includes(value)) {
          this.$message.warning('File name cannot be empty');
          return false;
        }
        this.$store.dispatch('UPDATE_ACTIONS', { url: fileURL.save, model: { path: file.path + value } }).then(() => {
          this.getFileLists();
        });
      }).catch(() => {
        this.$message.info('cancel entry');
      });
    },
    /**
     * 设置权限
     * @param file
     */
    async chmodFile(file) {
      this.visible = { chmod: true, detail: false, source: false, upload: false };
      this.chmod = file;
    },
    /**
     * 文件上传
     * @param file
     */
    async uploadFile(file) {
      this.staticSource.file = file;
      this.visible = { chmod: false, detail: false, source: false, upload: true };
    },
    /**
     * 文件打包
     * @param file
     */
    async composerFile(file = '') {
      await this.$prompt('请输入文件名', '文件打包', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(({ value }) => {
        if (['', 'null', null, undefined, 'undefined'].includes(value)) {
          this.$message.warning('File name cannot be empty');
          return false;
        }
        this.$store.dispatch('UPDATE_ACTIONS', {
          url: fileURL.zip, model: {
            resource: value.indexOf('.') >= 0 ? value.split('.')[0] : value,
            docLists: file ? [file.path] : this.fileAttr.multipleSelection,
            path: file ? file.path.replace(file.filename, '') : this.fileAttr.path
          }
        }).then(() => {
          this.getFileLists();
        });
      }).catch(() => {
        this.$message.info('cancel entry');
      });
    },
    /**
     * 文件解压
     * @param file
     */
    async unComposeFile(file) {
      await this.$store.dispatch('UPDATE_ACTIONS', { url: fileURL.unzip, model: { resource: file.filename.split('.')[0], path: file.path } });
      await this.getFileLists();
    },
    /**
     * 删除文件
     * @param file
     */
    async deleteFile(file) {
      await this.$confirm('此操作将永远删除该文件，是否继续？', `删除文件${file.filename}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('UPDATE_ACTIONS', { url: fileURL.delete, model: { path: file.path } }).then(() => {
          this.getFileLists();
        });
      }).catch(() => {
        this.$message({ type: 'info', message: 'cancel remove！' });
      });
    },
    /**
     * 文件重命名
     * @param file
     */
    async renameFile(file) {
      await this.$prompt('请输入新文件名', `${file.filename}重命名`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (['', 'null', null, undefined, 'undefined'].includes(value)) {
          this.$message.warning('File name cannot be empty');
          return false;
        }
        this.$confirm('此操作可能会影响项目运行，是否继续？', '重命名', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('UPDATE_ACTIONS', {
            url: fileURL.rename,
            model: { path: file.path + value }
          }).then(() => {
            this.getFileLists();
          });
        }).catch(() => {
          this.$message.info('cancel rename file');
        });
      }).catch(() => {
        this.$message.info('cancel entry');
      });
    },
    /**
     * 获取选中的数据
     * @param files
     */
    async getMultipleSelection(files) {
      this.fileAttr.multipleSelection = [];
      await files.forEach(item => {
        this.fileAttr.path = item.path.replace(item.filename, '');
        this.fileAttr.multipleSelection.push(item.path);
      });
    },
    /**
     * 关闭弹框
     */
    closeDialog() {
      this.visible = { detail: false, source: false, chmod: false, upload: false };
    }
  }
};
</script>
<style lang="less">
.el-breadcrumb {
  border: 1px solid #dddddd;
  padding: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  background-color: #EEEEEE;

  .el-icon-refresh-right {
    cursor: pointer;
    font-size: 16px;
  }
}
</style>
