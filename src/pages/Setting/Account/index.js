import React from "react";
import {
    Table,
    Card,
    Button,
    message, Col, Input, Form, Descriptions, Tag, Modal, notification, Switch, List
} from 'antd'
import {del, get, patch} from "../../../common/ajax";
import CreateAccountModal from "./CreateAccountModal";
import EditAccountModal from "./EditAccountModal";
import EditAccountPermissionModal from "./EditAccountPermissionModal";

@Form.create()
class Index extends React.Component {
    state = {
        adminUsers: [],
        adminUsersLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
        isShowEditModal: false,
        adminUser: {},
        selectedRowKeys: [],
        isShowCreateModal: false,
        isShowEditPermissionModal: false,
        roles:[]
    };

    componentDidMount() {
        this.getAdminUsers().then();
        this.getRoles().then();
    }

    getRoles = async () =>{
        const res = await get('/role/findAll');
        if (res.code === 200) {
            this.setState({
                roles: res.data
            });
        }
    };

    getAdminUsers = async (page = 1) => {
        const { pagination } = this.state;
        const fields = this.props.form.getFieldsValue();
        this.setState({
            adminUsersLoading: true,
        });
        const res = await get('/adminUser', {
            page: page,
            pageSize: this.state.pagination.pageSize,
            search: fields.search || ''
        });
        if (res.code !== 200) {
            this.setState({
                adminUsersLoading: false,
            });
            return
        }
        this.setState({
            adminUsersLoading: false,
            adminUsers: res.data.list,
            pagination: {
                ...pagination,
                total: res.data.total,
                current: page
            }
        })
    };

    /**
     * table分页
     */
    onTableChange = async (page) => {
        await this.setState({
            pagination: page
        });
        this.getAdminUsers(page.current).then()
    };

    /**
     * 批量删除
     */
    batchDelete = () => {
        Modal.confirm({
            title: '提示',
            content: '您确定批量删除勾选内容吗？',
            onOk: async () => {
                const res = await del('/adminUser', {
                    ids: this.state.selectedRowKeys
                });
                if (res.code === 200) {
                    notification.success({
                        message: '删除成功',
                        description: res.msg,
                    });
                    this.setState({
                        selectedRowKeys: []
                    });
                    this.getAdminUsers().then()
                }
            }
        })
    };

    /**
     * 禁用/启用
     * */
    switch = async (record) =>{
        const res = await patch('/adminUser/'+record.id);
        if (res.code === 200) {
            notification.success({
                message: '修改成功',
                description: res.msg,
            });
            this.getAdminUsers().then()
        }
    };

    /**
     * 创建modal
     * */
    toggleShowCreateModal = (visible) => {
        this.setState({
            isShowCreateModal: visible
        });
        this.getAdminUsers().then();
    };

    /**
     * 修改modal
     * */
    showEditModal = (visible) =>{
        this.setState({
            isShowEditModal: true,
            adminUser: visible
        })
    };

    /**
     * 关闭修改模态框
     */
    closeEditModal = () => {
        this.setState({
            isShowEditModal: false,
            adminUser: {}
        });
        this.getAdminUsers().then()
    };

    /**
     * 关闭权限修改模态框
     */
    closeEditPermissionModal = () => {
        this.setState({
            isShowEditPermissionModal: false,
            adminUser: {}
        });
        this.getAdminUsers().then()
    };

    /**
     * 修改权限modal
     * */
    showEditPermissionModal = (visible) =>{
        this.setState({
            isShowEditPermissionModal: true,
            adminUser: visible
        })
    };

    /**
     * 搜索函数
     */
    onSearch = () => {
        this.getAdminUsers().then()
    };

    /**
     * 重置函数
     */
    onReset = () => {
        this.props.form.resetFields();
        this.setState({
            selectedRowKeys: []
        });
        this.getAdminUsers().then();
        message.success('重置成功')
    };
    
    render() {
        const {isShowEditPermissionModal,roles, adminUsers, adminUsersLoading, pagination, adminUser, selectedRowKeys,isShowEditModal, isShowCreateModal } = this.state;
        const columns = [
            {
                title: '序号',
                key: 'id',
                align: 'center',
                width:'8%',
                render: (text, record, index) => {
                    let num = (pagination.current - 1) * pagination.pageSize + index + 1;
                    if (num < pagination.pageSize) {
                        num = '0' + num
                    }
                    return num
                }
            },
            {
                title: '账号',
                dataIndex: 'username',
                align: 'center'
            },
            {
                title: '角色',
                dataIndex: 'roles',
                align: 'center',
                render: (text) =>
                    <div>
                        {
                            text.map(role => {
                                return <div key={role.id} style={{marginTop: '1px'}}><Tag color="#108ee9">{role.roleName}</Tag></div>
                            })
                        }
                    </div>
            },
            {
                title: '是否启用',
                dataIndex: 'isBan',
                align: 'center',
                render:(text, record) => (
                    <Switch onClick = {()=>this.switch(record)} checkedChildren="启用" unCheckedChildren="禁用" defaultChecked={!text}/>
                )
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                align: 'center',
                render: text =>
                    text ?
                        text
                        :
                        '未设置'
            },
            {
                title: '昵称',
                dataIndex: 'name',
                align: 'center',
                render: text =>
                    text ?
                        text
                        :
                        '未设置'
            },
            {
                title: '头像',
                dataIndex: 'avatar',
                align: 'center',
                render: (text) =>
                    text ?
                        <img style={{height:'50px',width:'50px'}} src={text} alt={''}/>
                        :
                        '未设置'
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                width: '18%',
                render: (text, record) => (
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.showEditModal(record)}>编辑</Button>&emsp;
                        <Button type="reload" onClick={() => this.showEditPermissionModal(record)}>修改权限</Button>
                    </div>
                )
            },
        ];
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys) => this.setState({ selectedRowKeys }),
        };
        const { getFieldDecorator } = this.props.form;
        return(
            <div style={{ padding: 5 }}>
                <Card bordered={false}>
                    <Form layout='inline' style={{ marginBottom: 16 }}>
                        <Col span={6}>
                            <Form.Item label="综合搜索">
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
                        <Button type='danger' icon='delete' disabled={!selectedRowKeys.length} onClick={this.batchDelete}>批量删除</Button>
                    </div>
                    <Table
                        bordered
                        rowKey='id'
                        expandedRowRender={record =>
                            <div>
                                <Descriptions
                                    bordered
                                    column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                                >
                                    <Descriptions.Item label="拥有权限">
                                        <List
                                            bordered
                                            dataSource={record.permissions}
                                            renderItem={permission => (
                                                <List.Item>
                                                    {permission.permission}
                                                    &emsp;&emsp;
                                                    {permission.permissionName}
                                                </List.Item>
                                            )}
                                        />
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>
                        }
                        columns={columns}
                        dataSource={adminUsers}
                        loading={adminUsersLoading}
                        rowSelection={rowSelection}
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />
                </Card>
                <EditAccountPermissionModal onCancel={this.closeEditPermissionModal} visible={isShowEditPermissionModal}  adminUser={adminUser}/>
                <EditAccountModal onCancel={this.closeEditModal} visible={isShowEditModal}  adminUser={adminUser} roles = {roles} />
                <CreateAccountModal visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} roles = {roles} />
            </div>
        )
    }
}

export default Index;
