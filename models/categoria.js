
const {Schema, model} = require('mongoose')

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    //El usuario que crea la categoría:
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }

})


//Este this hace referencia a la instancia creada
//las arrow function mantienen el "this" fuera de la función
CategoriaSchema.methods.toJSON = function() {
    const { __v, _id, ...categoria } = this.toObject()
    categoria.uid = _id
    return categoria
}

module.exports = model('Categoria', CategoriaSchema)