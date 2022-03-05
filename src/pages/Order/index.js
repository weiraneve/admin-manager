import React from "react";
import {
    Table,
    Card,
    Button,
    message, Col, Input, Form
} from 'antd'
import moment from 'moment'
import ExportJsonExcel from "js-export-excel"
import {get} from "../../common/ajax";

@Form.create()
class Order extends React.Component {
    state = {
        order: [],
        orderLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
    };

    componentDidMount() {
        this.getOrder().then();
    }

    getOrder = async (page = 1) => {
        const { pagination } = this.state;
        const fields = this.props.form.getFieldsValue();
        this.setState({
            orderLoading: true,
        });
        const res = await get('/order', {
            page: page,
            pageSize: this.state.pagination.pageSize,
            id: fields.id || ''
        });
        if (res.code !== 200) {
            this.setState({
                orderLoading: false,
            });
            return
        }
        this.setState({
            orderLoading: false,
            order: res.data.list,
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
        this.getOrder(page.current).then();
    };

    /**
     * 搜索函数
     */
    onSearch = () => {
        this.getOrder().then();
    };

    /**
     * 重置函数
     */
    onReset = () => {
        this.props.form.resetFields();
        this.getOrder().then();;
        message.success('重置成功')
    };

    /**
     * 导出
     * */
    handleExport = () => {
        const { order } = this.state;
        const option = {};
        const columns = [
            {
                title: '订单id',
                dataIndex: 'id',
            },
            {
                title: '用户id',
                dataIndex: 'userId',
            },
            {
                title: '商品id',
                dataIndex: 'goodsId',
            },
            {
                title: '订单创建时间',
                dataIndex: 'createdAt',
            },
            {
                title: '订单更新时间',
                dataIndex: 'updatedAt',
            },
        ];
        option.fileName = 'order';
        option.datas = [
            {
                sheetData: order.map(item => {
                    const result = {};
                    columns.forEach(c => {
                        switch (c.dataIndex) {
                            default:
                                result[c.dataIndex] = item[c.dataIndex];
                        }
                    });
                    return result;
                }),
                sheetName: 'order',     // Excel文件名称
                sheetFilter: columns.map(item => item.dataIndex),
                sheetHeader: columns.map(item => item.title),
                columnWidths: columns.map(() => 10),
            },
        ];
        const toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    };

    render() {
        const { order, orderLoading, pagination} = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '订单id',
                dataIndex: 'id',
                align: 'center',
            },
            {
                title: '用户id',
                dataIndex: 'userId',
                align: 'center',
            },
            {
                title: '商品id',
                dataIndex: 'goodsId',
                align: 'center',
            },
            {
                title: '订单创建时间',
                dataIndex: 'createdAt',
                align: 'center',
                render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
                title: '订单更新时间',
                dataIndex: 'updatedAt',
                align: 'center',
                render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
            }
        ];
        return(
            <div style={{ padding: 5 }}>
                <Card bordered={false}>
                    <Form layout='inline' style={{ marginBottom: 16 }}>
                        <Col span={6}>
                            <Form.Item label="订单搜索">
                                {getFieldDecorator('id')(
                                    <Input
                                        onPressEnter={this.onSearch}
                                        style={{ width: 200 }}
                                        placeholder="订单id"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item style={{ marginRight: 0, width: '100%'}} wrapperCol={{ span: 24 }}>
                                <div style={{ textAlign: 'right' }}>
                                    <Button type="primary" icon='search' onClick={this.onSearch}>搜索</Button>&emsp;
                                    <Button icon="reload" onClick={this.onReset}>重置</Button>
                                </div>
                            </Form.Item>
                        </Col>
                    </Form>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type="primary" icon='export' onClick={this.handleExport}>导出</Button>
                    </div>
                    <Table
                        style={{marginTop: '50px'}}
                        rowKey='id'
                        bordered
                        columns={columns}
                        dataSource={order}
                        loading={orderLoading}
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />
                </Card>
            </div>
        )
    }
}

export default Order;
