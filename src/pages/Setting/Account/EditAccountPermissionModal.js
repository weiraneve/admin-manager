import React from 'react'
import {Modal, Form, message, Tree} from 'antd'
import {createFormField} from "../../../common/util";
import {get, patch} from "../../../common/ajax";
const { TreeNode } = Tree;

const form = Form.create({
    //表单回显
    mapPropsToFields(props) {
        return createFormField(props.adminUser)
    }
});

@form
class EditAccountPermissionModal extends React.Component {
    state={
        permissions:[],
        expandedKeys:[],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: []
    };
    componentDidUpdate(prevProps, prevState, snapshot) {
        const permissions = this.props.adminUser.permissions;
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
    componentDidMount() {
        this.getPermission();
    }
    getPermission = async () =>{
        const res = await get('/permission/findAll');
        if (res.code === 200) {
            this.setState({
                permissions: res.data
            });
        } else {
            message.error(res.msg);
            this.onCancel()
        }
    };
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.editAdminUserPermission(values)
            }
        })
    };
    onCancel = () => {
       this.setState({
           expandedKeys: [],
           autoExpandParent: true,
           checkedKeys: [],
           selectedKeys: []
       });
        this.props.onCancel();
    };
    editAdminUserPermission = async () => {
        const id = this.props.form.getFieldValue('id');
        const res = await patch('/adminUser', {
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
                title='修改管理员权限'
            >
                <div style={{ height: '40vh', overflow: 'auto' }}>
                    <Form {...formItemLayout}>
                        <Form.Item label={'权限'} >
                            {getFieldDecorator('checkedKeys')(
                                <Tree
                                    style={{ height: '300px', overflow: 'auto'}}
                                    checkable
                                    onExpand={this.onExpand}
                                    expandedKeys={this.state.expandedKeys}
                                    autoExpandParent={this.state.autoExpandParent}
                                    onCheck={this.onCheck}
                                    checkedKeys={this.state.checkedKeys}
                                    onSelect={this.onSelect}
                                    selectedKeys={this.state.selectedKeys}
                                >
                                    {this.renderTreeNodes(this.state.permissions)}
                                </Tree>
                            )}
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default EditAccountPermissionModal
