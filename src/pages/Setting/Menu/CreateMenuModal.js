import React from 'react';
import {Modal, Form, Input, message, InputNumber, TreeSelect, Select, Popover, Icon} from 'antd'
import {post} from "../../../common/ajax";
import MenuIcon from "./MenuIcon";
const { Option } = Select;

@Form.create()
class CreateMenuModal extends React.Component {
    state={
       value: 0,
       level: 0,
       iconVisible:false,
       icon: undefined
    };
    onCancel = () => {
        this.props.form.resetFields();
        this.props.toggleVisible(false);
    };
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.createMenu(values)
            }
        })
    };
    createMenu = async (values) => {
        const res = await post('/roleMenu', {
            ...values,
            menuId: this.state.value,
            level: this.state.level
        });
        if (res.code === 200) {
            message.success('新增成功');
        }
        this.onCancel()
    };

    /**
     * 上级菜单选择事件
     * */
    onChange = (value,label, extra) => {
        this.setState({
            value: value ? value : 0,
            level: extra.triggerNode ? extra.triggerNode.props.level : 0
        });
    };

    /**
     * 图标选择显示/隐藏回调
     * */
    onVisibleChange = (value) =>{
     this.setState({
         iconVisible: value
     })
    };
    onSelectChange = (icon)=>{
        const { setFieldsValue } = this.props.form;
        this.setState({
            iconVisible: false,
            icon: icon
        });
        setFieldsValue({
            icon:icon
        })
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
                title='创建菜单'
                centered
                onOk={this.handleOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'上级菜单'}>
                        {getFieldDecorator('value')(
                            <TreeSelect
                                showSearch
                                style={{ width: '250px' }}
                                dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                                placeholder="请选择上级菜单"
                                allowClear
                                treeDefaultExpandAll
                                treeData={this.props.allMenus}
                                onChange={this.onChange}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={'当前类型'}>
                        {this.state.level === 0 ? '1级菜单':this.state.level+1 +'级菜单'}
                    </Form.Item>
                    <Form.Item label={'菜单名称'}>
                        {getFieldDecorator('name', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '菜单不能为空' },
                                { pattern: '^[^ ]+$', message: '菜单不能有空格' }
                            ]
                        })(
                            <Input
                                maxLength={32}
                                placeholder="请输入菜单"
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={'组键页面'}>
                        {getFieldDecorator('key',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: '组键页面不能为空' },
                                { pattern: '^[^ ]+$', message: '组键页面不能有空格' }
                            ]
                        })(
                            <Input
                                maxLength={32}
                                placeholder="请输入组键页面"
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={'菜单图标'}>
                        {getFieldDecorator('icon', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '请选择菜单图标' }
                            ]
                        })(
                            <Popover
                                placement="bottomLeft"
                                title={'菜单图标'}
                                content={<MenuIcon onSelectChange={this.onSelectChange}/>}
                                overlayStyle={{width:'400px'}}
                                trigger="click"
                                onVisibleChange={this.onVisibleChange}
                                visible={this.state.iconVisible}
                            >
                                <Input
                                    prefix= {<Icon type={this.state.icon ? this.state.icon:'question'} style={{color: 'rgba(0,0,0,.25)'}} />}
                                    style={{width:'400px'}}
                                    maxLength={32}
                                    value={this.state.icon}
                                    placeholder="请选择菜单图标"
                                />
                            </Popover>
                        )}
                    </Form.Item>
                    <Form.Item label={'权限'}>
                        {getFieldDecorator('permissionId', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '请选择权限' }
                            ]
                        })(
                            <Select
                                style={{ width: 200 }}
                                placeholder="请选择权限"
                            >
                                {this.props.permissions.map(per =>{
                                    return  <Option value={per.id} key={per.id}>{per.permissionName}</Option>
                                })}
                            </Select>,
                        )}
                    </Form.Item>
                    <Form.Item label={'排序'}>
                        {getFieldDecorator('sort', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '排序不能为空' }
                            ],
                            initialValue : 0,
                        })(
                            <InputNumber min={0}/>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default CreateMenuModal;
