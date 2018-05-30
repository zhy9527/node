const Redis = require('../utils/redis.js');
const Order = require('../models/order.js');
const OrderGoods = require('../models/order_goods.js');

/* 
 * 获取订单列表
 * 订单列表分0全部、1未支付、2已支付、3已完成
 * @param {String} [state]   state为订单装
 * 默认所有订单
 */
exports.getList = async(ctx, next) => {
    let token = ctx.request.header.token
    let userId = await Redis.getUser({
        key: token,
        field: 'userId'
    })
    if (!token || !userId) {
        ctx.throw(401);
        return;
    }
    let status = ctx.query.status || '0';
    let page = ctx.query.page;
    let size = ctx.query.size;

    let orderList = [];
    switch(status){
        case '0':{
            orderList = await Order.getList(userId, page, size);
            break;
        }
        case '1':{
            orderList = await Order.getUnpaidOrders(userId, page, size);
            break;
        }
        case '2': {
            orderList = await Order.getPaidOrders(userId, page, size);
            break;
        }
    }

    // 查询订单商品
    for (let i = 0; i < orderList.length; i++) {
        let orderId = orderList[i].order_id
        let orderGoods = await Order.getOrderGoods(orderId);
        // 查询订单所有商品
        let orderGoodsIds = []
        for (let j = 0; j < orderGoods.length; j++) {
            orderGoodsIds.push(orderGoods[j].goods_id)
        }
        // 查询订单商品详细内容
        console.log(orderGoodsIds)
        var orderGoodsList = await OrderGoods.getListByIds(orderGoodsIds, orderId);
        Object.assign(orderList[i], { goods: orderGoodsList })
    }
    ctx.body = orderList
}


/* 
 * 获取订单详情
 * @param {String} [order_id]   order_id订单Id
 */
exports.getDetail = async(ctx, next) => {
    let token = ctx.request.header.token
    let userId = await Redis.getUser({
        key: token,
        field: 'userId'
    })
    if (!token || !userId) {
        ctx.throw(401);
        return;
    }
    let orderSn = ctx.query.orderSn
    if (!orderSn) {
        ctx.throw(400, '缺少参数orderSn');
        return;
    }
    try {
        let orderInfo = await Order.getOneByOrderSn(orderSn);
        let orderGoods = await Order.getOrderGoods(orderInfo.order_id);
        Object.assign(orderInfo, { goods: orderGoods })
        ctx.body = await orderInfo
    } catch (err) {
        return 'err';
    }
}
