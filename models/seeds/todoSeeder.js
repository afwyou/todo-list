require('../../config/mongoose')
const Todo = require('../todo') // 載入 todo model


db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < 10; i++) {
    Todo.create({ name: 'name-' + i })
  }
  console.log('done')
})//在伺服器連線的函式內創造資料，就會跑到資料庫裡面了嗎？
//為什麼在app.js要透過Todo.find()去mongodb找資料，是因為透過Todo.creat生成的所以必須用Todo.find()嗎？Todo感覺不像有存進什麼東西，而既然資料有存進去mongodb，還要透過Todo去取得Todo.create的資料，感覺這個流程中間隔了一道牆，是否不需要細究只需要先單純記住這樣的語法規則？
