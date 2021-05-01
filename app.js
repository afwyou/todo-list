const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
const Todo = require('./models/todo')

const exphbs = require('express-handlebars');

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected')
})
//mongoose有根mongodb連線，在todo.js裡創造了資料model，並在todoseeder.js存入mongodb十個資料
app.get('/', (req, res) => {
  Todo.find()// 取出 Todo model 裡的所有資料
    .lean()// 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(todos => res.render('index', { todos }))//.then() 這一步資料會被放進 todos 變數，再把資料傳給index樣板
    .catch(error => console.error(error))//錯誤處理
})

app.listen(3000, () => {
  console.log('app is running on http://localhost:3000')
})