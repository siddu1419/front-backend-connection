const exp=require('express')

const userApi=exp.Router();
const errorhandler= require("express-async-handler")
const bcryptjs=require("bcryptjs")
const jwt =require("jsonwebtoken")

//body parser middleware
userApi.use(exp.json())


const mc=require('mongodb').MongoClient

//on string
const databaseUrl ="mongodb+srv://siddhu:siddhu@backend.tsjcp.mongodb.net/backend?retryWrites=true&w=majority"

let userCollectionObj;

mc.connect(databaseUrl,{useNewUrlParser:true,useUnifiedTopology:true},(err,client)=>{
    if(err){
        console.log("err in data base",err);
    }
    else{
        let databaseObj=client.db("backend");
        userCollectionObj=databaseObj.collection("usercollection");
        console.log("connected to database");
    }
})


//getusers
/*userApi.get('/getusers',(req,res,next)=>{

    userCollectionObj.find().toArray((err,usersList)=>{
        if(err){
            console.log("err in reading get user",err);
            res.send({message:err.message})
        }
        else{
            res.send({message:usersList})
        }
    })

})*/

//getuser by asycn and await
userApi.get('/getusers',errorhandler(async(req,res)=>{
    let userlist= await userCollectionObj.find().toArray()
    
    res.send({message:userlist})
}))



//get user by username
/*userApi.get('/getuser/:username',(req,res,next)=>{
    let un=req.params.username;

    //search user
    userCollectionObj.findOne({username:un},(err,userObj)=>{

        if(err){
            console.log("err in reading specifc username",err);
            res.send({message:err.message})
        }
        if(userObj===null){
            res.send({message:"user not found"})
        }
        else{
            res.send({message:userObj})
        }

    })
})*/

//get user by username using async and await
userApi.get('/getuser/:username',errorhandler(async(req,res)=>{
    let un=req.params.username
    let userobj = await userCollectionObj.findOne({username:un})
    if(userobj===null){
        res.send("no user existed with username" )
    }
    else{
        res.send({message:userobj})
    }
}))




//create new user
/*userApi.post('/createuser',(req,res,next)=>{
    let newUser=req.body;

    console.log(newUser);

    //check user if already present

    userCollectionObj.findOne({username:newUser.username},(err,userObj)=>{
        if(err){
            console.log(err);
            res.send({message:err.message})
        }
        if(userObj===null){
            userCollectionObj.insertOne(newUser,(err,success)=>{
                if(err){
                    res.send({message:err.message})
                }
                else{
                    res.send({message:"user created"})
                }
            })
        }
        else{
            res.send({message:"user already existed"})
        }
    })
    
})*/

//creating a new user with async and await
userApi.post("/createuser",errorhandler(async(req,res)=>{
    newuser=req.body;
    let user= await userCollectionObj.findOne({username:newuser.username})
    if(user===null){
        //hash password
        let hashedpassword=await bcryptjs.hash(newuser.password,7)
        //replace password
        newuser.password=hashedpassword
        //insert
       await userCollectionObj.insertOne(newuser)
        res.send({message:"new user created successfully"})
    }
    else{
        res.send({message:"user already existed"})
    }
}))



//update user
/*userApi.put('/updateuser/:username',(req,res,next)=>{

    let modifiedUser=req.body;

    userCollectionObj.updateOne({username:modifiedUser.username},{
        $set:{ ...modifiedUser}
        },(err,success)=>{

        if(err){
            console.log("err dur to put is",err)
            res.send({message:err.message})
        }
        else{
            res.send({message:"update succesfully"})
        }

    })
    

})*/

//update user using await and sync
userApi.put("/updateuser/:username" ,errorhandler(async(req,res)=>{
    modifieduser=req.body;
     await userCollectionObj.updateOne({username:modifieduser.username},{$set:{...modifieduser}})
     res.send({message:"updated user"})

}))




//delete user
/*userApi.delete('/deleteuser/:username',(req,res,next)=>{

    let toDeleteun=req.params.username;

    userCollectionObj.findOne({username:toDeleteun},(err,deleteObj)=>{
        if(err){
            console.log("err in delete is",err)
            res.send({message:err.message})
        }
        if(deleteObj===null){
            res.send({message:"no user existed"})
        }
        else{
            userCollectionObj.deleteOne({username:deleteObj.username},(err,success)=>{
                if(err){
                    console.log("err in delete is",err)
                    res.send({message:err.message})
                }
                else{
                    res.send({message:"delete success"})
                }

            })
        }
    })
})*/



//delete user using async and await
userApi.delete("/deleteuser/:username",errorhandler(async(req,res)=>{
    deleteuser=req.params.username;
    let user=await userCollectionObj.findOne({username:deleteuser})
    if(user===null){
        res.send({message:"no user to delete"})
    }
    else{
        userCollectionObj.deleteOne({username:deleteuser})
        res.send({message:"deleted user"})
    }


}))

userApi.post("/login",errorhandler(async(req,res)=>{
    let credentials=req.body;
    let user = await userCollectionObj.findOne({username:credentials.username})
    if(user===null){
        res.send({message:"user not found"})
    }
    else{
       let result=await bcryptjs.compare(credentials.password,user.password)
       if(result===false){
           res.send({message:"invalid password"})
       }
       else{
           //create a token 
           let signedtoken=jwt.sign({username:credentials.username},"abcdef",{expiresIn:120})
           //send token to client
           res.send({message:'login success',token:signedtoken,username:credentials.username,userObj: user})
       }
    }
}))

module.exports=userApi