<template>
  <HomeLayout header-title="个人信息" :bottom-bar="false" :back-button="true">
    <template #body>
      <div class="grid">
        <div class="grid-item grid-item__image">
          <div class="info">头像</div>
          <div class="icon">
            <CommonUpload
              :avatar-image="avatarAttribute"
              :file-size="100"
              :img-height="0"
              :img-width="0"
              :upload-controls="{ button_type: 'avatar', show_file_list: false, show_tips: false }"
              :uploadSuccess="uploadSuccess">
            </CommonUpload>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item" @click="changeAccount('username')">
          <div class="info">名字</div>
          <div class="icon">
            <span v-html="Permission.username || ''"></span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">账号</div>
          <div class="icon">
            <span v-html="Permission.uuid || ''"></span>
          </div>
        </div>
        <div class="grid-item" @click="changeAccount('email')">
          <div class="info">邮箱</div>
          <div class="icon">
            <span v-html="Permission.email || ''"></span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">IP地址</div>
          <div class="icon">
            <span v-html="Permission.ip_address || ''"></span>
          </div>
        </div>
        <div class="grid-item">
          <div class="info">地区</div>
          <div class="icon">
            <span v-html="Permission.city || ''"></span>
          </div>
        </div>
        <div class="grid-item" @click="changeAccount('more')">
          <div class="info">更多信息</div>
          <div class="icon">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </template>
  </HomeLayout>
</template>

<script>
import HomeLayout from '@/components/HomeLayout';
import CommonUpload from '@/components/common/CommonUpload';

export default {
  name: 'UsersCenter',
  components: { CommonUpload, HomeLayout },
  computed: {
    avatarAttribute() {
      return { username: this.Permission.username || '', avatar_url: this.Permission.avatar_url || '', size: 60 };
    }
  },
  created() {
    console.log(this.Permission);
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.Permission) {
        this.$router.push({ path: '/home/users'});
      }
    });
  },
  methods: {
    /**
     * todo:图片上传成功
     * @param file
     */
    uploadSuccess(file) {
      console.log(file);
      this.avatarAttribute.avatar_url = file.item.lists.src;
      console.log(this.avatarAttribute);
    },
    /**
     * todo:修改账户信息
     * @param param
     */
    changeAccount(param) {
      this.$router.push({ path: param === 'more' ? '/home/users/more' : `/home/users/update/${param}` });
    }
  }
};
</script>

<style scoped>

</style>
