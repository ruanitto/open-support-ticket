'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', 'HomeController.index')
//Route.on('/').render('home')

Route.get('register', 'AuthController.showRegisterPage')
Route.post('register', 'AuthController.register')

Route.get('login', 'AuthController.showLoginPage')
Route.post('login', 'AuthController.login')

Route.get('logout', 'AuthController.logout')

Route.get('new_ticket', 'TicketsController.create')
Route.post('new_ticket', 'TicketsController.store')

Route.get('my_tickets', 'TicketsController.userTickets')

Route.get('tickets/:ticket_id', 'TicketsController.show')
