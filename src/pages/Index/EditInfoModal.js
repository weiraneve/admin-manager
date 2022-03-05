import React from 'react'
import { Modal, Form, Upload, Icon, message, Input} from 'antd'
import { isAuthenticated } from '../../common/session'
import {del, patch} from "../../common/ajax";
import { setUser } from '../../store/actions'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createFormField } from '../../common/util'


const store = connect(
    (state) => ({ user: state.user}),
    (dispatch) => bindActionCreators({ setUser }, dispatch)
);
const form = Form.create({

    /**
     * 表单回显
     * @param {*} props
     */
    mapPropsToFields(props) {
        const user = props.user;
        return createFormField({
            ...user,
        })
    }
});

// 编辑个人信息
@store @form
class EditInfoModal extends React.Component {
    state = {
        uploading: false,
        avatar:{}
    };

    /**
     * 关闭模态框
     */
    handleCancel = () => {
        this.props.form.resetFields();
        this.props.toggleVisible(false);
        // 删除图片
        if (this.state.avatar.key && this.state.avatar.key.indexOf('http') === -1 ) {
            del('/upload', {key: this.state.avatar.key}).then();;
        }
    };

    /**
     * 模态框的确定按钮
     */
    handleOk = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.onUpdate(values)
            }
        });
    };

    /**
     * 更新用户信息
     */
    onUpdate = async (values) => {
        const param = {
            ...values,
            username: this.props.user.username
        };
        const res = await patch('/session/update', param);
        if (res.code === 200) {
            //修改redux中的user信息
            this.props.setUser(res.data);
            message.success('修改信息成功');
            this.handleCancel()
        }
    };

    /**
     * 转换上传组件表单的值
     */
    _normFile = (e) => {
        if (e.file.response && e.file.response.data) {
            return e.file.response.data.url
        } else {
            return ''
        }
    };
    
    render() {
        const { uploading } = this.state;
        const { visible } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const avatar = getFieldValue('avatar');
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        const uploadProps = {
            name: "file",
            listType: "picture-card",
            headers: {
                Authorization: `${isAuthenticated()}`,
            },
            action: `${process.env.REACT_APP_BASE_URL}/upload?type=1`,
            showUploadList: false,
            accept: "image/*",
            onChange: (info) => {
                if (info.file.status !== 'uploading') {
                    this.setState({
                        uploading: true
                    })
                }
                if (info.file.status === 'done') {
                    this.setState({
                        uploading: false,
                        avatar: info.file.response.data
                    });
                    message.success('上传图片成功')
                } else if (info.file.status === 'error') {
                    this.setState({
                        uploading: false
                    });
                    message.error(info.file.response.message || '上传图片失败')
                }
            }
        };
        return (
            <Modal
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                visible={visible}
                centered
                title="编辑个人信息">
                <div style={{ height: '40vh', overflow: 'auto' }}>
                    <Form>
                        <Form.Item label={'头像'} {...formItemLayout}>
                            {getFieldDecorator('avatar', {
                                rules: [{ required: true, message: '请上传用户头像' }],
                                getValueFromEvent: this._normFile,     //将上传的结果作为表单项的值（用normalize报错了，所以用的这个属性）
                            })(
                                <Upload {...uploadProps} style={styles.avatarUploader}>
                                    {avatar ? <img src={avatar} alt="avatar" style={styles.avatar} /> : <Icon style={styles.icon} type={uploading ? 'loading' : 'plus'} />}
                                </Upload>
                            )}
                        </Form.Item>
                        <Form.Item label={'用户名'} {...formItemLayout}>
                            {getFieldDecorator('name', {
                                validateFirst: true,
                                rules: [
                                    { required: true, message: '用户名不能为空' },
                                    { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                                    { min: 2, message: '用户名至少为2位' }
                                ]
                            })(
                                <Input placeholder="请输入用户名" />
                            )}
                        </Form.Item>
                        <Form.Item label={'电话'} {...formItemLayout}>
                            {getFieldDecorator('phone', {
                                // rules: [{ required: true, message: '请输入电话号码' }, { pattern: /^[0-9]*$/, message: '请输入正确的电话号码' }],
                            })(
                                <Input placeholder="请输入电话号码" />
                            )}
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        )
    }
}

const styles = {
    avatarUploader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 150,
        backgroundColor: '#fff'
    },
    icon: {
        fontSize: 28,
        color: '#999'
    },
    avatar: {
        maxWidth: '100%',
        maxHeight: '100%',
    },
};


export default EditInfoModal
