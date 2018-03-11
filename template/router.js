/**
 * 该文件系自动生成，手动修改可能会被替换
 * 可以通过node generate-router.js自动生成
 */
const router = require('koa-router');
const mainRouter = router();
let allCtls = [];

[ALLROUTER]
processCtls(mainRouter, allCtls);

function processCtls(r, ctls) {
    if (!ctls) {
        return;
    }

    ctls.map((item, i) => {
        processRouter(r, item.path, item.ctl);
    });
}

function processRouter(r, path, ctl) {
    Object.keys(ctl).map(key => {
        if (key.indexOf('post') == 0) {
            let action = key.substring(4);
            r.post('/' + path + '/' + action.toLowerCase(), ctl[key])
        } else if (key.indexOf('get') == 0) {
            let action = key.substring(3);
            r.get('/' + path + '/' + action.toLowerCase(), ctl[key])
        } else {
            r.get('/' + path + '/' + key.toLowerCase(), ctl[key])
        }
    });
}
module.exports = mainRouter;
