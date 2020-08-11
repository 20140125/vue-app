<template>
    <div id="app">
        <json-viewer :value="weather" :expand-depth=5 copyable boxed sort/>
    </div>
</template>

<script>
    import JsonViewer from "vue-json-viewer"
    export default {
        name: "city",
        props:{
            weather:{
                type:Object,
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
