'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

const Validator = use('Validator')
const Ticket = use('App/Models/Ticket')
const RandomString = use('randomstring')
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

  async store({ auth, request, response, session }) {
    const user = auth.user

    const validation = await Validator.validateAll(request.all(), {
      title: 'required',
      category: 'required',
      priority: 'required',
      message: 'required'
    })

    if (validation.fails()) {
      await session.withErrors({ errors: validation.messages() })
        .flash()

      return response.redirect('back')
    }

    const ticket = await Ticket.create({
      title: request.input('title'),
      user_id: user.id,
      ticket_id: RandomString.generate({ length: 10, capitalization: 'uppercase' }),
      category_id: request.input('category'),
      priority: request.input('priority'),
      message: request.input('message'),
      status: "Open",
    })

    // send mail notification
    // yield Mail.send('emails.ticket_info', { user, ticket }, (message) => {
    //   message.to(user.email, user.username)
    //   message.from('support@adonissupport.dev')
    //   message.subject(`[Ticket ID: ${ticket.ticket_id}] ${ticket.title}`)
    // })

    await session.flash({ status: `A ticket with ID: #${ticket.ticket_id} has been opened.` })
    response.redirect('back')
  }

  async userTickets({ auth, request, response, view }) {
    const tickets = await Ticket.query()
      .where('user_id', auth.user.id)
      .with('category')
      .fetch()

    return view.render('tickets.user_tickets', { tickets: tickets.toJSON() })
  }

  async show({ auth, params, request, response, view }) {
    // Get the ticket with the user that created it
    const ticket = await Ticket.query()
      .where('ticket_id', params.ticket_id)
      .with('user')
      .firstOrFail()
    // Get the ticket category
    const category = await ticket.category().fetch()

    // response.send({
    //     ticket: ticket.toJSON(),
    //     category: category.toJSON()
    //   })
    return view.render('tickets.show', {
      ticket: ticket.toJSON(),
      category: category.toJSON()
    })
  }
}

module.exports = TicketsController
