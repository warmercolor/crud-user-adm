import UserRepository from '../services/UserRepository'

class ClassController {
  async index(request, response){
    //Listar todos os registros
    const users = await UserRepository.findAll()

    response.json(users)
  }

  async store(request, response){
    //Criar novo registro
    const { name, email, password, isAdm, createdOn, updatedOn } = request.body

    const userExist = await UserRepository.findByEmail(email)

    if(!name) {
      return response.status(400).json( { message: "Name is required" } )
    }

    if(!password){
      return response.status(400).json( { message: "Password is required" } )
    }

    if(userExist){
      return response.status(409).json( { message: 'This e-mail is alrady in use' } )
    }

    const user = await UserRepository.create(
      name, email, password, isAdm, createdOn, updatedOn
    )

    response.status(201).json(user)
  }

  async token(request, response) {
    //Pegar token do usuario
    const { email, password } = request.body
    const [ status, token ]= await UserRepository.tokenUser(email, password)

    return await response.status(status).json(token)
  }

  async show(request, response){
    const user = await UserRepository.findById(request.uuid)

    const passwordInvible = { 
      ...user
    }

    delete  passwordInvible.password

    response.status(200).json(passwordInvible)
  }

  async update(request, response){
    //Editar um registro
    const { uuid } = request
    const body = request.body



    const userExist = await UserRepository.findById(uuid)
    const emailExist = await UserRepository.findByEmail(body.email)

    if(!userExist) {
      return response.status(304).json( { message: 'User not found' } )
    }

    if(!body.name) {
      return response.status(304).json( { message: "Name is required" } )
    }

    if(emailExist && emailExist.uuid !== uuid){
      return response.status(409).json( { message: 'This e-mail is alrady in use' } )
    }

    const user = await UserRepository.updateUser(uuid, body)

    response.json(user)
  }

  async delete(request, response){
    //Deletar um registro
    const {uuid } = request.params

    await UserRepository.deleteId(uuid)
    return response.sendStatus(204)
  }
}

const UserController = new ClassController
export default UserController
