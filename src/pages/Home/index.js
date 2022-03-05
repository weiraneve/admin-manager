import React from 'react'
import 'animate.css'
import {BorderBox1, BorderBox8, DigitalFlop} from '@jiaminghi/data-view-react'
import {get} from "../../common/ajax";

/**
 * 首页
 *
 * DataV-React 详细介绍官方文档 http://datav-react.jiaminghi.com/guide/
 * */
class Home extends React.Component {
    state={
        goodsCount: 0,
        seckillCount: 0,
        orderCount: 0,
        siftCount: 0
    };
   componentDidMount() {
       this.getWelcome().then();
   }

   getWelcome = async () => {
       const res = await get('/welcome');
       if (res.code === 200) {
           this.setState({
               goodsCount: res.data.goodsCount,
               seckillCount: res.data.seckillCount,
               orderCount: res.data.orderCount,
               siftCount: res.data.siftCount,
           })
       }
   };

    render() {
        const goodsConfig = {
            number: [this.state.goodsCount],
            content: '商品数{nt}个',
            style: {
                fontSize: 20,
            }
        };
        const seckillConfig = {
            number: [this.state.seckillCount],
            content: '秒杀商品数{nt}个',
            style: {
                fontSize: 20,
            }
        };
        const orderConfig = {
            number: [this.state.orderCount],
            content: '订单数{nt}个',
            style: {
                fontSize: 20,
            }
        };
        const siftConfig = {
            number: [this.state.siftCount],
            content: '用户初筛数{nt}个',
            style: {
                fontSize: 20,
            }
        };
        return(
            <BorderBox1 style={styles.BorderBox1}>
                <BorderBox8 style={styles.BorderBox11}>
                    <DigitalFlop config={goodsConfig} style={styles.DigitalFlop} />
                </BorderBox8>
                <BorderBox8 style={styles.BorderBox11}>
                    <DigitalFlop config={seckillConfig} style={styles.DigitalFlop} />
                </BorderBox8>
                <BorderBox8 style={styles.BorderBox11}>
                    <DigitalFlop config={orderConfig} style={styles.DigitalFlop} />
                </BorderBox8>
                <BorderBox8 style={styles.BorderBox11}>
                    <DigitalFlop config={siftConfig} style={styles.DigitalFlop} />
                </BorderBox8>
            </BorderBox1>
        )
    }
}

const styles = {
    BorderBox1:{
        textAlign:'center',
        padding:'15px',
        height:'80vh'
    },
    BorderBox11:{
        display:'inline-block',
        width: '22%',
        height:'150px',
        margin:'50px',
        padding:'5px'
    },
    DigitalFlop:{
      marginTop:'20px'
    }
};

export default Home

