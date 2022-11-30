const express = require('express');
const app = express()
const fs = require('fs');
const increment = require('add-filename-increment')
const multer = require('multer')

const cors = require('cors')
const router = express.Router()
app.use(cors())
app.use(express.json())
app.use(express.static('./public'))


// const storeg = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const path = './public' + req.body.path
//         cb(null, path)
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.filename +'.' + file.mimetype)
//     }
// })
// const uploder = multer({storage})


app.route('*')
    .get((req, res) => {
        const path = `${req.url}`
        const userFolder = `./public${path}`;
        fs.readdir(userFolder, (err, files) => {
            if (err) {
                res.sendStatus(500)
                return
            }
            const objects = files.map((file) => {
                return {
                    fileName: file,
                    isDirectory: fs.lstatSync(`./public${path}${file}`).isDirectory(),
                    size: fs.lstatSync(`./public${path}${file}`).size
                }
            })
            res.send(objects)
            res.end()
        });
    }).put((req, res) => {
        const path = `${req.url}`
        const newName = req.body.newName;
        fs.rename(decodeURI(`./public/${path}`), decodeURI(`./public/${path.slice(0, path.lastIndexOf('/') + 1)}${newName}`)
            , function (err) {
                if (err) console.log('ERROR: ' + err);
                res.send(JSON.stringify('changd'))
            })
    }).delete((req, res) => {
        const path = decodeURI(`${req.url}`)
        let deleteType = path.includes(".") ? fs.unlink : fs.rmdir
        try {
            deleteType(`./public/${path}`, function (err) {
                if (err) {
                  res.status(403).send(err.message)
                } else{
                  res.send(JSON.stringify('File deleted!'))  
                }   
            })
        } catch (err) {
            console.log(err);
        }

    }).post((req, res) => {
        const path = `${req.url}`
        fs.copyFile(decodeURI(`./public/${path}`), increment(decodeURI(`./public/${path}`), { fs: true }), (err) => {
            if (err) {
                console.log("Oops! An Error Occured:", err);
            }
            else {
                console.log("File Copyd");
            }
        });
    })




const port = process.env.PORT || 8080
app.listen(port, () => console.log(`listen on port ${port}`))

    // }).post(uploder.single('myFile'), (req, res) => {
// const element = document.getElementById('inputFile')
// element.oncange = (e)=>{
//    const file = e.target.files[0]
// const data = new FormData()
// data.append('myFile', file)
// }
