const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
// const Todo = require('./models/todo')
const bodyParser = require('body-parser')
// 設定每一筆請求都會透過 methodOverride 進行前置處理
const methodOverride = require('method-override')
const routes = require('./routes')
const exphbs = require('express-handlebars');


db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected')
})
//mongoose有根mongodb連線，在todo.js裡創造了資料model，並在todoseeder.js存入mongodb十個資料

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)


app.listen(3000, () => {
  console.log('app is running on http://localhost:3000')
})