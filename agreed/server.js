const express = require('express')
const bodyParser = require('body-parser')
const Agreed = require('agreed-core')
const agreed = new Agreed()

const server = express()
const port = 8100

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ expanded: true }))

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token')
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Max-Age', '86400')
  next()
})

// OPTIONSメソッドの実装
server.options('*', function(_, res) {
  res.sendStatus(200)
})

// agreedのmatcherがx-auth-token: '' をバリデーションで弾くので req.headerの内容を破棄する
// NOTE: もしreq.headerを破棄する内容が増減した場合はここを変更する
server.use(function(req, _, next) {
  console.log(`${req.method} ${req.originalUrl}`)
  if (Object.keys(req.body).length !== 0) {
    console.log(req.body)
  }
  ;['x-auth-token', 'Content-Type'].forEach(headerName => {
    delete req.headers[headerName]
  })
  next()
})

server.use(
  agreed.middleware({
    path: './agreed/index',
  })
)

server.use((err, _, res) => {
  res.statusCode = 500
  console.log(err.statusMessage)
})

server.listen(port)

console.log(`start agreed server http://localhost:${port}`)
