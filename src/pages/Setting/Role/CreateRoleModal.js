import React from 'react';
import {Modal, Form, Input, message, Tree} from 'antd'
import {post} from "../../../common/ajax";
const { TreeNode } = Tree;

@Form.create()
class CreateRoleModal extends React.Component {
    state={
        expandedKeys:[],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
    };
    onCancel = () => {
        this.props.form.resetFields();
        this.props.toggleVisible(false);
    };
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.createRole(values)
            }
        })
    };
    createRole = async (values) => {
        const res = await post('/role', {
            ...values,
            permissionIds: this.state.checkedKeys
        });
        if (res.code === 200) {
            message.success('新增成功');
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
                title='创建角色'
                centered
                onOk={this.handleOk}
            >
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
                        {getFieldDecorator('permissionIds')(
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
            </Modal>
        );
    }
}

export default CreateRoleModal;
