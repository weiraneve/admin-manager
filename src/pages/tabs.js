import React from 'react'
import LoadableComponent from '../common/LoadableComponent'

const Account = LoadableComponent(import('./Setting/Account'), true);
const Permission = LoadableComponent(import('./Setting/Permission'), true);
const Role = LoadableComponent(import('./Setting/Role'), true);
const Menu = LoadableComponent(import('./Setting/Menu'), true);
const Home = LoadableComponent(import('./Home/index'), true);
const Order = LoadableComponent(import('./Order/index'), true);
const Goods = LoadableComponent(import('./Goods/index'), true);
const Seckill = LoadableComponent(import('./Seckill/index'), true);

// import Seckill from './Seckill/index'; 效果相当于上述语句去掉加载效果组件

const tabs = {
    Home: <Home />,
    Goods:<Goods />,
    Seckill:<Seckill />,
    Order: <Order />,
    Menu: <Menu />,
    Permission: <Permission/>,
    Role: <Role />,
    Account: <Account />,
};

export {
    tabs
}
