<template>
  <div id="upload">
    <el-dialog
      v-model="visible"
      :title="`文件上传`"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="$emit('closeDialog')">
      <CommonUpload
        list-type='picture-card'
        :img-height="0"
        :img-width="0"
        :auto-upload="false"
        :upload-controls="{ button_type: 'picture', show_tips: false, show_file_list: true }"
        :data="{ name: 'file', file: file, round_name: false }">
      </CommonUpload>
    </el-dialog>
  </div>
</template>

<script>
import CommonUpload from '../common/CommonUpload';
import { toggle } from '../mixins/toggle';

export default {
  name: 'FileUpload',
  components: { CommonUpload },
  props: ['file'],
  mixins: [toggle]
};
</script>

<style lang="less">
#upload {

}
</style>
