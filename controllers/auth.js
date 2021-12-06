const { response } = require("express")
const bcryptjs = require("bcryptjs")

const Usuario = require('../models/usuario')
const { generarJWT } = require("../helpers/generar-jwt")


// res = response solo ayuda con el tipado
const login = async(req, res = response) => {

    const {correo, password} = req.body

    try {

        //verificar si el email existe
        const usuario = await Usuario.findOne({correo})
        console.log(usuario)
        if(!usuario){
            return res.status(400).json({
                msg: `El correo ${correo} no existe`
            })
        }

        //verificar si el usuario está activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: `El usuario está "inactivo" en la DB`
            })
        }

        //verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if(!validPassword){
            
            return res.status(400).json({
                msg: `Contraseña incorrecta`
            })
        }

        //generar el JWT
        //JWT no tiene una función de promesa, solo de callback, así
        //que crearemos un "helper" que sí lo haga y lo llamaremos "generarJWT"
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

module.exports = {
    login
}