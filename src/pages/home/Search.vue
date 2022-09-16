<template>
  <HomeLayout header-title="魔盒逗图 -- 热搜">
    <template #body>
      <div class="grid">
        <div class="input-group">
          <el-input v-model="pagination.name" placeholder="请输入">
            <template #append>
              <el-button type="primary" @click="doSearch(pagination.name)">搜索</el-button>
            </template>
          </el-input>
        </div>
        <!-- 关键词搜索 -->
        <template v-if="loadMore.length === 0">
          <div class="keywords">
            <div class="history-keywords">
              <div class="icon">
                <span>搜索历史</span>
                <i class="el-icon-delete" @click="oldDelete"></i>
              </div>
              <el-tag
                v-for="(item, index) in oldKeywords"
                :key="index"
                effect="plain"
                type="danger"
                @click="doSearch(item)">
                {{ item }}
              </el-tag>
            </div>
            <div class="hot-keywords">
              <div class="icon">
                <span>热门搜索</span>
                <i
                  :class="showHotWords ? 'el-icon-open' : 'el-icon-turn-off'"
                   @click="showHotWords = !showHotWords">
                </i>
              </div>
              <template v-if="showHotWords">
                <el-tag
                  v-for="(item, index) in hotKeyWord"
                  :key="index"
                  effect="plain"
                  type="info"
                  @click="doSearch(item)">
                  {{ item }}
                </el-tag>
              </template>
            </div>
          </div>
        </template>
        <!--列表页-->
        <template v-if="loadMore.length > 0">
          <Lists :load-more="loadMore" style="padding: 50px 0 80px 0;"></Lists>
        </template>
      </div>
    </template>
  </HomeLayout>
</template>

<script>
import HomeLayout from '@/components/HomeLayout';
import Lists from '@/components/home/Lists';
import { debounce, scrollBottom0 } from '@/utils/func';

export default {
  name: 'Search',
  components: { Lists, HomeLayout },
  data() {
    return {
      showHotWords: true,
      oldKeywords: [],
      loadMore: this.$store.state.index.imageLists.search.lists,
      pagination: {
        page: 1,
        limit: 20,
        source: 'h5',
        name: this.$store.state.index.imageLists.search.searchKeys,
        type: 'search'
      }
    };
  },
  watch: {
    '$route'() {
      this.$store.commit('index/UPDATE_MUTATIONS', {
        imageLists: {
          search: {
            lists: [],
            total: 0,
            searchKeys: this.pagination.name
          },
          index: {
            lists: this.$store.state.index.imageLists.index
            , total: 0
          }
        }
      });
    }
  },
  computed: {
    /* 热搜词 */
    hotKeyWord() {
      return this.$store.state.index.configuration.hotKeyWord;
    },
    /* 图片列表 */
    imageLists() {
      const data = JSON.parse(JSON.stringify(this.$store.state.index.imageLists.search.lists));
      data.forEach((item) => {
        item.name = item.name.replace(this.pagination.name, '<span style="color:#409EFF">' + this.pagination.name + '</span>');
      });
      return data;
    },
    /* 总记录数 */
    total() {
      return this.$store.state.index.imageLists.search.total;
    }
  },
  /* 卸载节点 */
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  mounted() {
    this.$nextTick(async () => {
      this.oldKeywords = JSON.parse(window.localStorage.getItem('OldKeys') || '[]');
      await this.getConfiguration();
    });
  },
  methods: {
    /**
     * todo:获取系统通知
     * @returns {Promise<void>}
     */
    async getConfiguration() {
      await this.$store.dispatch('index/getConfiguration', { keywords: 'HotKeyWord', type: 'hotKeyWord' });
    },
    /**
     * todo:删除历史搜索记录
     * @returns {Promise<void>}
     */
    async oldDelete() {
      await this.$confirm('确定清除历史搜索记录？', '删除记录', { type: 'success', showClose: false }).then(() => {
        window.localStorage.removeItem('OldKeys');
        this.oldKeywords = [];
        this.setMessage('删除历史记录成功', 'success', false);
      }).catch(() => {
        this.setMessage('已取消删除', 'success', false);
      });
    },
    /**
     * todo:设置消息弹框
     * @param message
     * @param type
     * @param showLoading
     */
    setMessage(message, type, showLoading = true) {
      const loading = this.$loading({
        lock: true,
        spinner: 'el-icon-loading',
        background: 'rgba(225, 225, 224, 0.8)'
      });
      setTimeout(async () => {
        loading.close();
        await this.$message({
          message: message,
          type: type,
          offset: 350,
          dangerouslyUseHTMLString: true,
          duration: 1000
        });
      }, showLoading ? 500 : 0);
    },
    /**
     * todo:设置搜索字段
     * @param keyword
     * @returns {Promise<boolean>}
     */
    async doSearch(keyword) {
      if (!keyword) {
        this.setMessage('请输入搜索词', 'success');
        setTimeout(() => {
          this.pagination.name = this.$store.state.index.imageLists.search.searchKeys;
        }, 500);
        return false;
      }
      this.loadMore = [];
      const index = this.oldKeywords.indexOf(keyword);
      if (index === -1) {
        this.oldKeywords.unshift(keyword);
      } else {
        this.oldKeywords.splice(index, 1);
        this.oldKeywords.unshift(keyword);
      }
      this.oldKeywords.length > 20 && this.oldKeywords.pop();
      window.localStorage.setItem('OldKeys', JSON.stringify(this.oldKeywords));
      this.pagination = { page: 1, limit: 20, source: 'h5', name: keyword, type: 'search' };
      /* 设置记录为空 */
      this.$store.commit('index/UPDATE_MUTATIONS', {
        imageLists: {
          search: {
            lists: [],
            total: 0,
            searchKeys: this.pagination.name
          },
          index: {
            lists: this.$store.state.index.imageLists.index,
            total: 0
          }
        }
      });
      await this.getImageLists(this.pagination);
    },
    /**
     * todo:获取图片列表
     * @param pagination
     * @returns {Promise<*>}
     */
    async getImageLists(pagination) {
      const loading = this.$loading({
        lock: true,
        text: '玩命加载中。。。',
        spinner: 'el-icon-loading',
        background: 'rgba(225, 225, 224, 0.8)'
      });
      await this.$store.dispatch('index/getImageLists', pagination);
      this.loadMore = this.loadMore.concat(this.imageLists);
      loading.close();
    },
    /**
     * todo:下滑加载数据
     * @returns {Promise<void>}
     */
    async handleScroll() {
      if (scrollBottom0() && this.loadMore.length < this.total) {
        this.pagination.page = this.pagination.page + 1;
        debounce(await this.getImageLists(this.pagination), 500);
      }
    }
  }
};
</script>

<style lang="less">
.el-message {
  border-radius: 10px;
}

.el-message-box {
  width: 300px !important;
}
</style>
