import React from "react";
import {del, get} from "../../common/ajax";
import {
    Table,
    Card,
    Button,
    Icon,
    Modal,
    Popconfirm,
    notification,
    Switch, message, Col, Input, Form
} from 'antd'
import EditGoodsModal from "./EditGoodsModel";
import CreateGoodsModal from "./CreateGoodsModel";

@Form.create()
class Goods extends React.Component {
    
    state = {
        goods: [],
        goodsLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
        isShowEditModal: false,
        goodsInfo: {},
        selectedRowKeys: [],
        isShowCreateModal: false
    };

    componentDidMount() {
        this.getGoods().then();
    }

    getGoods = async (page = 1) => {
        const { pagination } = this.state;
        const fields = this.props.form.getFieldsValue();
        this.setState({
            goodsLoading: true,
        });
        const res = await get('/goods', {
            page: page,
            pageSize: this.state.pagination.pageSize,
            goodsName: fields.goodsName || ''
        });
        if (res.code !== 200) {
            this.setState({
                goodsLoading: false,
            });
            return
        }
        this.setState({
            goodsLoading: false,
            goods: res.data.list,
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
        this.getGoods(page.current).then();
    };

    /**
     * 批量删除
     */
    batchDelete = () => {
        Modal.confirm({
            title: '提示',
            content: '您确定批量删除勾选内容吗？',
            onOk: async () => {
                const res = await del('/goods/deletes', {
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
                    this.getGoods().then();
                }
            }
        })
    };

    /**
     * 单条删除
     */
    singleDelete = async (record) => {
        const res = await del(`/goods/${record.id}`);
        if (res.code === 200) {
            notification.success({
                message: '删除成功',
                description: res.msg,
            });
            this.setState({
                selectedRowKeys: []
            });
            this.getGoods().then();
        }
    };

    /**
     * 开关
     * */
    switch = async (record) =>{
        const res = await get('/goods/updateUsing/' + record.id);
        if (res.code === 200) {
            notification.success({
                message: '修改成功',
                description: res.msg,
            });
            this.getGoods().then();
        }
    };

    /**
     * 创建modal
     * */
    toggleShowCreateModal = (visible) => {
        this.setState({
            isShowCreateModal: visible
        });
        this.getGoods().then();
    };

    /**
     * 修改modal
     * */
    showEditModal = (visible) =>{
        this.setState({
            isShowEditModal: true,
            goodsInfo: visible
        })
    };

    /**
     * 关闭修改模态框
     */
    closeEditModal = () => {
        this.setState({
            isShowEditModal: false,
            goodsInfo: {}
        });
        this.getGoods().then();
    };
    
    /**
     * 搜索函数
     */
    onSearch = () => {
        this.getGoods().then();
    };

    /**
     * 重置函数
     */
    onReset = () => {
        this.props.form.resetFields();
        this.getGoods().then();
        this.setState({
            selectedRowKeys: []
        });
        message.success('重置成功')
    };

    render() {
        const { goods, goodsLoading, pagination, goodsInfo, selectedRowKeys,isShowEditModal, isShowCreateModal } = this.state;
        const columns = [
            {
                title: '序号',
                key: 'id',
                align: 'center',
                render: (text, record, index) => {
                    let num = (pagination.current - 1) * pagination.pageSize + index + 1;
                    if (num < pagination.pageSize) {
                        num = '0' + num
                    }
                    return num
                }
            },
            {
                title: '商品名称',
                dataIndex: 'goodsName',
                align: 'center',
                render: (text) => text ? text : '未设置',
            },
            {
                title: '商品图片链接',
                dataIndex: 'goodsImg',
                align: 'center',
                render: (text) => <img style={{height:'100px',width:'200px'}} src={text} alt={''}/>,
            },
            {
                title: '是否启用',
                dataIndex: 'isUsing',
                align: 'center',
                render:(text, record) => (
                    <Switch onClick = {()=>this.switch(record)} checkedChildren="是" unCheckedChildren="否" defaultChecked={text}/>
                )
            },
            {
                title: '商品标题',
                dataIndex: 'goodsTitle',
                align: 'center',
                render: (text) => text ? text : '未设置',
            },
            {
                title: '商品价格',
                dataIndex: 'goodsPrice',
                align: 'center',
                render: (text) => text ? text : '未设置',
            },
            {
                title: '商品库存',
                dataIndex: 'goodsStock',
                align: 'center',
                render: (text) => text ? text : '未设置',
            },
            {
                title: '秒杀开始时间',
                dataIndex: 'startTime',
                align: 'center',
                render: (text) => text ? text : '未设置',
            },
            {
                title: '秒杀结束时间',
                dataIndex: 'endTime',
                align: 'center',
                render: (text) => text ? text : '未设置',
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                render: (text, record) => (
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.showEditModal(record)}>编辑</Button>
                        &emsp;
                        <Popconfirm title='您确定删除当前内容吗？' onConfirm={() => this.singleDelete(record)}>
                            <Button type="danger">
                                <Icon type='delete' />
                                删除
                            </Button>
                        </Popconfirm>
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
                            <Form.Item label="商品搜索">
                                {getFieldDecorator('goodsName')(
                                    <Input
                                        onPressEnter={this.onSearch}
                                        style={{ width: 200 }}
                                        placeholder="商品名称"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item style={{ marginRight: 0, width: '100%'}} wrapperCol={{ span: 24 }}>
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
                        dataSource={goods}
                        loading={goodsLoading}
                        rowSelection={rowSelection}
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />
                </Card>
                <EditGoodsModal onCancel={this.closeEditModal} visible={isShowEditModal}  goods={goodsInfo}/>
                <CreateGoodsModal visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} />
            </div>
        )
    }
}

export default Goods;
