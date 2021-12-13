const { Router } = require('express');
const { check } = require('express-validator');

const { crearCategoria, obtenerCategorias, obtenerCategoriaPorID, actualizarCategoria, eliminarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, tieneRole } = require('../middlewares');

const router = Router();

/* 
    {{url}}/api/categorias
*/

//Obtener todas las categorias - público
router.get('/', obtenerCategorias)

//Obtener una categorias por id - público
router.get('/:id', obtenerCategoriaPorID)

//Crear categoría - privado - usuario con token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligtorio').not().isEmpty(),
    validarCampos
], crearCategoria)

//Actualizar - privado - usuario cont token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria)

//Borrar una categoría - Admin
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], eliminarCategoria)



module.exports = router