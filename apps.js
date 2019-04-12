var express=require("express")
//var passport=require("passport")
var mongoose=require("mongoose")
var bodyparser=require('body-parser');
var timetable=require("./models/timetable")
//var morgan=require("morgan")
var WT=require("./models/WT")
var AJ=require("./models/AJ")
var SE=require("./models/SE")
var DE=require("./models/DE")
//var User=require("./models/user")
//var ensureLoggedIn=require("connect-ensure-login").ensureLoggedIn

//var session=require("express-session")

//var secret=require("./config/amasecret")
//var passportConf=require("./config/amapassport")


//var MongoStore=require("connect-mongo")(session)



var app = express();
    //config=require('./config')

mongoose.connect("mongodb://localhost/local",function(err){
  if(err){
    console.log(err)
  }
  else{
    console.log("connected")
  }
})

app.use(bodyparser.urlencoded({extended:true}))
//app.use(morgan('dev'))

// app.use(session({
//     resave:true,
//     saveUninitialized:true,
//     secret:secret.secretKey,
//     //store:new MongoStore({url:"mongodb://localhost/amazon",autoReconnect:true})
// }))



// app.use(passport.initialize())
// app.use(passport.session())

// app.use(function(req,res,next) {
// res.locals.user=req.user
// next()
// })


// //var index=require("./public/js/index.js");






// app.use(bodyparser.json()); // parse application/json 

// var api=require('./app/routes')(app,express); //using the route.js file for routing
// app.use('/api',api);

// app.use(express.static(__dirname + '/public'));
// app.get('/main',function(req,res){
//     res.sendFile(__dirname +'/public/mains.html'); 
// })

// app.get('/signup',function(req,res){
//     res.sendFile(__dirname +'/public/index.html'); 
// })

// app.post("/signup",function(req,res) {
//     var user = new User()
//     //user.profile.name=req.body.name
//     user.name=req.body.username
    
//     user.email=req.body.email
//     user.phone=req.body.no
//     user.password=req.body.password
//     //user.verified=false
//     var a=0;
//     //user.profile.picture=user.gravatar()
//     User.findOne({email:req.body.email},function(err,existingUser){
//       if(existingUser){
        
//         console.log(req.body.email +"already exists")

//        // req.flash("errors","Existing email")
//          return res.redirect("/verify")
//       }

//       else{
    
//      user.save(function(err,user,next) {
//        // if(err) return next(err);

//         req.logIn(user,function(err) {
//             //if(err) return next(err);

//                  console.log(req.user+"user")
//                 // console.log(req.user._id+"viressh")

//                 res.redirect("/main")
//        })})}})})

// app.get("/login",function(req,res){
//     //if(req.user) return res.redirect("/main");
//           res.sendFile(__dirname +'/public/logins.html'); 
        
//                  console.log(req.user+"user")
//        // console.log(secret.database+"secret")
// })

// app.post("/login",passport.authenticate("local-login",{
//     successReturnToOrRedirect:"/main",
//     //successRedirect:'/profile',
//     failureRedirect:"/login",


// }))


// app.get('/verify',function(req,res){
//     res.sendFile(__dirname +'/public/signups.html'); 
// })

// app.get('/ride', ensureLoggedIn('/login'),function(req,res){
//     res.sendFile(__dirname +'/public/rides.html'); 
// })

// // app.get('/locate',function(req,res){
// //     res.sendFile(__dirname +'/public/geolocate.html'); 
// // })

app.get('/addsubject',function(req,res){
   
    res.sendFile(__dirname +'/public/indexes.html'); 
})


app.post("/WT",function(req,res){

  
     // var SubjectName=req.body.subjectname;
     
      var Dates=req.body.date;


     // var distance=req.body.x;
    
      var newbooking={Date:Dates}
      WT.create(newbooking,function(err,booking){
        if(err){
          console.log(err);
        }
        else{
          console.log(booking+"booking")
          //console.log(User+"user")
          console.log(Date())
          //User.booking.push(booking);
          //User.save();
          res.redirect("/addsubject");
        }
      })



    })

