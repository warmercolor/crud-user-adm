import users from '../database'
import {v4 as uuidv4} from 'uuid'
import { compare, hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'

class ClassRepositorry{
    findAll(){
        return new Promise((resolve) => {
            resolve(users)
        })
    }

    findById(id){
        return new Promise((resolve) => resolve(
            users.find((user) => user.uuid === id)
        ))
    }

    findByEmail(email){
        return new Promise((resolve) => resolve(
            users.find((user) => (user.email === email))
        ))
    }

    async tokenUser(emailUser, passwordUser){

        const body = users.find((user) => (user.email === emailUser))
        const pass = await compare(passwordUser, body.password)
        const { email, isAdm, uuid } = body

        if(!body || !pass ){
            return [401,  { message: 'Wrong email or password' } ] 
        }

        const token = jwt.sign({email, isAdm}, 'SECRET_KEY', {
            expiresIn: '24h',
            subject: uuid
        })

        return ([200, {token}])
    }


    async create(name, email, password, isAdm, createdOn, updatedOn){
        const hashPassword = await hash(password, 8)

        return new Promise((resolve) => {
            const newUsers = {
                name,
                email,
                password: hashPassword,
                isAdm,
                createdOn: new Date(),
                uuid: uuidv4(),
                updatedOn: new Date()
            }

            const passwordInvible = { 
                ...newUsers,
                password,
            }

            delete  passwordInvible.password

            users.push(newUsers)
            resolve(passwordInvible)
        }
        )
    }

    updateUser(id, body){
        return new Promise((resolve) => {
            const updateUsers = {
                ...body,
                
                updatedOn: new Date()
            }

            let user = users.find((user) => (
                user.uuid === id
            ))

            const passwordInvible = { 
                ...user,
                ...updateUsers
            }

            delete  passwordInvible.password

            user = passwordInvible

            resolve(user)
        }
        )
    }

    deleteId(id){
        return new Promise((resolve => {
            const userDelete = users.find((user) => user.uuid === id)
            resolve(userDelete)
        }))
    }
    }

const UserRepository = new ClassRepositorry
export default UserRepository