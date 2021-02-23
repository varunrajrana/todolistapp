require("dotenv/config")

const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require('multer-s3')


//middleware
app.use(cors());
app.use(express.json());

//routes

//fileupload
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    })
  })


app.post('/upload', upload.single('pdf'), function(req, res, next) {
    res.send(req.file)
})

//add todo
app.post("/todo", async(req,res)=> {
    try {
        const {description} = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *",[description]);

        res.json(newTodo.rows[0]);
    }catch (err){
        console.error(err.message);
    }
});

//get all todos
app.get("/todo", async(req,res)=> {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    }catch (err){
        console.error(err.message);
    }
});

//get specific todo
app.get("/todo/:id", async(req,res)=> {
    try {
        const {id} = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1",[id]);
        res.json(todo.rows);
    }catch (err){
        console.error(err.message);
    }
});

//update todo
app.put("/todo/:id", async(req,res)=> {
    try {
        const {id} = req.params;
        const {description} = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description =$1 WHERE todo_id = $2",[description,id]);
        res.json("Todo updated");
    }catch (err){
        console.error(err.message);
    }
});

//delete todo
app.delete("/todo/:id", async(req,res)=> {
    try {
        const {id} = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1",[id]);
        res.json("Todo deleted");
    }catch (err){
        console.error(err.message);
    }
});

app.listen(5000,()=>{
    console.log("server at port 5000");
});