import React from "react";
import {
    Table,
    Card,
    Button,
    message, Col, Input, Form, Tag
} from 'antd'
import moment from 'moment'
import ExportJsonExcel from "js-export-excel"
import {get} from "../../common/ajax";

@Form.create()
class Sift extends React.Component {
    state = {
        sift: [],
        siftLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
    };
    componentDidMount() {
        this.getSift().then();
    }
    getSift = async (page = 1) => {
        const { pagination } = this.state;
        const fields = this.props.form.getFieldsValue();
        this.setState({
            siftLoading: true,
        });
        const res = await get('/sift', {
            page: page,
            pageSize: this.state.pagination.pageSize,
            userId: fields.userId || ''
        });
        if (res.code !== 200) {
            this.setState({
                siftLoading: false,
            });
            return
        }
        this.setState({
            siftLoading: false,
            sift: res.data.list,
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
        this.getSift(page.current).then();
    };

    /**
     * 搜索函数
     */
    onSearch = () => {
        this.getSift().then();
    };

    /**
     * 重置函数
     */
    onReset = () => {
        this.props.form.resetFields();
        this.getSift().then();
        message.success('重置成功')
    };

    /**
     * 导出
     * */
    handleExport = () => {
        const { sift } = this.state;
        const option = {};
        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
            },
            {
                title: '用户id',
                dataIndex: 'userId',
            },
            {
                title: '初筛是否通过',
                dataIndex: 'siftPass',
            },
            {
                title: '身份证号',
                dataIndex: 'identityCardId',
            },
            {
                title: '用户最初创建时间',
                dataIndex: 'createdAt',
            },
            {
                title: '用户登录更新时间',
                dataIndex: 'updatedAt',
            },
        ];
        option.fileName = 'sift';
        option.datas = [
            {
                sheetData: sift.map(item => {
                    const result = {};
                    columns.forEach(c => {
                        // 布尔值不能直接写入表格
                        if (c.dataIndex === 'siftPass') {
                            item[c.dataIndex] === true ? result[c.dataIndex] = '通过' : result[c.dataIndex] = '不通过';
                        } else {
                            result[c.dataIndex] = item[c.dataIndex];
                        }
                    });
                    return result;
                }),
                sheetName: 'sift',     // Excel文件名称
                sheetFilter: columns.map(item => item.dataIndex),
                sheetHeader: columns.map(item => item.title),
                columnWidths: columns.map(() => 10),
            },
        ];
        const toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    };

    render() {
        const { sift, siftLoading, pagination} = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                align: 'center',
            },
            {
                title: '用户id',
                dataIndex: 'userId',
                align: 'center',
            },
            {
                title: '初筛是否通过',
                dataIndex: 'siftPass',
                align: 'center',
                render: (text) => {
                    if (text === true) {
                        return <Tag color="#87d068">通过</Tag>
                    } else {
                        return <Tag color="#2db7f5">不通过</Tag>
                    }
                }
            },
            {
                title: '身份证号',
                dataIndex: 'identityCardId',
                align: 'center',
            },
            {
                title: '用户最初创建时间',
                dataIndex: 'createdAt',
                align: 'center',
                render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
                title: '用户登录更新时间',
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
                            <Form.Item label="用户搜索">
                                {getFieldDecorator('userId')(
                                    <Input
                                        onPressEnter={this.onSearch}
                                        style={{ width: 200 }}
                                        placeholder="用户id"
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
                        dataSource={sift}
                        loading={siftLoading}
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />
                </Card>
            </div>
        )
    }
}

export default Sift;