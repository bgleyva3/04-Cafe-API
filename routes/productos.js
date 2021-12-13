const { Router } = require('express');
const { check } = require('express-validator');

const { crearProducto, obtenerProductos, obtenerProductoPorID, actualizarProducto, eliminarProducto } = require('../controllers/productos');
const { existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, tieneRole } = require('../middlewares');

const router = Router();

/* 
    {{url}}/api/productos
*/

//Obtener todas las categorias - público
router.get('/', obtenerProductos)

//Obtener una categorias por id - público
router.get('/:id', obtenerProductoPorID)

//Crear categoría - privado - usuario con token válido
//Cualquier usuario puede publicar un producto, no tiene por qué ser admin
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligtorio').not().isEmpty(),
    check('categoria', 'No es un ID de mongo válido').isMongoId(),
    check('precio', 'El precio no es un número').optional().isNumeric(),
    validarCampos
], crearProducto)

//Actualizar - privado - usuario cont token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto)

//Borrar una categoría - Admin
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id').custom(existeProductoPorId),
    check('precio', 'El precio no es un número').optional().isNumeric(),
    check('categoria', 'No es un ID de mongo válido').optional().isMongoId(),
    validarCampos
], eliminarProducto)



module.exports = router