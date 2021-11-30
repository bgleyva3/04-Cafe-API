const Role = require('../models/role')
const Usuario = require('../models/usuario')

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({rol})
    if(!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la DB`)
    }
}

const emailExiste = async (correo = '') => {
    const emailFetched = await Usuario.findOne({correo})
    if(emailFetched){
        throw new Error(`El email ${correo} ya está registrado`)
    }
    
} 

const existeUsuarioPorId = async (id = '') => {
    try{
        const existeUsuario = await Usuario.findById(id)
    
        if(!existeUsuario){
            throw new Error(`El id ${id} no existe`)
        }
    } catch( err ) {
        throw new Error(`El id ${id} no existe`)
    }
    
} 

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}