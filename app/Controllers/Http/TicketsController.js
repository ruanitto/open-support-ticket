'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */
const Category = use('App/Models/Category')

class TicketsController {

    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {Session} ctx.session
     * @param {View} ctx.view
     */
    async create({ request, response, session, auth, view }) {
        const all = await Category.all()
        let categories = []
        all.rows.forEach(c => {
            categories.push({
                value: c.id,
                label: c.name,
                selected: false
            })
        });

        const priorityes = [
            { value: 'low', label: 'Low', selected: true }, 
            { value: 'medium', label: 'Medium', selected: false },
            { value: 'high', label: 'High', selected: false }
        ]
    
        return view.render('tickets.create', { categories: categories, priorityes: priorityes })
    }
}

module.exports = TicketsController
