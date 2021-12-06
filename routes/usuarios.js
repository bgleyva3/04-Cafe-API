
const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

/* const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
 */
const {validarCampos, validarJWT, esAdminRole, tieneRole} = require('../middlewares')

const router = Router();


router.get('/', usuariosGet );

//check revisa en los atributos de req.body y en los parametros de la url:
router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRoleValido ),
    check('correo').custom( emailExiste ),
    validarCampos
], usuariosPut );

//check va a revisar en req.body.nombre, req.body.password, etc...
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser más de 5 carácteres').isLength({min:5}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPost );

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;