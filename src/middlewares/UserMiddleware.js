import jwt from 'jsonwebtoken'

class Middlewares{

    authorization (request, response, next){

        let authorization = request.headers.authorization
    
        if(!authorization){
            return response.status(401).json( { message: 'Invalid token' } )
        }
    
        authorization = authorization.split(' ')[1]
    

        return jwt.verify(authorization, 'SECRET_KEY', (error, decoded) => {

            if(error) {
                return response.status(401).json({ message: 'Invalid token'})
            }
            
            request.uuid = decoded.sub
            console.log(decoded.sub)
    
            return next()
        })
    }

    admin(request, response, next){
        
        let authorization = request.headers.authorization
    
        if(!authorization){
            return response.status(401).json( { message: 'Invalid token' } )
        }
    
        authorization = authorization.split(' ')[1]
    

        return jwt.verify(authorization, 'SECRET_KEY', (error, decoded) => {
            if(error) {
                return response.status(401).json({ message: 'Invalid token'})
            }

            if(!decoded.isAdm) {
                return response.status(403).json({ message: 'Missing admin permissions'})
            }
    
            request.uuid = decoded.sub
    
            return next()
        })
    }

    updateAuth(request, response, next){
                
        let authorization = request.headers.authorization
    
        if(!authorization){
            return response.status(401).json( { message: 'Invalid token' } )
        }
    
        authorization = authorization.split(' ')[1]
    
        
        return jwt.verify(authorization, 'SECRET_KEY', (error, decoded) => {
            if(error) {
                return response.status(401).json({ message: 'Invalid token'})
            }
            
            request.uuid = decoded.sub
            
            if(request.params.id === decoded.sub){
                return next()
            }

            else if(!decoded.isAdm) {
                return response.status(403).json({ message: 'Missing admin permissions'})
            }

    
            return next()
        })
    }

    userExist (request, response, next) {
        const { uuid } = request.params
        const users = users.findIndex((user) => user.uuid === uuid)

        if (users === -1) {
            return response.status(404).json({ error: 'User not found' })
        }

        request.user = users

        return next()
}
}

const UserMiddlewares = new Middlewares
export default UserMiddlewares