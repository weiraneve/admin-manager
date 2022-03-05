import { combineReducers } from 'redux'
import {SET_MENUS, SET_USER, SET_WELCOME} from './actions'

/**
 * 用户信息
 * @param {*} state
 * @param {*} action
 */
function user(state = {}, action) {
    switch (action.type) {
        case SET_USER: {
            return action.user
        }
        default:
            return state
    }
}
/**
 * 首页统计数据
 * */
function statistic(state = {}, action) {
    switch (action.type) {
        case SET_WELCOME: {
            return action.statistic
        }
        default:
            return state
    }
}
/**
 * 菜单
 * */
function menus(state = {}, action) {
    switch (action.type) {
        case SET_MENUS: {
            return action.menus
        }
        default:
            return state
    }
}
const rootReducer = combineReducers({
    user,
    statistic,
    menus
});

export default rootReducer
