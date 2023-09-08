//Importing NPM FILES
const express =require("express");
const app = express();
const cors  =require ("cors");
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const socket = require('socket.io')
const dotenv = require('dotenv')
const multer = require( "multer");
const {GridFsStorage} = require('multer-gridfs-storage');
const grid = require('gridfs-stream')


dotenv.config()

const URL = process.env.url

//Using MiddleWares
const corsOptions = {
    origin: 'https://frabjous-mermaid-b10de5.netlify.app', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  
app.use(cors(corsOptions));
app.use(bodyParser.json());

let upload
try{
const storage = new GridFsStorage({
    url: URL,
    file: (req, file) => {
        const obj = {filename: Date.now() + '-file-' + file.originalname};
        console.log(obj)
      return  obj
    }
  });
console.log(storage,"storeee")
upload =  multer({storage:storage}); 
console.log(upload,"uploaade")
}
catch(e){console.log("ERRORsssssssss" ,e)}

let gfs,gridFSBucket,conn
async function setupConnection() {  
    try {
      mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('db connected');
  
      conn = mongoose.connection;
      conn.once('open', () => {
        gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'fs' });
        gfs = grid(conn.db, mongoose.mongo);
        gfs.collection('fs');
        console.log('GridFS initialized successfully.');
      
    })
    } catch (e) {
      console.error(e);
    }
  }
  setupConnection();


    //User SignIn
const userSchema = new mongoose.Schema({
    userid:String,
    username: String,
    email:String,
    dp:String
});
const User = mongoose.model('User',userSchema);


// Friend-List Schema
const friendlistSchema  = new mongoose.Schema({
    names: [{userid: String ,username : String}] , 
    room: String,
    type: String
})
//FriendDB Schema
const friendSchema = new mongoose.Schema({
    userid: String,
    username:String,
    friends: [friendlistSchema]
});

const Friend = mongoose.model('Friend',friendSchema);


//All unique Group Names 
const groupSchema = new mongoose.Schema({
    name:String,
    friendlist:[{userid: String ,username : String}],
    dp:String
});

const Group = mongoose.model('Group',groupSchema);


//ChatSchema
const chatSchema = new mongoose.Schema({
    userid:String , username:String,
    msg : [ { room : String , content : [{senderid:String, sendername:String, body:String , filename:String, msgType:String, timestamp:String , status:String}] } ]
});
const Chat = mongoose.model('Chat',chatSchema);
 


app.post('/loginuser',async (req,res)=>{
    const existingUser = await User.findOne({userid : req.body.sub })
    if (!existingUser){
            const newUser = new User({  
            userid : req.body.sub.toString(),
            username:req.body.name,
            email:req.body.email,
            dp:req.body.picture
           
        })
        newUser.save();
    }
    res.json(req.body.sub.toString())
})

const getAllUsers=async()=>{
    const user = await User.find({})
    if (user.length===0) { return([{username:'No Friends Added'}])}
    else {
        let users = []
        user.forEach(item=>{
            users.push({userid : item.userid, username:item.username})
        })
        return users
    }
}

app.get('/getAllUsers',async (req,res)=>{
    const user  =await getAllUsers();
    res.json(user)
})


//Check whether name exist in UserDB
app.post('/check-friend',async (req,res)=>{
    const doFriendExist = await User.findOne({userid:req.body.userid})
    if (!doFriendExist){res.json('fail')}
    else {res.json('success')}
})


app.post('/check-group-name',async (req,res)=>{
    const doesGroupNameExist = await Group.findOne({name:req.body.group})
    if (doesGroupNameExist ){res.json('fail')}
    else {res.json('success')}
})


 
//Get FriendList from GroupDB
app.post('/getGroupFriendList',async (req,res)=>{
    const grp = await Group.findOne({name:req.body.room})
    if (grp) res.json(grp.friendlist)
    else res.json([])
})

// Add Friend in FriendDB -> user->friend  and friend->user
app.post('/add-friend',async (req,res)=>{
    let room = req.body.room;
    let type = req.body.type;
    let fl = [];

    let users = await getAllUsers()
    req.body.friendList.forEach(item=>{
        const obj = users.find(obj => obj.userid === item);
        fl.push(obj)
    })
    
    if (type==='group'){
        const newGrp = new Group ({name:room , friendlist:fl})
        await newGrp.save()
    }   
    //Each user in friendList must be friend to group of remaining others in friendList
    fl.forEach(async (item)=>{
        var flag=1
        let checkFriend = await Friend.findOne({userid:item.userid});
        if (!checkFriend){checkFriend =  new Friend({userid:item.userid})}
        //Check if friend already exist for a user in FriendDB using room-name
        for(let i= 0 ; i<checkFriend.friends.length;i++){
            if (checkFriend.friends[i].room===room && checkFriend.friends[i].type===type){
                flag=0;
                break
            }
        }
        if  (flag===1){
            let friendNames = fl.filter(j=>j.userid!==item.userid)
            checkFriend.friends.push({names:friendNames , room : room, type:type})
            await checkFriend.save()
        } 
    })
    res.json('success')
})

