import {get} from "../common/ajax";

// Redux 背后的基本思想：应用中使用集中式的全局状态来管理，并明确更新状态的模式，以便让代码具有可预测性
// actions：根据用户输入在应用程序中发生的事件，并触发状态更新
// 虽然用户信息放在localStorage也可以全局使用，但是如果放在localStorage中，用户信息改变时页面不会实时更新
export const SET_USER = 'SET_USER';
export const SET_WELCOME = 'SET_WELCOME';
export const SET_MENUS = 'SET_MENUS';
export function setUser(user) {
    return {
        type: SET_USER,
        user
    }
}
function setWelcome(data) {
    return {
        type: SET_WELCOME,
        statistic: data
    }
}
function setMenus(data) {
    return {
        type: SET_MENUS,
        menus: data
    }
}
// 异步action，从后台获取用户信息
export function getUser() {
    return async function (dispatch) {
        const res = await get('/session');
        dispatch(setUser(res.data || {}))
        // dispatch 是一个用于触发 action 的函数，action 是改变 State 的唯一途径，
        // 但是它只描述了一个行为，而 dispatch 可以看作是触发这个行为的方式，而 Reducer 则是描述如何改变数据的。
    }
}

// 首页统计数据获取
export function getWelcome() {
    return async function (dispatch) {
        const res = await get('/welcome');
        dispatch(setWelcome(res.data || {}))
    }
}

// 加载菜单
export function initMenus() {
    return async function (dispatch) {
        const res = await get('/menu');
        dispatch(setMenus(res.data || {}))
    }
}

