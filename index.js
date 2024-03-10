const express=require('express');
const cors=require('cors');
const {MongoClient}=require('mongodb');
const bcrypt=require("bcrypt");

const app=new express();
app.use(express.json());
app.use(cors());

app.get('/home',(req,res)=>{
    res.send("home page")
})
const client=new MongoClient('mongodb+srv://admin:admin@cluster0.akcnxdb.mongodb.net/?retryWrites=true&w=majority')
client.connect()
const db=client.db('cvms');
const col=db.collection('register');

const col2=db.collection('data');

app.post('/insert', async(req, res) => {
    console.log(req.body);
    req.body.password=await bcrypt.hash(req.body.password,5)
    col.insertOne(req.body);
        res.send("successfully received");
})
app.get('/showall',async(req,res)=>{
    const result=await col.find().toArray();
    res.send(result)
})
app.post('/delete',async(req,res)=>{
    const result1=await col.findOne({'name':req.body.un});
    console.log(result1);
    if (result1.password==req.body.pw){
        col.deleteOne(result1);
        console.log("deleted")
    }
   
})
app.post('/check',async(req,res)=>{
    const result2=await col.findOne({'name':req.body.un});
    console.log(result2);
    if (result2.password==req.body.pw) {
        res.send(result2)
    }
    else if (await bcrypt.compare (req.body.pw,result2.password)){
        res.send(result2)
    }
        else{
        res.send("failed")
    }
   })
app.post('/api/donate', (req, res) => {
    const formData = req.body;
    console.log('Received donation form data:', formData);
    res.status(200).send('Form submitted successfully');
  }); 

app.post('/submit-form', (req, res) => {
    const formData = req.body;
    console.log('Form data received:', formData);
    res.status(200).send('Form data received successfully');
  });
  
app.post('/update',async(req,res)=>{
    console.log(req.body)

    const {un,pw,ro,em}=req.body
    await col.updateOne({name:un},{
        $set:{
            password:pw,
            role:ro,
            email:em
        }
    } )
   
})

app.listen(8081);
console.log("server running");