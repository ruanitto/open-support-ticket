'use strict'
const User = use('App/Model/User')
const Validator = use('Validator')

class AuthController {

    async showRegisterPage({ request, response, view }) {
        return response.sendView('auth.register')
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
