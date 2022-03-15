import React from 'react'
import {Modal, Form, message, Input} from 'antd'
import {put} from "../../common/ajax";
import {createFormField} from '../../common/util'


const form = Form.create({
    // 表单回显
    mapPropsToFields(props) {
        return createFormField(props.rule)
    }
});

@form
class EditRuleModal extends React.Component {
    
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.editRule(values).then();
            }
        })
    };

    onCancel = () => {
        this.props.onCancel();
    };

    editRule = async (values) => {
        const id = this.props.form.getFieldValue('id');
        const res = await put('/rule', {
            ...values,
            id: id
        });
        if (res.code === 200) {
            message.success('修改成功');
            this.props.onCancel()
        } else {
            message.error('修改失败')
        }
    };


    render() {
        const { getFieldDecorator,getFieldValue} = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 15
            },
        };

        return (
            <Modal
                visible={this.props.visible}
                onCancel={this.onCancel}
                width={550}
                centered
                onOk={this.handleOk}
                title='修改商品详情'
            >
                <div style={{ height: '50vh', overflow: 'auto' }}>
                    <Form {...formItemLayout}>

                        <Form.Item label="规定逾期年份">
                            {getFieldDecorator('exceedYear', {
                                validateFirst: getFieldValue('exceedYear'),
                                rules: [
                                    { required: getFieldValue('exceedYear'), message: '规定逾期年份不能为空' }
                                ],
                            })(
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label="规定逾期次数">
                            {getFieldDecorator('exceedCount', {
                                validateFirst: getFieldValue('exceedCount'),
                                rules: [
                                    { required: getFieldValue('exceedCount'), message: '规定逾期次数不能为空' }
                                ],
                            })(
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label="规定逾期金额">
                            {getFieldDecorator('exceedMoney', {
                                validateFirst: getFieldValue('exceedMoney'),
                                rules: [
                                    { required: getFieldValue('exceedMoney'), message: '规定逾期金额不能为空' }
                                ],
                            })(
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label="规定逾期天数之内还清">
                            {getFieldDecorator('exceedDay', {
                                validateFirst: getFieldValue('exceedDay'),
                                rules: [
                                    { required: getFieldValue('exceedDay'), message: '规定逾期天数之内还清不能为空' }
                                ],
                            })(
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label="限定客户年龄">
                            {getFieldDecorator('limitAge', {
                                validateFirst: getFieldValue('limitAge'),
                                rules: [
                                    { required: getFieldValue('limitAge'), message: '限定客户年龄不能为空' }
                                ],
                            })(
                                <Input />
                            )}
                        </Form.Item>

                    </Form>
                </div>
            </Modal>
        );
    }
}

export default EditRuleModal