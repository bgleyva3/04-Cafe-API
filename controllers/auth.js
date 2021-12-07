const { response, json } = require("express")
const bcryptjs = require("bcryptjs")

const Usuario = require('../models/usuario')
const { generarJWT } = require("../helpers/generar-jwt")
const { googleVerify } = require("../helpers/google-verify")


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


const gogoleSignIn = async (req, res=response) => {
    
    const {id_token} = req.body

    try {

        //Utilizamos googleVerify para que se loggee el usuario
        //(así no ocupamos contraseña), pero después usamos un 
        //JWT para tener el control nosotros como el resto de usuarios
        const {nombre, img, correo} = await googleVerify(id_token)

        let usuario = await Usuario.findOne({correo})

        //Si el usuario no existe en DB:
        if(!usuario){
            const data = {
                nombre, 
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'
            }

            usuario = new Usuario(data)
            await usuario.save()
        }

        //Si el usuario está eliminado de DB:
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador - Usuario bloqueado'
            })
        }

        //Generar el JWT:
        //Generamos un nuevo JWT para tener el control nosotros
        //El proceso de google nos sirve más como contraseña para logearse
        const token = await generarJWT(usuario.id)


        res.json({
            usuario,
            token
        })
        
    } catch(err){
        console.log(err)
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }


}



module.exports = {
    login,
    gogoleSignIn
}