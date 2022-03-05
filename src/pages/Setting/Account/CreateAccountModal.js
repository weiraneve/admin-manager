import React from 'react';
import {Modal, Form, Input, message, Switch,Select} from 'antd'
import {post} from "../../../common/ajax";
const { Option } = Select;

@Form.create()
class CreateAccountModal extends React.Component {
    onCancel = () => {
        this.props.form.resetFields();
        this.props.toggleVisible(false);
    };
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.createAccount(values)
            }
        })
    };
    createAccount = async (values) => {
        const res = await post('/adminUser', {
            ...values
        });
        if (res.code === 200) {
            message.success('新增成功');
        }
        this.onCancel()
    };

    /**
     * 模态框的确定按钮
     */
    handlePasswordOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.onSubmit(values)
            }
        });
    };
    
    render() {
        const { visible } = this.props;
        const { getFieldDecorator,getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
        };
        return (
            <Modal
                onCancel={this.onCancel}
                visible={visible}
                width={550}
                title='创建管理员'
                centered
                onOk={this.handleOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'账号'}>
                        {getFieldDecorator('username',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: '账号不能为空' },
                                { pattern: '^[^ ]+$', message: '账号不能有空格' }
                            ]
                        })(
                            <Input
                                maxLength={32}
                                placeholder="请输入账号"
                            />
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
                                onPressEnter={this.handlePasswordOk}
                                placeholder="请确认密码"
                                autoComplete="new-password"
                                type={'password'} />
                        )}
                    </Form.Item>
                    <Form.Item label={'角色'}>
                        {getFieldDecorator('roleId', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '请选择权限' }
                            ]
                        })(
                            <Select
                                style={{ width: 200 }}
                                placeholder="请选择权限"
                            >
                                {this.props.roles.map(role =>{
                                    return  <Option value={role.id} key={role.id}>{role.roleName}</Option>
                                })}
                            </Select>,
                        )}
                    </Form.Item>
                    <Form.Item label={'昵称'}>
                        {getFieldDecorator('name',{
                            rules: [
                                { pattern: '^[^ ]+$', message: '昵称不能有空格' }
                            ]
                        })(
                            <Input
                                maxLength={32}
                                placeholder="请输入昵称"
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={'手机号'}>
                        {getFieldDecorator('phone',{
                            rules: [
                                { pattern: '^[^ ]+$', message: '手机号不能有空格' }
                            ]
                        })(
                            <Input
                                maxLength={32}
                                placeholder="请输入手机号"
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={'是否启用'}>
                        {getFieldDecorator('isBan',{
                            initialValue: 1
                        })(
                            <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked/>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default CreateAccountModal;