//Show Friend List
app.post('/friendList',async (req,res)=>{
    const friends = await Friend.findOne({userid:req.body.userid})
    if (!friends){res.json('Empty');}   
    else{res.json(friends.friends);}    
 })

 app.post('/updateFriendList', async (req, res) => {
    try {
        const user = await Friend.findOne({ userid: req.body.userid });
        if (user) {
            const topfriendIndex = user.friends.findIndex(item => item.room === req.body.room);
            if (topfriendIndex !== -1) {
                const topfriend = user.friends.splice(topfriendIndex, 1)[0];
                user.friends.push(topfriend);
                await user.save();
                res.json('success');
            }
        }
    } catch (error) {res.json('error');}
});


// Upload and Display Files  

app.post('/uploadFile',upload.single('file'), (req,res)=>{
    console.log(req.file.filename , "here....")
    const imgUrl = "https://chatapp-backend-poxg.onrender.com/file/"+req.file.filename
    res.json(imgUrl)
})



app.get('/file/:filename',async(req,res)=>{
    const file =await gfs.files.findOne({filename:req.params.filename})
    console.log("file " , file)
    if (file)
    {const readStream =gridFSBucket.openDownloadStream(file._id);
    readStream.pipe(res)}
})

//Save Msg to ChatDB
 app.post('/sendMsg',async (req,res)=>{
    const user = await User.findOne({userid:req.body.senderid})
    saveMsg(req.body.senderid,user.username,req.body,'Delivered')
    let receiver = await Friend.findOne({userid: req.body.senderid})
    let names =[]
    for (var i = 0 ; i<=receiver.friends.length;i++){
        if (receiver.friends[i].room ===req.body.room){
            names=receiver.friends[i].names
            break
        }
    }
    names.forEach(name=>{
        saveMsg(name.userid,name.username,req.body,'Received')
    })
    
    res.json({...req.body, sendername:user.username})
 })

const saveMsg=async(userid, username, obj,status)=>{
    let user  = await Chat.findOne({userid:userid})
    let getname = await User.findOne({userid:obj.senderid})
    if (!user) {user = new Chat({userid:userid,username:username})}
    flag=0
    const content = {senderid: obj.senderid, sendername: getname.username, body :obj.body, filename:obj?.filename ,msgType:obj.msgType, timestamp : obj.timestamp , status:status}
    
    for (var i =0 ; i<user.msg.length ; i++){
        if (user.msg[i].room === obj.room){
            user.msg[i].content.push(content)
            flag=1
            break
        }
    }
    if (flag===0){user.msg.push ({ room:obj.room, content : [content] }) }
    user.save()
}

// Retrieve Messages
app.post('/showMsg',async (req,res)=>{
    const user  = await Chat.findOne({userid:req.body.userid})
    let flag = 0
    if (user){
    for (var i =0 ; i<user.msg.length ; i++){
        if (user.msg[i].room === req.body.room){
            flag=1
            res.json(user.msg[i].content)
            break
        }}}
    if (flag===0) res.json('FAIL')
})

app.post('/lastMsg',async (req,res)=>{
    const user  = await Chat.findOne({userid:req.body.userid})
    let flag = 0
    if (user){
        for (var i =0 ; i<user.msg.length ; i++){
            if (user.msg[i].room === req.body.room){
                flag=1
                res.json(user.msg[i].content[user.msg[i].content.length-1])
                break
        }
    }
    }
    if (flag===0) {res.json('Fail')}
})


// Get/Set Propile Pictures
app.post('/fetchDP',async (req,res)=>{
    let user;
    if(req.body.type==='individual'){ user = await User.findOne({userid:req.body.userid})}
    else  if(req.body.type==='group') { user = await Group.findOne({name:req.body.username}) }
    if (user){res.json(user.dp)}
    else {res.json('NotFound')}
})

app.post('/setDP',async (req,res)=>{
    if (req.body.type==='individual'){
    const user = await User.findOne({userid:req.body.userid})
    if (user) {user.dp=req.body.dp; user.save()}}
    else  {const grp = await Group.findOne({name:req.body.username})
            grp.dp=req.body.dp; 
            grp.save()
    }
    
    res.json('success')
})


//Delete Friend

