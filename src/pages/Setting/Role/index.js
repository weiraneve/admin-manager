import React from "react";
import {Button, Card, Col, Form, Input, message, Descriptions, Modal, notification, Table, List} from "antd";
import {del, get} from "../../../common/ajax";
import LoadableComponent from '../../../common/LoadableComponent'
const CreateRoleModal = LoadableComponent(import('./CreateRoleModal'), true);
const EditRoleModal = LoadableComponent(import('./EditRoleModal'), true);

@Form.create()
class Index extends React.Component {
    state = {
        roles: [],
        rolesLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
        isShowEditModal: false,
        role: {},
        selectedRowKeys: [],
        isShowCreateModal: false,
        permissions:[]
    };
    componentDidMount() {
        this.getRoles();
        this.getPermission();
    }
    getPermission = async () =>{
        const res = await get('/permission/findAll');
        if (res.code === 200) {
            this.setState({
                permissions: res.data
            });
        }
    };
    getRoles = async (page = 1) => {
        const { pagination } = this.state;
        const fields = this.props.form.getFieldsValue();
        this.setState({
            rolesLoading: true,
        });
        const res = await get('/role', {
            page: page,
            pageSize: this.state.pagination.pageSize,
            search: fields.search || ''
        });
        if (res.code !== 200) {
            this.setState({
                rolesLoading: false,
            });
            return
        }
        this.setState({
            rolesLoading: false,
            roles: res.data.list,
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
        this.getRoles(page.current)
    };

    /**
     * 批量删除
     */
    batchDelete = () => {
        Modal.confirm({
            title: '提示',
            content: '您确定批量删除勾选内容吗？',
            onOk: async () => {
                const res = await del('/role', {
                    ids: this.state.selectedRowKeys
                });
                if (res.code === 200) {
                    notification.success({
                        message: '删除成功',
                        description: res.msg,
                    });
                } else {
                    notification.error({
                        message: res.msg,
                        description: res.msg,
                    });
                }
                this.setState({
                    selectedRowKeys: []
                });
                this.getRoles()
            }
        })
    };

    /**
     * 创建modal
     * */
    toggleShowCreateModal = (visible) => {
        this.setState({
            isShowCreateModal: visible
        });
        this.getRoles();
    };

    /**
     * 修改modal
     * */
    showEditModal = (visible) =>{
        this.setState({
            isShowEditModal: true,
            role: visible
        })
    };

    /**
     * 关闭修改模态框
     */
    closeEditModal = () => {
        this.setState({
            isShowEditModal: false,
            role: {}
        });
        this.getRoles()
    };

    /**
     * 搜索函数
     */
    onSearch = () => {
        this.getRoles()
    };

    /**
     * 重置函数
     */
    onReset = () => {
        this.props.form.resetFields();
        this.setState({
            selectedRowKeys: []
        });
        this.getRoles();
        message.success('重置成功')
    };
    
    render() {
        const { roles, rolesLoading,permissions, pagination, role, selectedRowKeys,isShowEditModal, isShowCreateModal } = this.state;
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
                title: '角色',
                dataIndex: 'role',
                align: 'center'
            },
            {
                title: '角色名称',
                dataIndex: 'roleName',
                align: 'center'
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                width: '10%',
                render: (text, record) => (
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.showEditModal(record)}>编辑</Button>
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
                            <Form.Item label="角色搜索">
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
                        dataSource={roles}
                        loading={rolesLoading}
                        rowSelection={rowSelection}
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />
                </Card>
                <EditRoleModal onCancel={this.closeEditModal} visible={isShowEditModal}  role={role} permissions={permissions} />
                <CreateRoleModal visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} permissions={permissions} />
            </div>
        )
    }
}

export default Index;
