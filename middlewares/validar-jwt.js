const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

//request y response es unicamente para ayudar con el tipado
const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token')

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try{

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        
        //Al no ser una petición post, el cliente no nos manda su id,
        //pero en el token nosotros lo guardamos y podemos obtenerlo
        //si necesitaramos hacer acciones con su id.

        const usuario = await Usuario.findById(uid)

        if(!usuario){
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en DB'
            })
        }

        //Verificar si el uid tiene estado de true
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido - Usuario con estado "false"'
            })
        }

        req.usuario = usuario

        next()

    }catch(err){
        console.log(err)
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}

module.exports = {
    validarJWT
}