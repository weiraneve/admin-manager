import React from "react";
import {
    Table,
    Card,
    Button,
    message, Form
} from 'antd'
import {get} from "../../common/ajax";
import EditRuleModel from "../Rule/EditRuleModel";

@Form.create()
class Rule extends React.Component {
    
    state = {
        rule: [],
        ruleInfo: {},
    };

    componentDidMount() {
        this.getRule().then();
    }

    getRule = async () => {
        const res = await get('/rule');
        if (res.code !== 200) {
            message.error("服务端请求异常")
            return;
        }
        if (res.code === 200) {
            this.setState({
                rule: res.data,
            })
        }        
        
    };

    /**
     * 修改modal
     * */
    showEditModal = (visible) =>{
        this.setState({
            isShowEditModal: true,
            ruleInfo: visible
        })
    };

    /**
     * 关闭修改模态框
     */
    closeEditModal = () => {
        this.setState({
            isShowEditModal: false,
            ruleInfo: {}
        });
        this.getRule().then();
    };

    render() {
        const { rule, ruleInfo } = this.state;
        const columns = [
            {
                title: '规定逾期年份',
                dataIndex: 'exceedYear',
                align: 'center',
            },
            {
                title: '规定逾期次数',
                dataIndex: 'exceedCount',
                align: 'center',
            },
            {
                title: '规定逾期金额',
                dataIndex: 'exceedMoney',
                align: 'center',
            },
            {
                title: '规定逾期天数之内还清',
                dataIndex: 'exceedDay',
                align: 'center',
            },
            {
                title: '限定客户年龄',
                dataIndex: 'limitAge',
                align: 'center',
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                render: (text, record) => (
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.showEditModal(record)}>编辑</Button>
                    </div>
                )
            },
        ];
        return(
            <div style={{ padding: 5 }}>
                <Card bordered={false}>
                    <Table
                        style={{marginTop: '50px'}}
                        rowKey='id'
                        bordered
                        columns={columns}
                        dataSource={rule}
                    />
                </Card>
                <EditRuleModel onCancel={this.closeEditModal} visible={this.state.isShowEditModal}  rule={ruleInfo}/>
            </div>
        )
    }
}

export default Rule;
