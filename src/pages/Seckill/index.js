import React from "react";
import {get} from "../../common/ajax";
import {
    Table,
    Card,
    Button,
    message, Col, Input, Form
} from 'antd'

@Form.create()
class Index extends React.Component {
    state = {
        seckill: [],
        seckillLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
    };

    componentDidMount() {
        this.getSeckill().then();
    }

    getSeckill = async (page = 1) => {
        const { pagination } = this.state;
        const fields = this.props.form.getFieldsValue();
        this.setState({
            seckillLoading: true,
        });
        const res = await get('/seckill', {
            page: page,
            pageSize: this.state.pagination.pageSize,
            goodsId: fields.goodsId || ''
        });
        if (res.code !== 200) {
            this.setState({
                seckillLoading: false,
            });
            return
        }
        this.setState({
            seckillLoading: false,
            seckill: res.data.list,
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
        this.getSeckill(page.current).then();
    };

    /**
     * 搜索函数
     */
    onSearch = () => {
        this.getSeckill().then();
    };

    /**
     * 重置函数
     */
    onReset = () => {
        this.props.form.resetFields();
        this.getSeckill().then();
        message.success('重置成功')
    };

    render() {
        const { seckill, seckillLoading, pagination } = this.state;
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
                title: '商品Id',
                dataIndex: 'goodsId',
                align: 'center'
            },
            {
                title: '剩余库存',
                dataIndex: 'stockCount',
                align: 'center'
            }
        ];
        const { getFieldDecorator } = this.props.form;
        return(
            <div style={{ padding: 5 }}>
                <Card bordered={false}>
                    <Form layout='inline' style={{ marginBottom: 16 }}>
                        <Col span={10}>
                            <Form.Item label="秒杀商品搜素">
                                {getFieldDecorator('goodsId')(
                                    <Input
                                        onPressEnter={this.onSearch}
                                        style={{ width: 200 }}
                                        placeholder="商品id"
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
                    <Table
                        style={{marginTop: '50px'}}
                        rowKey='id'
                        bordered
                        columns={columns}
                        dataSource={seckill}
                        loading={seckillLoading}
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />
                </Card>
            </div>
        )
    }
}

export default Index;
