import React from 'react';
import {Modal, Form, Input, message, Upload, Icon, Switch} from 'antd'
import {del, post} from '../../common/ajax'
import {isAuthenticated} from "../../common/session";

@Form.create()
class CreateGoodsModel extends React.Component {
    state = {
        uploading: false,
        img:{}
    };

    onCancel = () => {
        this.props.form.resetFields();
        this.props.toggleVisible(false);
        // 删除图片
        if (this.state.img.key && this.state.img.key.indexOf('http') === -1 ) {
            del('/upload', {key: this.state.img.key}).then();
        }
    };

    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.createGoods(values).then();
            }
        })
    };

    createGoods = async (values) => {
        const res = await post('/goods', {
            ...values
        });
        if (res.code === 200) {
            message.success('新增成功');
            this.setState({
                    img:{}
                }
            );
            this.onCancel()
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
        const uploadProps = {
            name: "file",
            listType: "picture-card",
            headers: {
                Authorization: `${isAuthenticated()}`,
            },
            action: `${process.env.REACT_APP_BASE_URL}/upload?type=0`,
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
        const { uploading } = this.state;
        const { visible } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const  goodsImg = getFieldValue('goodsImg');
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
        };
        return (
            <Modal
                onCancel={this.onCancel}
                visible={visible}
                width={550}
                title='创建商品'
                centered
                onOk={this.handleOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'商品名'}>
                        {getFieldDecorator('goodsName', {
                            validateFirst: getFieldValue('goodsName'),
                            rules: [
                                { required: true, message: '商品名不能为空' },
                            ],
                        })(
                            <Input
                                maxLength={255}
                                placeholder="请输入商品名"
                            />
                        )}
                    </Form.Item>

                    <Form.Item label={'图片'}>
                        {getFieldDecorator('goodsImg', {
                            validateFirst: getFieldValue('goodsImg'),
                            rules: [
                                { required: false, message: '图片不能为空' },
                            ],
                            getValueFromEvent: this._normFile,
                        })(
                            <Upload {...uploadProps} style={styles.urlUploader}>
                                {goodsImg ?
                                    <img src={goodsImg} alt="商品图片" style={styles.goodsImg} />
                                    :
                                    <div>
                                        <div style={styles.hint}>
                                            最佳像素 750 x 420
                                        </div>
                                        <Icon style={styles.icon} type={uploading ? 'loading' : 'plus'} />
                                    </div>
                                }
                            </Upload>
                        )}
                    </Form.Item>

                    <Form.Item label={'是否启用'}>
                        {getFieldDecorator('isUsing',{
                            initialValue: 0
                        })(
                            <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked={false}/>
                        )}
                    </Form.Item>

                    <Form.Item label="商品标题">
                        {getFieldDecorator('goodsTitle', {
                            validateFirst: getFieldValue('goodsTitle'),
                            rules: [
                                { required: true, message: '商品标题不能为空' },
                            ],
                        })(
                            <Input />
                        )}
                    </Form.Item>

                    <Form.Item label="商品价格">
                        {getFieldDecorator('goodsPrice', {
                            validateFirst: getFieldValue('goodsPrice'),
                            rules: [
                                { required: true, message: '商品价格不能为空' },
                            ],
                        })(
                            <Input />
                        )}
                    </Form.Item>

                    <Form.Item label="商品库存">
                        {getFieldDecorator('goodsStock', {
                            validateFirst: getFieldValue('goodsStock'),
                            rules: [
                                { required: true, message: '商品库存不能为空' },
                            ],
                        })(
                            <Input />
                        )}
                    </Form.Item>

                    <Form.Item label="秒杀开始时间">
                        {getFieldDecorator('startTime', {
                            validateFirst: getFieldValue('startTime'),
                            rules: [
                                { required: true, message: '秒杀开始时间不能为空' },
                            ],
                        })(
                            <Input />
                        )}
                    </Form.Item>

                    <Form.Item label="秒杀结束时间">
                        {getFieldDecorator('endTime', {
                            validateFirst: getFieldValue('endTime'),
                            rules: [
                                { required: true, message: '秒杀结束时间不能为空' },
                            ],
                        })(
                            <Input />
                        )}
                    </Form.Item>

                </Form>
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
    hint:{
        fontSize: 10,
        color: '#999'
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

export default CreateGoodsModel;
