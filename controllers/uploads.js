
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

//Este response solo ayuda al tipado; se puede eliminar
const {response} = require('express');
const { model } = require('mongoose');
const { subirArchivo } = require('../helpers');

const {Usuario, Producto} = require('../models')


const cargarArchivo = async (req, res = response) => {

    try{

        //Revisa que en 'req.file' venga el archivo, que tenga un formato válido,
        //Le asigna un nombre con uuid.v4 y lo guarda en filesystem
        const  nombre = await subirArchivo(req.files, undefined, 'imgs')
        res.json({
            nombre
        })

    }catch(err){
        res.status(400).json({err})
    }

}


//Actualiza las imagenes de perfil para Usuarios o productos
const actualizarImagen = async (req, res = response) => {

    try{

        const {id, coleccion} = req.params

        let modelo;

        //Busca el usuario o producto por id
        switch(coleccion){
            case 'usuarios':
                modelo = await Usuario.findById(id)
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe un usuario con el id '${id}'`
                    })
                }
                break

            case 'productos':
                modelo = await Producto.findById(id)
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe un producto con el id '${id}'`
                    })
                }
                break

            default:
                return res.status(500).json({msg: 'Se me olvidó validar esto'})
        }

        //Borrar imagenes previas
        if(modelo.img){
            //Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
            if(fs.existsSync(pathImagen)){
                fs.unlinkSync(pathImagen)
            }
        }
        
        //Revisa que en 'req.file' venga el archivo, que tenga un formato válido,
        //Le asigna un nombre con uuid.v4 y lo guarda en filesystem
        const nombre = await subirArchivo(req.files, undefined, coleccion)
        modelo.img = nombre 
    
        await modelo.save()
    
        res.json(modelo)

    } catch(err){
        return res.status(400).json({
            err
        })
    }
}

const actualizarImagenCloudinary = async (req, res = response) => {

    try{

        const {id, coleccion} = req.params

        let modelo;

        //Busca el usuario o producto por id
        switch(coleccion){
            case 'usuarios':
                modelo = await Usuario.findById(id)
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe un usuario con el id '${id}'`
                    })
                }
                break

            case 'productos':
                modelo = await Producto.findById(id)
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe un producto con el id '${id}'`
                    })
                }
                break

            default:
                return res.status(500).json({msg: 'Se me olvidó validar esto'})
        }

        //Borrar imagenes previas
        if(modelo.img){
            const nombreArr = modelo.img.split('/')
            const nombre = nombreArr[ nombreArr.length - 1]
            const [public_id] = nombre.split('.')
            //No necesitamos un await porque no es vital esperar
            //a que se elimine para realizar alguna otra acción
            cloudinary.uploader.destroy(`Cafe RestServer Nodejs/${coleccion}/${public_id}`)
        }

        
        const {tempFilePath} = req.files.archivo
        //Esto es el equivalente a la función "subirArchivo()"
        const {secure_url} = await cloudinary.uploader.upload(tempFilePath, {folder: `Cafe RestServer Nodejs/${coleccion}`})
        
        //Hay que actualizar el usuario/producto con la url
        //de laimagen en la DB
        modelo.img = secure_url
        await modelo.save()

        res.json(modelo)

    } catch(err){
        return res.status(400).json({
            err
        })
    }
}



const mostrarImagen = async (req, res = response) => {

    try{

        const {id, coleccion} = req.params

        let modelo;

        //Busca el usuario o producto por id
        switch(coleccion){
            case 'usuarios':
                modelo = await Usuario.findById(id)
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe un usuario con el id '${id}'`
                    })
                }
                break

            case 'productos':
                modelo = await Producto.findById(id)
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe un producto con el id '${id}'`
                    })
                }
                break

            default:
                return res.status(500).json({msg: 'Se me olvidó validar esto'})
        }

        //Borrar imagenes previas
        if(modelo.img){
            //Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
            if(fs.existsSync(pathImagen)){
                return res.sendFile(pathImagen)
            }
        }
        
        const pathImagen = path.join(__dirname, '../assets/no-image.jpg' )
        res.sendFile(pathImagen)

    } catch(err){
        return res.status(400).json({
            err
        })
    }
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}