
export const state = () => ({
    // 提交的状态
    isSubmit: false
})

export const mutations = {
    initSubmit(state) {
        state.isSubmit = !state.isSubmit
    },
    routerTo(state, path) {
        if (path) {
            this.$router.push(path)
        }
    }
}

export const actions = {

}