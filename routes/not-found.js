
const { Router } = require('express');

const router = Router();


router.use('/', (req, res) => {
    res.json({
        msg: 'route not found',
        options: {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            uploads:    '/api/uploads',
            usuarios:   '/api/usuarios',
        }
    });
} );


module.exports = router;