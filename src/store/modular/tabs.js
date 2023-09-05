import router from '@/router'
const tabs = {
    state: {
        tabList: [],
        tabs_value: null
    },
    mutations: {
        // 标签页选中值
        tabsOfValue(state,value){
            console.log('--tabsOfValue--',value);
            sessionStorage.setItem('tabs_value', value)
            state.tabs_value = value;
        },
        // 添加tabList数组
        addTabs(state,value){
            console.log('--addTabs--',value);
            // value是数组，赋值修改tabList数组
            if (Array.isArray(value)) {
                state.tabList = value
                // 缓存tabList数组
                sessionStorage.setItem('tabList',JSON.stringify(state.tabList))
                return;
            }
            // value是对象
            // 防止重复添加
            for(let i = 0; i < state.tabList.length; i++){
                if(state.tabList[i].key == value.key){
                    return
                }
            }
            state.tabList.push(value)
            // 缓存tabList数组
            sessionStorage.setItem('tabList',JSON.stringify(state.tabList))
        },
        // 删除tabList数组一项
        removeTabs(state,value){
            state.tabList.splice(value, 1)
        }
    },
    getters: {
        tabList(state){
            return state.tabList
        },
        tabsValue(state){
            return state.tabs_value
        }
    },
    actions: {
        
    },
}

export default tabs;