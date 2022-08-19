<template>
  <div id="upload">
    <el-dialog
      v-model="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="`文件上传`"
      center
      @close="$emit('closeDialog')">
      <CommonUpload
        :auto-upload="false"
        :data="{ name: 'file', file: file, round_name: false }"
        :img-height="0"
        :img-width="0"
        :upload-controls="{ button_type: 'picture', show_tips: false, show_file_list: true }"
        list-type='picture-card'>
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
