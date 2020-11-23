<template>
    <el-button :icon="showIcon === 1 ? 'el-icon-success' : 'el-icon-error'"
               circle
               :type="showIcon === 1 ? 'success' : 'danger'"
               @click="setStatus(showIcon)"
               size="size">
    </el-button>
</template>

<script>
    export default {
        name: 'Status',
        props: {
            status: {
                type: [Number, String],
                default: () => 1 // 1 是 2 否
            },
            size: {
                type: String,
                default: () => 'medium'
            }
        },
        data () {
            return {
                showIcon: this.status
            }
        },
        watch: {
            status: function () {
                this.showIcon = this.status
            }
        },
        methods: {
            setStatus: function (status) {
                this.showIcon = status === 1 ? 2 : 1
                this.$emit('changeStatus', this.showIcon)
            }
        }
    }
</script>
