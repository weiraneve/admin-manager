import React from 'react'
import {Modal, Form, message, Input, Tree} from 'antd'
import {createFormField} from "../../../common/util";
import {put} from "../../../common/ajax";
const { TreeNode } = Tree;

const form = Form.create({
    //表单回显
    mapPropsToFields(props) {
        return createFormField(props.role)
    }
});

@form
class EditRoleModal extends React.Component {
    state={
        expandedKeys:[],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: []
    };
    componentDidUpdate(prevProps, prevState, snapshot) {
        const permissions = this.props.role.permissions;
        const checkedKeys = [];
        if (permissions) {
            permissions.map(permission => {
                checkedKeys.push(permission.id)
                return permission.id;
            });
            if (this.state.checkedKeys.length === 0) {
                this.setState({
                    checkedKeys: checkedKeys
                })
            }
        }
    }
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.editRole(values)
            }
        })
    };
    onCancel = () => {
       this.setState({
           expandedKeys:[],
           autoExpandParent: true,
           checkedKeys: [],
           selectedKeys: []
       });
        this.props.onCancel();
    };
    editRole = async (values) => {
        const id = this.props.form.getFieldValue('id');
        const res = await put('/role', {
            ...values,
            id:id,
            permissionIds: this.state.checkedKeys
        });
        if (res.code === 200) {
            message.success('修改成功');
        }
        this.onCancel()
    };
    onExpand = expandedKeys => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };
    onCheck = checkedKeys => {
        this.setState({ checkedKeys });
    };
    onSelect = (selectedKeys, info) => {
        this.setState({ selectedKeys });
    };
    renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.permissionName} key={item.id} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id} title={item.permissionName} />;
        });
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
                title='修改角色'
            >
                <div style={{ height: '40vh', overflow: 'auto' }}>
                    <Form {...formItemLayout}>
                        <Form.Item label={'角色名称'}>
                            {getFieldDecorator('roleName',{
                                validateFirst: true,
                                rules: [
                                    { required: true, message: '角色名称不能为空' },
                                    { pattern: '^[^ ]+$', message: '角色名称不能有空格' }
                                ]
                            })(
                                <Input
                                    maxLength={32}
                                    placeholder="请输入角色名称"
                                />
                            )}
                        </Form.Item>
                        <Form.Item label={'角色'}>
                            {getFieldDecorator('role',{
                                validateFirst: true,
                                rules: [
                                    { required: true, message: '角色不能为空' },
                                    { pattern: '^[^ ]+$', message: '角色不能有空格' }
                                ]
                            })(
                                <Input
                                    maxLength={32}
                                    placeholder="请输入角色"
                                />
                            )}
                        </Form.Item>
                        <Form.Item label={'权限'} >
                            {getFieldDecorator('checkedKeys')(
                                <Tree
                                    style={{ height: '200px', overflow: 'auto'}}
                                    checkable
                                    onExpand={this.onExpand}
                                    expandedKeys={this.state.expandedKeys}
                                    autoExpandParent={this.state.autoExpandParent}
                                    onCheck={this.onCheck}
                                    checkedKeys={this.state.checkedKeys}
                                    onSelect={this.onSelect}
                                    selectedKeys={this.state.selectedKeys}
                                >
                                    {this.renderTreeNodes(this.props.permissions)}
                                </Tree>
                            )}
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default EditRoleModal
