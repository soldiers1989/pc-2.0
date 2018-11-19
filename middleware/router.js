// 中间件配置

export default function ({store, redirect}) {
    if (store.app.context.route.name == 'personalCenter') {
        return redirect('/personalCenter/account')
    }
    if (store.app.context.route.name == 'trade') {
        return redirect('/trade/day')
    }
}
