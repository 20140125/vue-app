<template>
  <json-viewer :expand-depth='5' :value="items" boxed class="json-view" copyable sort></json-viewer>
</template>

<script>

export default {
  name: 'JsonView',
  props: ['items']
};
</script>

<style lang="less">
.json-view {
  line-height: 30px;
}
</style>
