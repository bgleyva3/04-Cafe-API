const Role = require('../models/role')
const {Usuario, Categoria, Producto} = require('../models')

//Se usan los 'new Error' porque estas funciones serán usadas en los
//'Check' y estos solo las ejecutan para atrapar errores, por eso
//no ocupamos nosotros agregar la función 'Next()' al final.

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
        //El "id" no necesita llamarse "_id" porque el método
        //ya tiene implicito que lo haremos a través del id
        const existeUsuario = await Usuario.findById(id)
    

        //Estos throws van a lanzarse directamente en el "catch"
        if(!existeUsuario){
            throw new Error(`El usuario con el id ${id} no existe`)
        }

        if(!existeUsuario){
            throw new Error(`El usuario con el id ${id} no existe`)
        }

    } catch( err ) {
        throw new Error(err)
    }
    
} 


const existeCategoriaPorId = async (id = '') => {
    try{

        const existeCategoria = await Categoria.findById(id)
    
        if(!existeCategoria){
            throw new Error(`La categoría con el id ${id} no existe`)
        }

        if(!existeCategoria.estado){
            throw new Error(`La categoría con el id ${id} no existe`)
        }

    } catch( err ) {
        throw new Error(err)
    }
    
} 

const existeProductoPorId = async (id = '') => {
    try{

        const existeProducto = await Producto.findById(id)
    
        if(!existeProducto){
            throw new Error(`El producto con el id ${id} no existe`)
        }

        if(!existeProducto.estado){
            throw new Error(`El producto con el id ${id} no existe`)
        }

    } catch( err ) {
        throw new Error(err)
    }
    
} 


const coleccionesPermitidas = (coleccion = '' , colecciones = []) => {
    
    const incluida = colecciones.includes(coleccion)
    if(!incluida){
        throw new Error(`La coleccion '${coleccion}' no es permitida - Colecciones permitidas: '${colecciones}'`)
    }

    //opcional. Si no manda error, pasa igual sin detectar error
    return true
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}