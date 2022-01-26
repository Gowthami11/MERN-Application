import multer from 'multer';
import {v4 as uuid} from 'uuid'
import fs from 'fs-extra'
const MIME_TYPE_MAP={
    'image/jpg':'jpg',
    'image/jpeg':'jpeg',
    'image/png':'png'
}
const fileUpload=multer({
    limits:500000,
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            let path="src/uploads/images"
            fs.mkdirsSync(path); 
            cb(null,path)
        },
        filename:(req,file,cb)=>{
            const ext=MIME_TYPE_MAP[file.mimetype];
            cb(null,uuid()+"."+ext);
            console.log('img',uuid()+"."+ext)

        }
    }),
    fileFilter:(req,file,cb)=>{
        const isValid=!!MIME_TYPE_MAP[file.mimetype]
        const error=isValid?null:new Error('invalid mime type');
        cb(error,isValid)
    }
});
export {fileUpload}
