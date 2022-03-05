import React from 'react'
import {
    Table,
    Card,
    Button,
    message, Col, Input, Form, Modal, notification
} from 'antd'
import {del, get} from "../../../common/ajax";
import CreatePermissionModal from "./CreatePermissionModal";
import EditPermissionModal from "./EditPermissionModal";

@Form.create()
class Index extends React.Component {
    state = {
        permissions: [],
        permissionsLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
        isShowEditModal: false,
        permission: {},
        selectedRowKeys: [],
        isShowCreateModal: false
    };
    componentDidMount() {
        this.getPermissions()
    }
    getPermissions = async (page = 1) => {
        const { pagination } = this.state;
        const fields = this.props.form.getFieldsValue();
        this.setState({
            permissionsLoading: true,
        });
        const res = await get('/permission', {
            page: page,
            pageSize: this.state.pagination.pageSize,
            search: fields.search || ''
        });
        if (res.code !== 200) {
            this.setState({
                permissionsLoading: false,
            });
            return
        }
        this.setState({
            permissionsLoading: false,
            permissions: res.data.list,
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
        this.getPermissions(page.current)
    };

    /**
     * 批量删除
     */
    batchDelete = () => {
        Modal.confirm({
            title: '提示',
            content: '您确定批量删除勾选内容吗？',
            onOk: async () => {
                const res = await del('/permission', {
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
                this.getPermissions()
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
        this.getPermissions();
    };

    /**
     * 修改modal
     * */
    showEditModal = (visible) =>{
        this.setState({
            isShowEditModal: true,
            permission: visible
        })
    };

    /**
     * 关闭修改模态框
     */
    closeEditModal = () => {
        this.setState({
            isShowEditModal: false,
            permission: {}
        });
        this.getPermissions()
    };

    /**
     * 搜索函数
     */
    onSearch = () => {
        this.getPermissions()
    };

    /**
     * 重置函数
     */
    onReset = () => {
        this.props.form.resetFields();
        this.setState({
            selectedRowKeys: []
        });
        this.getPermissions();
        message.success('重置成功')
    };
    
    render() {
        const { permissions, permissionsLoading, pagination, permission, selectedRowKeys,isShowEditModal, isShowCreateModal } = this.state;
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
                title: '权限',
                dataIndex: 'permission',
                align: 'center'
            },
            {
                title: '权限名称',
                dataIndex: 'permissionName',
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
                            <Form.Item label="权限搜索">
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
                        columns={columns}
                        dataSource={permissions}
                        loading={permissionsLoading}
                        rowSelection={rowSelection}
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />
                </Card>
                <EditPermissionModal onCancel={this.closeEditModal} visible={isShowEditModal}  permission={permission}/>
                <CreatePermissionModal visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} />
            </div>
        )
    }
}

export default Index;
