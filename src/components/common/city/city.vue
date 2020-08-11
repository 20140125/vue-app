<template>
    <div id="app">
        <json-viewer :value="weather.forecast" :expand-depth=5 copyable boxed sort/>
    </div>
</template>

<script>
    import JsonViewer from "vue-json-viewer"
    import {mapGetters} from 'vuex'
    export default {
        name: "city",
        data() {
            return {

            }
        },
        components:{
            JsonViewer
        },
        computed:{
            ...mapGetters(['weather'])
        },
        mounted() {
            this.$nextTick(function () {

            })
        },
    }
</script>

<style scoped>

</style>
