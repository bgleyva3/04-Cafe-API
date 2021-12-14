
const {Schema, model} = require('mongoose')

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: { type: String },
    disponible: {type: Boolean, default: true},
    img: {type: String}

})


//Este this hace referencia a la instancia creada
//las arrow function mantienen el "this" fuera de la función
ProductoSchema.methods.toJSON = function() {
    const { __v, _id, ...categoria } = this.toObject()
    categoria.uid = _id
    return categoria
}

module.exports = model('Producto', ProductoSchema)