
const {v4: uuidv4} = require('uuid')
const path = require('path')

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta='') => {

    return new Promise ((resolve, reject) => {

        console.log("req.files: ", files)
        //Usa un ternario para revisar que 'req.files' no esté vacío  
        const {archivo} = files == null ? reject('Debe ingresar una imagen') : files;
        
        const nombreCortado = archivo.name.split('.')
        const extension = nombreCortado[nombreCortado.length - 1]

        //Validar la extensión:
        if (!extensionesValidas.includes(extension)){
            return reject({
                    msg: `La extensión "${extension}" no es válida`,
                    extensionesValidas: `${extensionesValidas}`
            })
        }

        const nombreTemp = uuidv4() + '.' + extension
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp)

        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, (err) => {
            if (err){
                reject(err)
            }

            resolve(nombreTemp);
        })
    })
}




module.exports = {
    subirArchivo
}