app.post('/exitGrp',async (req,res)=>{
    deleteChat(req.body.item.room, req.body.userid)
    let friends =[]
    if (req.body.item.type==='group'){
    const grp = await Group.findOne({name:req.body.item.room})
    friends = grp.friendlist
    grp.friendlist = grp.friendlist.filter(i=>i.userid!==req.body.userid)
    if (grp.friendlist.length===0){
        await Group.deleteOne({name:req.body.item.room})
    }
    await grp.save()

    friends.forEach(async (friend)=>{
        
        const f = await Friend.findOne({userid:friend.userid})
        if (f.userid===req.body.userid){
            f.friends = f.friends.filter(i=>i.room!==req.body.item.room)
        }
        else{
        for (i of f.friends){
            if (i.room===req.body.item.room){
                i.names = i.names.filter(j=>j.userid!==req.body.userid)
                break
            }
        }}
        await f.save()
    })}

    else{
        const f = await Friend.findOne({userid:req.body.userid})
        f.friends = f.friends.filter(i=>i.room!==req.body.item.room)
        const f2 = await Friend.findOne({userid:req.body.item.userid})
        f2.friends = f2.friends.filter(i=>i.room!==req.body.item.room)
        f.save();f2.save()        
    }
    res.json('success')
})


//Add Friend in a group
app.post('/addFriendinGrp',async (req,res)=>{
    const getfriend = await User.findOne({userid:req.body.newFriend})
    const grp = await Group.findOne({name:req.body.item.room})
    const friends = [...grp.friendlist] 
    grp.friendlist.push({userid : req.body.newFriend , username: getfriend.username})
    await grp.save()
    friends.forEach(async (friend)=>{
        const f = await Friend.findOne({userid:friend.userid})
        if (f){
        for (i of f.friends){
            if (i.room===req.body.item.room){
                i.names.push({userid : req.body.newFriend , username: getfriend.username})
                break
            }
        }
        await f.save()}
    })
    let newUser = await Friend.findOne({userid:req.body.newFriend})
    if(!newUser) {newUser = new Friend({userid : req.body.newFriend , username: getfriend.username})}
    newUser.friends.push({names:friends , room:req.body.item.room , type:'group'})
    await newUser.save()
    res.json('success')
})

//Delete All Conversations
const deleteChat =async(room,userid)=>{
    const chat = await Chat.findOne({userid})
    if (chat){
    chat.msg = chat.msg.filter(i=>i.room!==room)
    await chat.save()}
}
app.post('/deleteChat',async (req,res)=>{
    await deleteChat(req.body.item.room,req.body.userid)
    res.json('success')
})



//SOCKETS
const socketSchema  = new mongoose.Schema({
    userid : String, 
    id : String
})

const Socket = mongoose.model('Socket',socketSchema);

const PORT  = process.env.PORT || 8080

const server = app.listen(PORT,()=>{
    console.log("Server Started")
})
const io =socket(server,{
    cors:{orgin:'*'}
});



const getOnlineUsers =async()=>{
    const socketIds = await Socket.find({})
    return socketIds
}


io.on('connection' , (socket)=>{
    
    socket.on('join-room',async(userid)=>{
        flag=0
        const user = await Socket.findOne({userid})
        if (!user) {
            const newUser = new Socket({userid , id:socket.id})
            await newUser.save()
        }
        else{
            user.id = socket.id
            await  user.save()
        }
        socket.join(socket.id)    
        let ids = await getOnlineUsers()
        io.emit('onlineUsers' ,ids )    

    })
    socket.on('send-message',async(msg)=>{
        const socketIds = await Socket.find({})
        if (msg.name.type==='individual'){
            for (socketId of socketIds){
                if (socketId.userid===msg.name.userid ) {
                    socket.to(socketId.id).emit('receive-message',{...msg,status:'Received'});
                    break
                }
                
            }
        }
        else {
            const allreceivers= await Group.findOne({name:msg.room})
            
            for (fname of allreceivers.friendlist){
            for (socketId of socketIds){
                if (socketId.userid===fname.userid && fname.userid!==msg.senderid ) {
                    socket.to(socketId.id).emit('receive-message',{...msg,status:'Received'});
                    break
                }
            }}


        }
        
    })
    
    socket.on('show-friendlist',async (friendlist)=>{
        const socketIds = await Socket.find({})
        friendlist.forEach(friend=>{
            for (socketId of socketIds){
                if (socketId.userid===friend){
                    io.to(socketId.id).emit('update-friendList');
                    break
                }
            }
        })
    })

    


    socket.on('deleted-friendlist',async (friendid, deletedid)=>{
        const socketIds = await Socket.find({})
        for (socketId of socketIds){
            if (socketId.userid===friendid){
                socket.to(socketId.id).emit('delete-in-friendList',deletedid,'individual');
                break
            }
        }
    })

    

    socket.on('updateDP',async()=>{
        io.emit('receiveDP');        
    })

    socket.on('close-tab',async(userid)=>{
        const res = await Socket.findOne({userid:userid})
        if (res){io.to(res.id).emit('close-tab-prompt')}
    })

    socket.on('disconnectings',async(userid)=>{
        await Socket.deleteOne({userid})  
        let ids = await getOnlineUsers()
        io.emit('onlineUsers' ,ids ) 
    })
    socket.on('disconnect',()=>{
        //console.log("Disconnected")
    })
})







