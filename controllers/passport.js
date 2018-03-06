const Passport = require('../models/passport');


exports.wechatLogin = async(ctx, next) => {
    try {
        // let token = await Passport.wechatLogin(ctx.query.unionid); 
        if(!!ctx.session){
        	ctx.body = ctx.session;
        }else{
        	ctx.body = 'session is null';
        }
        ctx.body = '123';
    } catch (err) {
        return 'err';
    }
}

exports.setSession = async(ctx, next) => {
    try {
        ctx.session = {
            user_id: Math.random().toString(36).substr(2),
            count: 0
        }
        ctx.body = ctx.session
    } catch (err) {
        return 'err';
    }
}