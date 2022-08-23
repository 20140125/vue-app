<template>
  <div class="grid">
    <div v-for="(item, index) in loadMore" :key="index" class="grid-list">
      <div class="panel">
        <div class="card-img">
          <el-image
            :preview-src-list="[item.href]"
            :src="item.href"
            fit="unset"
            style="width:100%;height:100%">
          </el-image>
        </div>
        <div class="card-num-view">{{ item.width ? `${item.width}px` : '' }}</div>
        <div class="card-bottom">
          <div class="card-title-view row">
            <div class="card-title">
              <span v-html="item.name"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Lists',
  props: ['loadMore']
};
</script>
