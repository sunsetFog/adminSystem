const tabs = {
    state: {
        theme_value: sessionStorage.getItem('theme_skin') || ''
    },
    mutations: {
        themeWay(state,value){
            state.theme_value = value
        },
    },
    getters: {
        themeValue(state){
            return state.theme_value
        },
    },
    actions: {

    },
}

export default tabs;
