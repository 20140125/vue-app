<template>
  <BaseLayout :loading="loading">
    <template #body>
      <el-row id="information" :gutter="24">
        <el-col :lg="8" :xl="8">
          <el-tabs type="border-card">
            <el-tab-pane label="个人简介"></el-tab-pane>
            <el-card shadow="hover">
              <el-form>
                <el-form-item style="text-align: center">
                  <el-avatar :alt="Permission.username" :size="100" :src="Permission.avatar_url" fit="fill"></el-avatar>
                </el-form-item>
                <el-form-item>
                  <i class="el-icon-user-solid"></i>
                  <span v-html="Permission.username"></span>
                </el-form-item>
                <el-form-item>
                  <i class="el-icon-message-solid"></i>
                  <span v-html="Permission.email"></span>
                </el-form-item>
                <el-form-item>
                  <i class="el-icon-s-home"></i>
                  <span v-html="setLocal(userCenter.local)"></span>
                </el-form-item>
                <el-form-item>
                  <i class="el-icon-location"></i>
                  <span v-html="setLocal(userCenter.ip_address)"></span>
                </el-form-item>
                <el-form-item>
                  <i class="el-icon-s-comment"></i>
                  <span v-html="userCenter.desc"></span>
                </el-form-item>
                <el-form-item class="tags">
                  <i class="el-icon-s-claim"></i>
                  <el-tag v-for="tag in userCenter.tags" :key="tag" effect="dark" type="success">{{ tag }}</el-tag>
                </el-form-item>
              </el-form>
            </el-card>
          </el-tabs>
        </el-col>
        <el-col :lg="16" :xl="16">
          <el-tabs type="border-card">
            <el-tab-pane label="信息展示"></el-tab-pane>
            <el-card shadow="hover">
              <el-form
                ref="center"
                :model="userCenter"
                label-position="left"
                label-width="100px"
                style="margin-left: 20px">
                <el-form-item class="is-required avatar-url" label="头像：">
                  <el-avatar :alt="Permission.username" :size="100" :src="Permission.avatar_url" fit="fill"></el-avatar>
                </el-form-item>
                <el-form-item class="is-required" label="用户名：">
                  <span v-html="Permission.username"></span>
                </el-form-item>
                <el-form-item class="is-required" label="居住地址：">
                  <el-cascader v-model="userCenter.local" :options="options" :props="props" filterable></el-cascader>
                </el-form-item>
                <el-form-item class="is-required" label="所在地：">
                  <el-cascader
                    v-model="userCenter.ip_address"
                    :options="options"
                    :props="props"
                    filterable>
                  </el-cascader>
                </el-form-item>
                <el-form-item class="is-required" label="座右铭：">
                  <el-input
                    v-model="userCenter.desc"
                    maxlength="32"
                    placeholder="这个人很懒，什么也没有留下"
                    resize="none"
                    rows="3"
                    show-word-limit
                    type="textarea">
                  </el-input>
                </el-form-item>
                <el-form-item class="tags is-required" label="个人标签：">
                  <el-tag
                    v-for="tag in userCenter.tags"
                    :key="tag"
                    :disable-transitions="false"
                    closable
                    effect="dark"
                    type="success"
                    @close="handleClose(tag)">
                    {{ tag }}
                  </el-tag>
                  <el-input
                    v-if="inputVisible"
                    ref="saveTagInput"
                    v-model="inputValue"
                    size="small"
                    @blur="handleInputConfirm"
                    @keyup.enter="handleInputConfirm">
                  </el-input>
                  <el-button v-else plain size="small" type="primary" @click="showInput"> + New Tag</el-button>
                </el-form-item>
                <el-form-item class="is-required" label="站内信息：">
                  <el-tooltip
                    :content="userCenter.notice_status === 1 ? 'YES' : 'NO'"
                    effect="dark"
                    placement="top-start">
                    <el-switch
                      v-model.number="userCenter.notice_status"
                      :active-value="1"
                      :inactive-value="2"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>
                  </el-tooltip>
                </el-form-item>
                <el-form-item class="is-required" label="账号变更：">
                  <el-tooltip
                    :content="userCenter.user_status === 1 ? 'YES' : 'NO'"
                    effect="dark"
                    placement="top-start">
                    <el-switch
                      v-model.number="userCenter.user_status"
                      :active-value="1"
                      :inactive-value="2"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>
                  </el-tooltip>
                </el-form-item>
                <SubmitButton
                  :form="submitForm"
                  reForm="center"
                  @closeDialog="() => { this.$message.success('successfully updated userCenter information'); }">
                </SubmitButton>
              </el-form>
            </el-card>
          </el-tabs>
        </el-col>
      </el-row>
    </template>
  </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout';
import SubmitButton from '@/components/common/SubmitForm';
import URLS from '@/api/urls';

export default {
  name: 'Center',
  components: { SubmitButton, BaseLayout },
  data() {
    return {
      loading: true,
      userCenter: { user_status: 1, notice_status: 1, ip_address: [] },
      props: { value: 'name', label: 'name' },
      options: [],
      inputVisible: false,
      inputValue: '',
      submitForm: {}
    };
  },
  computed: {
    cacheArea() {
      return JSON.parse(JSON.stringify(this.$store.state.area.cacheArea));
    }
  },
  mounted() {
    this.$nextTick(async () => {
      /* 获取个人信息 */
      await this.$store.dispatch('users/getUserCenter', {});
      this.userCenter = JSON.parse(JSON.stringify(this.$store.state.users.userCenter));
      /* 获取城市列表 */
      await this.$store.dispatch('area/getAreaCacheLists', { children: true });
      this.setOptions(this.cacheArea);
      this.loading = false;
      setTimeout(() => {
        this.submitForm = { model: this.userCenter, $refs: this.$refs, url: URLS.userCenter.update };
      }, 1000);
    });
  },
  methods: {
    /**
     * TODO:设置数据
     * @param areaItem
     */
    setOptions(areaItem) {
      areaItem.forEach((item, index) => {
        item.children.length === 0 ? delete areaItem[index].children : this.setOptions(item.children);
      });
      this.options = areaItem;
    },
    /**
     * TODO:设置地址显示
     * @param item
     * @return {*}
     */
    setLocal(item) {
      return (item || []).length > 0 ? item.join(',').replace(new RegExp(/,/g), ' > ') : item;
    },
    /**
     * TODO:关闭标签
     * @param tag
     */
    handleClose(tag) {
      this.userCenter.tags.splice(this.userCenter.tags.indexOf(tag), 1);
    },
    /**
     * TODO:文本框输入
     */
    handleInputConfirm() {
      if (this.inputValue && this.userCenter.tags.indexOf(this.inputValue) < 0) {
        this.userCenter.tags.push(this.inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    /**
     * TODO:展示文本框
     */
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    }
  }
};
</script>

<style lang="less">
#information {
  .avatar-url {
    display: flex;
    align-items: center;
    position: relative;

    .el-form-item__content {
      margin-left: 0 !important;
    }
  }

  i {
    font-size: 16px;
    margin-right: 10px;
  }

  .tags {
    .el-tag {
      margin-right: 15px !important;
    }

    .el-input {
      width: 100px;
    }
  }
}
</style>
