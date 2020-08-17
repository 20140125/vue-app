<template>
    <div id="app">
        <json-viewer :value="jsonData" :expand-depth=5 copyable boxed sort/>
    </div>
</template>

<script>
    import JsonViewer from "vue-json-viewer"
    export default {
        name: "json",
        props:{
            jsonData:{
                type:Object|Array,
                default:()=>{}
            }
        },
        components:{
            JsonViewer
        },
    }
</script>

<style scoped>

</style>
