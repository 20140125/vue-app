<template>
    <div style="margin: 20px 0">
        <el-button type="primary" plain v-for="(item, index) in oAuthConfig.children" :key="index">{{item.name.toUpperCase()}}</el-button>
    </div>
</template>

<script>
export default {
    name: 'OAuth',
    props: ['oauthLogin'],
    data () {
        return {
            oAuthConfig: {}
        }
    },
    watch: {
        async oauthLogin () {
            if (this.oauthLogin) {
                await this.$store.dispatch('login/getOauthConfig', { name: 'Oauth', login: 'before' })
                this.oAuthConfig = this.$store.state.login.oauthConfig
            }
        }
    }
}
</script>

<style scoped>

</style>
