import React from 'react'
import {Modal, Form,message, Input} from 'antd'
import {createFormField} from "../../../common/util";
import {put} from "../../../common/ajax";

const form = Form.create({
    //表单回显
    mapPropsToFields(props) {
        return createFormField(props.permission)
    }
});

@form
class EditPermissionModal extends React.Component {
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.editPermission(values)
            }
        })
    };
    onCancel = () => {
        this.props.onCancel();
    };
    editPermission = async (values) => {
        const id = this.props.form.getFieldValue('id');
        const res = await put('/permission', {
            ...values,
            id: id
        });
        if (res.code === 200) {
            message.success('修改成功');
        }
        this.onCancel()
    };
    
    render() {
        const { getFieldDecorator} = this.props.form;
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
                title='修改权限'
            >
                <div style={{ height: '20vh', overflow: 'auto' }}>
                    <Form {...formItemLayout}>
                        <Form.Item label="权限">
                            {getFieldDecorator('permission', {
                                validateFirst:true,
                                rules: [
                                    { required: true, message: '权限不能为空' }
                                ],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="权限名称">
                            {getFieldDecorator('permissionName', {
                                validateFirst: true,
                                rules: [
                                    { required: true, message: '权限名称不能为空' }
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

export default EditPermissionModal
