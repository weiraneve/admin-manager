import React from 'react'
import {Modal, Form, Upload, Icon, message, Input, Switch} from 'antd'
import { isAuthenticated } from '../../common/session'
import {del, put} from "../../common/ajax";
import {createFormField} from '../../common/util'


const form = Form.create({
    // 表单回显
    mapPropsToFields(props) {
        return createFormField(props.goods)
    }
});

@form
class EditGoodsModal extends React.Component {
    state = {
        uploading: false,
        img:{}
    };

    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.editGoods(values).then();
            }
        })
    };

    onCancel = () => {
        this.props.onCancel();
        //删除图片
        if (this.state.img.key && this.state.img.key.indexOf('http') === -1 ) {
            del('/upload', {key: this.state.img.key}).then();
        }
    };

    editGoods = async (values) => {
        const id = this.props.form.getFieldValue('id');
        const res = await put('/goods', {
            ...values,
            id: id
        });
        if (res.code === 200) {
            message.success('修改成功');
            this.setState({
                img:{}
            });
            this.props.onCancel()
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
        const { getFieldDecorator,getFieldValue} = this.props.form;
        const goodsImg = getFieldValue('goodsImg');
        const formItemLayout = {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 15
            },
        };
        // 图片上传
        const uploadProps = {
            name: "file",
            listType: "picture-card",
            headers: {
                Authorization: `${isAuthenticated()}`,
            },
            action: `${process.env.REACT_APP_BASE_URL}/upload?type=0`, // 0为上传图片类型
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
                        img: info.file.response.data
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
                visible={this.props.visible}
                onCancel={this.onCancel}
                width={550}
                centered
                onOk={this.handleOk}
                title='修改商品详情'
            >
                <div style={{ height: '50vh', overflow: 'auto' }}>
                    <Form {...formItemLayout}>

                        <Form.Item label="商品名称">
                            {getFieldDecorator('goodsName', {
                                validateFirst: getFieldValue('goodsName'),
                                rules: [
                                    { required: getFieldValue('goodsName'), message: '商品名称不能为空' }
                                ],
                            })(
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label={'图片'}>
                            {getFieldDecorator('goodsImg', {
                                rules: [{ message: '请上传图片' }],
                                getValueFromEvent: this._normFile,
                            })(
                                <Upload {...uploadProps} style={styles.urlUploader}>
                                    {goodsImg ?
                                        <img src={goodsImg} alt="商品图片" style={styles.goodsImg} />
                                        :
                                        <Icon style={styles.icon} type={uploading ? 'loading' : 'plus'} />
                                    }
                                </Upload>
                            )}
                        </Form.Item>

                        <Form.Item label="是否启用">
                            {getFieldDecorator('isUsing', {
                                initialValue: getFieldValue('isUsing'),
                                valuePropName: 'checked',
                            })(
                                <Switch checkedChildren="是" unCheckedChildren="否"/>
                            )}
                        </Form.Item>

                        <Form.Item label="商品标题">
                            {getFieldDecorator('goodsTitle', {
                                validateFirst: getFieldValue('goodsTitle'),
                                rules: [
                                    { required: getFieldValue('goodsTitle'), message: '商品标题不能为空' }
                                ],
                            })(
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label="商品价格">
                            {getFieldDecorator('goodsPrice', {
                                validateFirst: getFieldValue('goodsPrice'),
                                rules: [
                                    { required: getFieldValue('goodsPrice'), message: '商品价格不能为空' }
                                ],
                            })(
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label="商品库存">
                            {getFieldDecorator('goodsStock', {
                                validateFirst: getFieldValue('goodsStock'),
                                rules: [
                                    { required: getFieldValue('goodsStock'), message: '商品库存不能为空' }
                                ],
                            })(
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label="秒杀开始时间">
                            {getFieldDecorator('startTime', {
                                validateFirst: getFieldValue('startTime'),
                                rules: [
                                    { required: getFieldValue('startTime'), message: '秒杀开始时间不能为空' }
                                ],
                            })(
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label="秒杀结束时间">
                            {getFieldDecorator('endTime', {
                                validateFirst: getFieldValue('endTime'),
                                rules: [
                                    { required: getFieldValue('endTime'), message: '秒杀结束时间不能为空' }
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

const styles = {
    urlUploader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 250,
        height: 150,
        backgroundColor: '#fff'
    },
    icon: {
        fontSize: 28,
        color: '#999'
    },
    goodsImg: {
        maxWidth: '100%',
        maxHeight: '100%',
    },
};

export default EditGoodsModal