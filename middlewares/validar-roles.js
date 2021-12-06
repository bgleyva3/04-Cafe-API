const { response } = require("express")


const esAdminRole = (req, res = response, next) => {

    if(!req.usuario){
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        })
    }

    const {rol, nombre} = req.usuario

    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esto`
        })
    }

    next()
}

//Los middlewares requieren una función con la cuál se ejecutarán los
//argumentos de 'req, res, next', así que retonamos esa función dentro
//de nuestro "tieneRole()", y "tieneRole()" lo utilizamos para ejercutarla
//en los middlewares con los argumentos que queremos
const tieneRole = ( ...roles ) => {

    return (req, res = response, next) => {

        if(!req.usuario){
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }

        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            })
        }

        next()

    }

}


module.exports = {
    esAdminRole,
    tieneRole
}