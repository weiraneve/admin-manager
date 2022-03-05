import React from 'react'
import {Modal, Form,message, Input, Switch, Select} from 'antd'
import {put} from "../../../common/ajax";
import {createFormField} from "../../../common/util";
const { Option } = Select;

const form = Form.create({

    //表单回显
    mapPropsToFields(props) {
        if (props.adminUser.roles) {
            props.adminUser.roleId = props.adminUser.roles[0].id;
        }
        return createFormField(props.adminUser)
    }
});

@form
class EditAccountModal extends React.Component {
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.editAdminUser(values).then();
            }
        })
    };
    onCancel = () => {
        this.props.onCancel();
    };
    editAdminUser = async (values) => {
        const id = this.props.form.getFieldValue('id');
        const res = await put('/adminUser', {
            ...values,
            id: id
        });
        if (res.code === 200) {
            message.success('修改成功');
        }
        this.onCancel()
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
                title='修改管理员信息'
            >
                <div style={{ height: '50vh', overflow: 'auto' }}>
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
                </div>
            </Modal>
        );
    }
}

export default EditAccountModal
