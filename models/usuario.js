
const {Schema, model} = require('mongoose')

const UsuarioSchema = Schema({
    nombre:{
        type: String,
        require: [true, 'El nombre es obligatorio']
    },
    correo:{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img:{
        type: String
    },
    rol: {
        type: String,
        required: true
        //enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado:{
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
},
//ESTO ES PARA LAS PETICIONES EN LAS QUE 'USUARIO MODEL' ES CONCATENADO CON 'POPULATE()'
{
    toObject: {
        transform: function (doc, ret) {
            ret.uid = ret._id;
            delete ret._id;
            delete ret.__v
        }
    }
})


//ESTO ES PARA LAS PETICIONES QUE SON DIRECTAS A 'USUARIO' MODEL
//Este this hace referencia a la instancia creada
//las arrow function mantienen el "this" fuera de la función
UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario } = this.toObject()
    usuario.uid = _id
    return usuario
}

module.exports = model('Usuario', UsuarioSchema)





/* 
const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is mandatory']
    },
    email: {
        type: String,
        required: [true, 'Email is mandatory'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is mandatory'],
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'SALES_ROLE']
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
},
{
    toObject: {
        transform: function (doc, ret) {
            ret.uid = ret._id;
            delete ret._id;
        }
    }
}) */