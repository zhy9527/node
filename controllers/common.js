const Community = require('../models/community.js');
const User = require('../models/user.js');

/**
 * 测试用
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.getTest = async(ctx, next) => {

    ctx.session = {
        userId: 28,
        suppliersId: 1,
        communityId: 1
    }

    ctx.body = ctx.session;
}

/**
 * 获取所有小区信息
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.getCommunities = async(ctx, next) => {

    let result = await Community.getList();

    ctx.body = result;
}


/**
 * 设置当前用户选择的小区
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.postCommunity = async(ctx, next) => {

    let userId = ctx.session.userId;
    if (!userId) {
        throw (401);
        return;
    }

    let body = ctx.request.body;
    if (!body.communityId) {
        throw (400, '缺少参数communityId');
        return;
    }

    let community = await Community.getOne(body.communityId);
    if(!community){
        throw(400, '选择的小区信息不存在');
        return;
    }

    let res = await User.update(userId, {
        community_id: communityId
    });

    if (res > 0) {
        ctx.session.suppliersId = community.suppliers_id;
        ctx.session.communityId = communityId;
        ctx.body = '设置小区成功';
    } else {
        throw (500, '设置失败');
    }

    ctx.body = result;
}