app.post("/AJ",function(req,res){

  
      //var SubjectName=req.body.subjectname;
     
      var Dates=req.body.date;


     // var distance=req.body.x;
    
      var newbooking={Date:Dates}
      AJ.create(newbooking,function(err,booking){
        if(err){
          console.log(err);
        }
        else{
          console.log(booking+"booking")
          //console.log(User+"user")
          console.log(Date())
          //User.booking.push(booking);
          //User.save();
          res.redirect("/addsubject");
        }
      })



    })

app.post("/SE",function(req,res){

  
      var SubjectName=req.body.subjectname;
     
      var Dates=req.body.date;


     // var distance=req.body.x;
    
      var newbooking={Date:Dates}
      SE.create(newbooking,function(err,booking){
        if(err){
          console.log(err);
        }
        else{
          console.log(booking+"booking")
          //console.log(User+"user")
          console.log(Date())
          //User.booking.push(booking);
          //User.save();
          res.redirect("/addsubject");
        }
      })



    })

app.post("/DE",function(req,res){

  
      var SubjectName=req.body.subjectname;
     
      var Dates=req.body.date;


     // var distance=req.body.x;
    
      var newbooking={Date:Dates}
      DE.create(newbooking,function(err,booking){
        if(err){
          console.log(err);
        }
        else{
          console.log(booking+"booking")
          //console.log(User+"user")
          console.log(Date())
          //User.booking.push(booking);
          //User.save();
          res.redirect("/addsubject");
        }
      })



    })
  
app.get("/subject",function(req,res){

      var dateobj = new Date();
      var b=dateobj.toString();
      //console.log(b+"bb"); 
      var char=b.split(' ');
       var day=char[0];
       var time=char[4];
       //console.log(day+"bb" +time);
       var timeind=time.split(":");
       //console.log(timeind+"ind");
       var hh=timeind[0];
       var mm=timeind[1];
       var ss=timeind[2];
       //console.log(mm+"mm");
       if(mm>=20 &&mm<40){
        mm=20
       }
       else if(mm>=40 &&mm<60){
        mm=40
       }
       else{
        mm="00";
       }
       console.log(mm+"mm");
       var final=day + " " + hh +":" + mm;
       console.log(final);
       timetable.findOne({Date:final},function(err,timetable){
        if(timetable){
   console.log("Schedule:" + timetable.Date)
        console.log("SubjectName:" + timetable.SubjectName)
         res.send("Schedule:" + timetable.Date + "     SubjectName:" + timetable.SubjectName);
         
        }
        else{
          console.log("Not found")
        }
})

//         AJ.findOne({Date:final},function(err,timetable){
//         if(timetable){
//    console.log("Schedule:" + timetable.Date)
//         console.log("SubjectName:" + timetable.SubjectName)
//          res.send("Schedule:" + timetable.Date + "     SubjectName:" + timetable.SubjectName);
         
//         }
//         else{
//           console.log("Not found")
//         }
// })
//          SE.findOne({Date:final},function(err,timetable){
//         if(timetable){
//    console.log("Schedule:" + timetable.Date)
//         console.log("SubjectName:" + timetable.SubjectName)
//          res.send("Schedule:" + timetable.Date + "     SubjectName:" + timetable.SubjectName);
         
//         }
//         else{
//           console.log("Not found")
//         }
// })
//           DE.findOne({Date:final},function(err,timetable){
//         if(timetable){
//    console.log("Schedule:" + timetable.Date)
//         console.log("SubjectName:" + timetable.SubjectName)
//          res.send("Schedule:" + timetable.Date + "     SubjectName:" + timetable.SubjectName);
         
//         }
//         else{
//           console.log("Not found")
//         }
// })
       

})



// app.get("/driver",function(req,res){
//   res.sendFile(__dirname +'/public/driver.html')
// })

// app.get("/logout",function(req,res) {
//     req.logout()
//     res.redirect("/main")
// })







app.listen(3000, function (err) {
	if(err){
    	console.log(err);
    }
    else{
    	console.log("Magic happens at http://localhost:8000");
    }
});


exports = module.exports = app;