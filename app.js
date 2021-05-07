const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
const Todo = require('./models/todo')
const bodyParser = require('body-parser')
// 設定每一筆請求都會透過 methodOverride 進行前置處理
const methodOverride = require('method-override')

const exphbs = require('express-handlebars');


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
    .sort({ _id: 'asc' })
    .then(todos => res.render('index', { todos }))//.then() 這一步資料會被放進 todos 變數，再把資料傳給index樣板
    .catch(error => console.error(error))//錯誤處理
})
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'))


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

app.put('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  const { name, check } = req.body
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      todo.isDone = check === 'on'
      // 這裡的isDone並不是物件實例的屬性isDone
      // 而是因為有一個name為isDone的表單，因為回傳了on的值，所以可以透過條件是形成true的布林值，這個true的布林值才會再儲存入物件實例中isDone的屬性
      //最後如果todo.isDone = true,再傳到view頁面的if條件式，進行checked與否的狀態

      // 取得input勾選的on值，取得該欄位的req的布林值，存入model的布林值，回傳到畫面if去判定是否要checked
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))//這是detail頁面的路由
    .catch(error => console.log(error))
})

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})




app.listen(3000, () => {
  console.log('app is running on http://localhost:3000')
})