
//Esto es solo para que aparezca el autocompleta después del punto de "req" y "res"
//Las rutas le van a mandar su propio req y res así que estos response y request 
//desaparecen. Por eso solo son por defecto para el tipado o autocompletar
const { response, request } = require('express');
// SE PUEDE BORRAR ESTO DE ARRIBA
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');


const usuariosGet = async (req = request, res = response) => {

    const {limite = 5, desde = 0} = req.query
    if(isNaN(limite) || isNaN(desde)){
        //Ocupamos un return porque esto es lo último que le
        //queremos enviar en el "res" y no queremos que se
        //ejecute lo demás
        return res.status(400).json({"error": "Los query params no contienen números"})
    }

    //SUSTITUIMOS ESTOS DOS AWAITS POR UNA PROMESA QUE MANDA
    //A EJECUTAR AMBOS AWAITS AL MISMO TIEMPO
    /* const usuarios = await Usuario.find({estado:true})
        .skip(Number(desde))
        .limit(Number(limite))

    const total = await Usuario.countDocuments({estado:true}) */

    //ESTO EJECUTA AMBAS PROMESAS DE MANERA SIMULTANEA
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado:true})
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    //No ocupamos un return porque es lo último que se ejecuta
    //y el cliente lee que le guardamos un "json" en "res"
    res.json({
        total, 
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    const {nombre, correo, password, rol} = req.body;
    //Esto crea la instancia del usuario:
    //basicamente solo genera un id:
    const usuario = new Usuario( {nombre, correo, password, rol} )

    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt)
    //Esto guarda la instancia en la DB y compara las condiciones del modelo:
    await usuario.save()

    res.json({
        msg: 'post API - usuariosPost',
        usuario
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body

    console.log(resto)

    if(password) {
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true})

    res.json( usuario );
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async (req, res = response) => {

    const {id} = req.params

    //Para Borrar físicamente:
    // const usuario = await Usuario.findByIdAndDelete(id)

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}, {new: true})

    res.json({
        usuario
    });
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}