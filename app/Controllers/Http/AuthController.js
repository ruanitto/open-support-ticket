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
     * @param {View} ctx.view
     */
    async showRegisterPage({ view }) {
        return view.render('auth.register')
    }

    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {Session} ctx.session
     * @param {View} ctx.view
     */
    async register({ request, response, session, view }) {
        // validate form input
        const validation = await Validator.validateAll(request.all(), User.rules)

        // show error messages upon validation fail
        if (validation.fails()) {
            await session
                .withErrors(validation.messages())
                .flashAll()

            return response.redirect('back')
        }

        // persist to database
        const user = await User.create({
            username: request.input('username'),
            email: request.input('email'),
            password: request.input('password')
        })

        // login the user
        await auth.login(user)

        // redirect to homepage
        response.redirect('/')
    }

    /**
     * @param {object} ctx
     * @param {View} ctx.view
     */
    async showLoginPage({ view }) {
        return view.render('auth.login')
    }

    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {Session} ctx.session
     * @param {View} ctx.view
     */
    async login({ request, response, session, auth, view }) {
        const email = request.input('email')
        const password = request.input('password')

        try {
            await auth.attempt(email, password)

            // redirect to homepage
            response.redirect('/')
        } catch (e) {
            console.log(e)
            await session.withErrors({ error: 'Invalid credentials' }).flashAll()

            // redirect back with error
            response.redirect('back')
        }
    }

    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {Session} ctx.session
     * @param {View} ctx.view
     */
    async logout({ request, response, session, auth, view }) {
        // logouts the user
        await auth.logout()
    
        // redirect to login page
        response.redirect('/login')
    }
}

module.exports = AuthController
