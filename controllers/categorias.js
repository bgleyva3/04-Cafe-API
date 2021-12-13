const { response } = require("express");
const {Categoria} = require('../models')



// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {

    const {limite = 5, desde = 0} = req.query

    if(isNaN(limite) || isNaN(desde)){
        return res.status(400).json({"error": "Los query params no contienen números"})
    }

    try {
        const [total, categorias] = await Promise.all([
            Categoria.countDocuments({estado:true}),
            Categoria.find({estado:true}).populate('usuario')
            .skip(Number(desde))
            .limit(Number(limite))
        ])
    
        res.json({
            total, 
            categorias
        });

    } catch(err) {
        console.log(err)
        return res.status(500).json({
            msg: 'Ocurrió un error al buscar los productos en la DB',
            err
        })
    }

}


// obtenerCategoria - populate {}
const obtenerCategoriaPorID = async (req, res = response) => {

    const {id} = req.params

    try {
        const categoria = await Categoria.findById(id).populate('usuario')
    
        if(!categoria.estado){
            return res.status(400).json({
                msg: `La categoría con el id ${id} no existe`
            })
        }

        res.json({
            categoria
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
const crearCategoria = async (req, res = response) => {

    //Así no hay problema de minusculas y mayusculas al comparar
    const nombre = req.body.nombre.toUpperCase()

    try {
        const categoriaDB = await Categoria.findOne({nombre})
        
        //Si ya está duplicado
        if(categoriaDB){
            return res.status(400).json({
                msg: `La categoría ${categoriaDB.nombre} ya existe`
            })
        }

        //Objeto a guardar (seleccionamos que queremos guardar)
        const data = {
            nombre,
            //Le pasamos el id del usuario que lo crea
            usuario: req.usuario._id
        }

        const categoria = await new Categoria(data)

        await categoria.save()

        res.status(201).json(categoria)

    } catch(err){
        console.log(err)
        return res.status(500).json({
            msg: 'Ocurrió un error al tratar de crear la categoría en la DB',
            err
        })
    }

}


// actualizarCategoria
const actualizarCategoria = async (req, res = response) => {
    
    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase()

    console.log(nombre)

    try{
    
        const categoria = await Categoria.findByIdAndUpdate(id, {nombre}, {new: true})
    
        res.json( categoria );
        
    }catch(err){
        console.log(err)
        return res.status(500).json({
            msg: 'Ocurrió un error al tratar de actualizar la categoría en la DB',
            err
        })

    }
}


// borrarCategoria - estado:false
const eliminarCategoria = async (req, res = response) => {

    const {id} = req.params

    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true})

    res.json({
        status: "Categoría eliminada",
        categoria
    });
}


module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorID,
    actualizarCategoria,
    crearCategoria,
    eliminarCategoria
}