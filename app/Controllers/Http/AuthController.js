'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */
const User = use('App/Models/User')
const Validator = use('Validator')

class AuthController {
    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async showRegisterPage({ request, response, view }) {
        return view.render('auth.register')
    }

    async register({ request, response, view }) {
        // validate form input
        const validation = await Validator.validateAll(request.all(), User.rules)

        // show error messages upon validation fail
        if (validation.fails()) {
            await request
                .withAll()
                .andWith({ errors: validation.messages() })
                .flash()

            return response.redirect('back')
        }

        // persist to database
        const user = await User.create({
            username: request.input('username'),
            email: request.input('email'),
            password: request.input('password')
        })

        // login the user
        await request.auth.login(user)

        // redirect to homepage
        response.redirect('/')
    }
}

module.exports = AuthController
