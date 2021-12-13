
const {response} = require('express')
const {ObjectId} = require('mongoose').Types

const {Usuario, Categoria, Producto} = require('../models')


const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'productosPorCategoria',
    'roles'
]

//Recibo la 'res' porque en esta función pinso salirme
const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino)

    if(esMongoID){
        const usuario = await Usuario.findById(termino)
        res.json({
            results: (usuario) ? [usuario] : []
        })
    }


    //Realiza una busqueda insensible (no estricta)
    //Con que tenga una parte de la expresión, mayus o minusculas
    const regex = new RegExp(termino, 'i')

    //"Usuario.count()" para contar cuantos resultados hay
    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    })

    res.json({
        results: usuarios
    })

}


const buscarCategorias = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino)

    if(esMongoID){
        const categoria = await Categoria.findById(termino)
        res.json({
            results: (categoria) ? [categoria] : []
        })
    }


    //Devuelve todos los resultados que tengan al menos
    //uno de los caracteres dados
    const regex = new RegExp(termino, 'i')

    //"Usuario.count()" para contar cuantos resultados hay
    const categorias = await Categoria.find({ nombre: regex, estado: true })

    res.json({
        results: categorias
    })

}


const buscarProductos = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino)

    if(esMongoID){
        const producto = await Producto.findById(termino).populate('categoria', 'nombre')
        res.json({
            results: (producto) ? [producto] : []
        })
    }


    //Devuelve todos los resultados que tengan al menos
    //uno de los caracteres dados
    const regex = new RegExp(termino, 'i')

    //"Usuario.count()" para contar cuantos resultados hay
    const productos = await Producto.find({ nombre: regex, estado: true })
                                    .populate('categoria', 'nombre')

    res.json({
        results: productos
    })

}


const buscarProductosPorCategoria = async (term = '', res = response) => {

    const regex = RegExp(term, 'i'); //sera una busqueda insensible (no estricta)

    const category = await Categoria.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    })

    if(!category[0] ){
        return res.status(400).json({
            msg: 'Esta categoría no existe'
        })
    }

    console.log("category: ", category[0])

    const products =  await Producto.find({categoria: category[0]._id})
                                    .populate('categoria','nombre')
                                    .populate('usuario','nombre')
    if(!products[0] ){
        return res.status(400).json({
            msg: 'No se encontraron productos'
        })
    }
    res.json({
        results: products
    })
}





const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `'${coleccion}' no es una colección permitida. Las colecciones permitidas son: '${coleccionesPermitidas}'`
        })
    }

    switch(coleccion){
        case 'usuarios':
            buscarUsuarios(termino, res)
            break
        case 'categoria':
            buscarCategorias(termino, res)
            break
        case 'productos':
            buscarProductos(termino, res)
            break
        case 'productosPorCategoria':
            buscarProductosPorCategoria(termino, res)
            break
        default: 
            res.status(500).json({
                msg: 'Colección no incluida en las busquedas'
            })
    }

}


module.exports = {
    buscar
}