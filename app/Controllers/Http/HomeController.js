'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */
const Config = use('Config')

class HomeController {
    /**
     * @param {object} ctx
     * @param {View} ctx.view
     */
    async index({ view }) {
        const appName = Config.get('app.name')

        return view.render('layouts.master', { title: appName })
    }
}

module.exports = HomeController
