<template>
  <json-viewer :value="items" :expand-depth='5' copyable boxed sort class="json-view"></json-viewer>
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
