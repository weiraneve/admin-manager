import React from 'react'
import { Modal, Input, Form, message } from 'antd'
import { connect } from 'react-redux'
import { createFormField } from '../../common/util'
import {post, patch} from "../../common/ajax";
import {authenticateSuccess} from "../../common/session";

const store = connect(
    (state) => ({ user: state.user }),
);
const form = Form.create({

    // 表单回显
    mapPropsToFields(props) {
        const user = props.user;
        return createFormField({
            username: user.username
        })
    }
});

// 修改管理用户密码
@store @form
class EditPasswordModal extends React.Component {
    handleCancel = () => {
        this.props.form.resetFields();
        this.props.toggleVisible(false)
    };

    /**
     * 模态框的确定按钮
     */
    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.onSubmit(values).then();
            }
        });
    };

    /**
     * 提交修改密码
     */
    onSubmit = async (values) => {
        const res = await post('/login', {
            username: values.username,
            password: values.oldPassword
        });
        if (res.code === 200) {
            const res2 = await patch('/session/updatePass', {
                username: values.username,
                password: values.password
            });
            if (res2.code === 200) {
                message.success('修改密码成功');
                this.handleCancel();
                //更新token
                authenticateSuccess('Bearer ' + res2.data);
            }
        }
    };

    render() {
        const { visible } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <Modal
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                visible={visible}
                centered
                title="修改密码">
                <Form>
                    <Form.Item label={'用户名'} {...formItemLayout}>
                        {getFieldDecorator('username', {})(
                            <Input disabled />
                        )}
                    </Form.Item>
                    <Form.Item label={'旧密码'} {...formItemLayout}>
                        {getFieldDecorator('oldPassword', {
                            rules: [{ required: true, message: '请输入旧密码' }],
                        })(
                            <Input
                                placeholder="请输入旧密码"
                                autoComplete="new-password"
                                type={'password'} />
                        )}
                    </Form.Item>
                    <Form.Item label={'新密码'} {...formItemLayout}>
                        {getFieldDecorator('password', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '密码不能为空' },
                                { pattern: '^[^ ]+$', message: '密码不能有空格' },
                                { min: 3, message: '密码至少为3位' },
                            ]
                        })(
                            <Input
                                placeholder="请输入新密码"
                                autoComplete="new-password"
                                type={'password'} />
                        )}
                    </Form.Item>
                    <Form.Item label={'确认密码'} {...formItemLayout}>
                        {getFieldDecorator('confirmPassword', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '请确认密码' },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value !== getFieldValue('password')) {
                                            callback('两次输入不一致！')
                                        }
                                        callback()
                                    }
                                },
                            ]
                        })(
                            <Input
                                onPressEnter={this.handleOk}
                                placeholder="请确认密码"
                                autoComplete="new-password"
                                type={'password'} />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

export default EditPasswordModal