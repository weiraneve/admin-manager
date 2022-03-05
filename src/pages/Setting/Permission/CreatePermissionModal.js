import React from 'react';
import {Modal, Form, Input, message} from 'antd'
import {post} from "../../../common/ajax";

@Form.create()
class CreatePermissionModal extends React.Component {
    onCancel = () => {
        this.props.form.resetFields();
        this.props.toggleVisible(false);
    };
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.createPermission(values)
            }
        })
    };
    createPermission = async (values) => {
        const res = await post('/permission', {
            ...values
        });
        if (res.code === 200) {
            message.success('新增成功');
        }
        this.onCancel()
    };
    
    render() {
        const { visible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
        };
        return (
            <Modal
                onCancel={this.onCancel}
                visible={visible}
                width={550}
                title='创建权限'
                centered
                onOk={this.handleOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'权限'}>
                        {getFieldDecorator('permission',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: '行业不能为空' },
                                { pattern: '^[^ ]+$', message: '行业不能有空格' }
                            ]
                        })(
                            <Input
                                maxLength={32}
                                placeholder="请输入权限"
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={'权限名称'}>
                        {getFieldDecorator('permissionName', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '行业不能为空' },
                                { pattern: '^[^ ]+$', message: '行业不能有空格' }
                            ]
                        })(
                            <Input
                                maxLength={32}
                                placeholder="请输入权限名称"
                            />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default CreatePermissionModal;
