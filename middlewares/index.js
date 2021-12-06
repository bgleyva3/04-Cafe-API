
//index.js es el archivo que node abre por defecto cuando se importa
//una carpeta sin especificar el archivo

const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');


module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles
}