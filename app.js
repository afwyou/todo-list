const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
const Todo = require('./models/todo')
const bodyParser = require('body-parser')

const exphbs = require('express-handlebars');

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

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

app.get('/todos/new', (req, res) => {
  return res.render('new')
})//為什麼要有return???


app.post('/todos', (req, res) => {
  const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
  return Todo.create({ name })     // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('detail', { todo }))//產生了todo這個實例
    .catch(error => console.log(error))
})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))//這是fetail頁面的路由
    .catch(error => console.log(error))
})




app.listen(3000, () => {
  console.log('app is running on http://localhost:3000')
})