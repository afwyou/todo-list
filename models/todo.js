const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  },
  //新增一個屬性，可以透過表單的name = isDone 來取得對應的填入資料
  //再透過這個isDone的布林值，來對checkbox的狀態作轉換
  isDone: {
    type: Boolean,
    default: false  //預設
  }
})
module.exports = mongoose.model('Todo', todoSchema)//把這份 schema 命名為 Todo，以後在其他的檔案直接使用 Todo 就可以操作和「待辦事項」有關的資料了！