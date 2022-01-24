const { response } = require("express");
const {Producto} = require('../models')



// obtenerCategorias - paginado - total - populate
const obtenerProductos = async (req, res = response) => {

    const {limite = 5, desde = 0} = req.query

    if(isNaN(limite) || isNaN(desde)){
        return res.status(400).json({"error": "Los query params no contienen números"})
    }

    try {
        const [total, productos] = await Promise.all([
            Producto.countDocuments({estado:true}),
            Producto.find({estado:true}).populate('usuario', 'nombre').populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
        ])
    
        res.json({
            total, 
            productos
        });

    } catch(err) {
        console.log(err)
        return res.status(500).json({
            msg: 'Ocurrió un error consultado la DB',
            err
        })
    }

}


// obtenerCategoria - populate {}
const obtenerProductoPorID = async (req, res = response) => {

    const {id} = req.params

    try {
        const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre')
    
        if(!producto.estado){
            return res.status(400).json({
                msg: `El producto con el id ${id} no existe`
            })
        }

        res.json({
            producto
        });

    } catch(err) {
        console.log(err)
        return res.status(500).json({
            msg: 'Ocurrió un error al buscar un producto por Id en la DB',
            err
        })
    }

}


//'response' solo como ayuda al escribir
const crearProducto = async (req, res = response) => {

    const {nombre, precio, categoria } = req.body

    try {
        const productoDB = await Producto.findOne({nombre})
        
        //Si ya está duplicado
        if(productoDB){
            return res.status(400).json({
                msg: `El producto ${productoDB.nombre} ya existe`
            })
        }

        //Objeto a guardar (seleccionamos qué queremos guardar)
        const data = {
            nombre: nombre.toUpperCase(),
            precio,
            categoria,
            usuario: req.usuario._id
        }

        const producto = await new Producto(data)

        await producto.save()

        res.status(201).json({
            msg: 'Producto creado',
            producto})

    } catch(err){
        console.log(err)
        return res.status(500).json({
            msg: 'Ocurrió un error al tratar de crear el producto en la DB',
            err
        })
    }

}


// actualizarCategoria
const actualizarProducto = async (req, res = response) => {
    
    const { id } = req.params;
    const {nombre, precio, categoria} = req.body
    if(nombre){
        nombre = nombre.toUpperCase()
    }

    try{

        const data = {
            nombre,
            precio,
            categoria
        }
    
        const producto = await Producto.findByIdAndUpdate(id, data, {new: true})
    
        res.json( producto );
        
    }catch(err){
        console.log(err)
        return res.status(500).json({
            msg: 'Ocurrió un error al tratar de actualizar el producto en la DB',
            err
        })

    }
}


// borrarCategoria - estado:false
const eliminarProducto = async (req, res = response) => {

    const {id} = req.params

    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true})

    res.json({
        status: "Producto eliminada",
        producto
    });
}


module.exports = {
    obtenerProductos,
    obtenerProductoPorID,
    actualizarProducto,
    crearProducto,
    eliminarProducto
}