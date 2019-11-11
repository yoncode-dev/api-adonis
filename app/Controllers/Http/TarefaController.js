'use strict'


const Tarefa = use('App/Models/Tarefa')

class TarefaController {

  async index ({ request, response, auth }) {
    //aqui vamos listar as tarefas do usuário logado trazendo todos os campos
    const tarefa = await Tarefa.query().where('user_id', auth.user.id).fetch()

    return tarefa
  }


  async store ({ request, response, auth }) {
    const {id} = auth.user

    const data = request.only(["titulo", "descricao"])

    const tarefa = await Tarefa.create({ ...data, user_id: id})

    return tarefa
  }

  async show ({ params, request, response, auth }) {
    const tarefa = await Tarefa.query().where('id', params.id)
      .where('user_id', auth.user.id).first()

    if(!tarefa) {
      return response.status(401).send({ message: 'Nenhum registro encontrado'})
    }

    return tarefa
  }

  async update ({ params, request, response, auth }) {
    const {titulo, descricao } = request.all()

    const tarefa = await Tarefa.query().where('id', params.id)
      .where('user_id', auth.user.id).first()

    if(!tarefa) {
      return response.status(401).send({ message: 'Nenhum registro encontrado'})
    }

    tarefa.titulo = titulo
    tarefa.descricao = descricao
    tarefa.id = params.id

    await tarefa.save()

    return tarefa
  }

  async destroy ({ params, request, response }) {
    const tarefa = await Tarefa.query().where('id', params.id)
      .where('user_id', auth.user.id).first()

    if(!tarefa) {
      return response.status(401).send({ message: 'Nenhum registro encontrado'})
    }

    await tarefa.delete()

    return response.status(200).send({ message: 'Registro deletado'})
  }
}

module.exports = TarefaController
