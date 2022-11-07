const express = require("express")
const { connection } = require("./config/db")
const UserModel = require("./model/User.model")
const bcrypt = require('bcrypt');
var cors = require('cors')
require('dotenv').config()
var jwt = require('jsonwebtoken');
const { authentication } = require("./Middleware/authentication");
const { TodoModel } = require("./model/Todo.model");



const app= express()
app.use(cors())
app.use(express.json())

const PORT= process.env.PORT || 4000
app.get("/", (req,res)=>{
    res.send("Welcome to todo!!")
})

//signup
app.post("/signup", async(req,res)=>{
    const {email,password} = req.body;

    bcrypt.hash(password, 6,async function(err, hash) {
        // Store hash in your password DB.
        if(err)
        {
            res.send("Somthing gone wrong")
        }
        const new_user= new UserModel({email,password:hash})
        await new_user.save()
        res.send({"mssg":"Signup Successful"})
    });

   
})

//login 
app.post("/login", async(req,res)=>{
    const {email, password} = req.body;
    const result = await UserModel.findOne({email})
     const userId= result._id
    const hash= result.password

    console.log(result)
    console.log(userId)
    bcrypt.compare(password, hash, function(err, result) {
        if(err){
            res.send({"mssg":"Invalid Credentials"})
        }
        // result == true
        else{ 
            const token = jwt.sign({userId}, process.env.SECRET_KEY);
            res.send({"mssg":"Login Successfull", "token":token})
        }
       

    });
    
   
})

//todo
app.post("/todo", authentication, async(req,res)=>{
    const {taskname,status,tag} = req.body
    const new_todo= new TodoModel({taskname, status,tag})
    await new_todo.save()
    res.send({new_todo})

})

//todoget
app.get("/gettodo", authentication, async(req,res)=>{
    const {user_id} = req.body
    const all_todo= await TodoModel.find({user_id:user_id})
    res.send({all_todo})
})

app.listen(PORT,async ()=>{
    try{
       await connection
       console.log(`Sucessfully connected to DB ${PORT}`)
    }
    catch(err){
       console.log(err)
    }
    console.log("Port ready")
})