import React from "react";
import {Button, Card, Col, Form, Input, message, Table, Icon, Popconfirm, notification} from "antd";
import {del, get} from "../../../common/ajax";
import CreateMenuModal from "./CreateMenuModal";
import EditMenuModal from "./EditMenuModal";

@Form.create()
class Index extends React.Component {
    state = {
        menus: [],
        menusLoading: false,
        isShowEditModal: false,
        isShowCreateModal: false,
        menu: {},
        allMenus:[],
        permissions:[]
    };
    componentDidMount() {
        this.getMenus();
        this.getAllMenus();
        this.getPermissions();
    }
    getPermissions = async () =>{
        const res = await get('/permission/findAll');
        if (res.code === 200) {
            this.setState({
                permissions: res.data
            });
        }
    };
    getAllMenus = async () =>{
        const res = await get('/roleMenu/getMenus');
        if (res.code === 200) {
            this.setState({
                allMenus: res.data
            });
        }
    };
    getMenus = async () => {
        const fields = this.props.form.getFieldsValue();
        this.setState({
            menusLoading: true,
        });
        const res = await get('/roleMenu', {
            search: fields.search || ''
        });
        if (res.code !== 200) {
            this.setState({
                menusLoading: false,
            });
            return
        }
        this.setState({
            menusLoading: false,
            menus: res.data,
        })
    };

    /**
     * 创建modal
     * */
    toggleShowCreateModal = (visible) => {
        this.setState({
            isShowCreateModal: visible
        });
        this.getMenus();
    };

    /**
     * 修改modal
     * */
    showEditModal = (visible) =>{
        this.setState({
            isShowEditModal: true,
            menu: visible
        })
    };

    /**
     * 关闭修改模态框
     */
    closeEditModal = () => {
        this.setState({
            isShowEditModal: false,
            menu: {}
        });
        this.getMenus()
    };

    /**
     * 搜索函数
     */
    onSearch = () => {
        this.getMenus()
    };

    /**
     * 重置函数
     */
    onReset = () => {
        this.props.form.resetFields();
        this.getMenus();
        message.success('重置成功')
    };

    /**
     * 单条删除
     */
    singleDelete = async (record) => {
        const res = await del('/roleMenu',{
            id: record.id
        });
        if (res.code === 200) {
            notification.success({
                message: '删除成功',
                description: res.msg,
            });
            this.getMenus()
        }
    };
    
    render() {
        const {permissions,allMenus, menus, menusLoading, menu,isShowEditModal, isShowCreateModal } = this.state;
        const columns = [
            {
                title: '菜单类型',
                dataIndex: 'level',
                align: 'center',
                render: (text,record) =>{
                    return record.children === undefined || record.children.length === 0 ? '菜单':'目录'
                }
            },
            {
                title: '组键页面',
                dataIndex: 'key',
                align: 'center'
            },
            {
                title: '名称',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '图标',
                dataIndex: 'icon',
                align: 'center',
                render:text =>{
                    return(
                        <div>
                            <Icon type={text} />
                            &emsp;
                            {text}
                        </div>
                    )
                }
            },
            {
                title: '权限名称',
                dataIndex: 'permission',
                align: 'center',
                render: text =>{
                   return text.permissionName
                }
            },
            {
                title: '排序',
                dataIndex: 'sort',
                align: 'center'
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                width: '20%',
                render: (text, record) => (
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.showEditModal(record)}>编辑</Button>
                        &emsp;
                        <Popconfirm title='您确定删除当前数据吗？' onConfirm={() => this.singleDelete(record)}>
                            <Button type="danger">
                                <Icon type='delete' />
                                删除
                            </Button>
                        </Popconfirm>
                    </div>
                )
            },
        ];
        const { getFieldDecorator } = this.props.form;
        return(
            <div style={{ padding: 5 }}>
                <Card bordered={false}>
                    <Form layout='inline' style={{ marginBottom: 16 }}>
                        <Col span={6}>
                            <Form.Item label="菜单搜索">
                                {getFieldDecorator('search')(
                                    <Input
                                        onPressEnter={this.onSearch}
                                        style={{ width: 200 }}
                                        placeholder="输入关键字"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item style={{ marginRight: 0,width: '100%'}} wrapperCol={{ span: 24 }}>
                                <div style={{ textAlign: 'right' }}>
                                    <Button type="primary" icon='search' onClick={this.onSearch}>搜索</Button>&emsp;
                                    <Button icon="reload" onClick={this.onReset}>重置</Button>
                                </div>
                            </Form.Item>
                        </Col>
                    </Form>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type='primary' icon='plus' onClick={() => this.toggleShowCreateModal(true)}>新增</Button>&emsp;
                    </div>
                    <Table
                        bordered
                        rowKey='id'
                        columns={columns}
                        dataSource={menus}
                        loading={menusLoading}
                    />
                </Card>
                <EditMenuModal onCancel={this.closeEditModal} visible={isShowEditModal}  menu={menu} allMenus={allMenus} permissions={permissions} />
                <CreateMenuModal visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} allMenus={allMenus} permissions={permissions} />
            </div>
        )
    }
}

export default Index;
