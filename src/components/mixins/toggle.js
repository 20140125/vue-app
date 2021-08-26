export const toggle = {
    props: ['syncVisible'],
    data() {
        return {
            visible: this.syncVisible
        };
    },
    watch: {
        syncVisible() {
            this.visible = this.syncVisible;
        }
    }
};
