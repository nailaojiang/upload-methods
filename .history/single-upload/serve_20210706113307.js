const path = require('path')
const Koa = require('koa')
const cors = require('@koa/cors')
const serve = require('koa-static')
const multer = require('@koa/multer')
const Router = require('@koa/router')


const app = new Koa()

const router = new Router()

const PORT = 3000

const RESOYRCE_URL = `http://localhost:${PORT}`

const UPLOAD_DIR = path.join(__dirname, '/public/upload')

const storage = multer.diskStorage({
  destination: async function(req, file,cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function(req, file, cb) {
    cb(null, `${file.originalname}`)
  }
})

const multerUpload = multer({ storage })

router.get('/', async (ctx) => {
  ctx.body = '文件测试上传'
})

router.post('upload/single',  async (ctx, next) => {
  try {
    await next()
    ctx.body = {
      code: 1,
      msg: '文件上传成功',
      url: `${RESOYRCE_URL}/${ctx.file.originalname}`
    }
  } catch (error) {
    console.log(error);
    ctx.body = {
      code: -1,
      msg: '上传失败'
    }
  }
  multerUpload.single('file')
})

app.use(cors())
app.use(serve(UPLOAD_DIR))
app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`上传服务器已启动端口${PORT}`);
})