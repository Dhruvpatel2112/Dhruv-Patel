 // var filename   = "Attendance.csv";

/*  Attendance.find().lean().exec({}, function(err, products) {
        if (err) res.send(err);
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename='+filename);
        res.csv(products, true);
    });*/
//console.log(columns[0]+"columns")
    let data = [];
//     var fft=[10,20];

//       var dateobj = new Date();
//       var b=dateobj.toString();
//       var char=b.split(' ');
//       var day=char[0];
//       var time=char[4];
//       var timeind=time.split(":");
//       var hh=timeind[0];
//       var mm=timeind[1];
//       var ss=timeind[2];
//       var final=day + " " + hh +":" + mm;
let data1=[]
for(i=0;i<10;i++){
  data1.push(i);
}
// columns.push(final)
json={...columns};

// Attendance.aggregate(
//  [ { "$match": { "EnrollmentNo": "160010107049" } },
//   // { "$unwind": "$friends" },
//   // { "$match": { "friends.status": 0 } },
//   function( err, data ) {

//     if ( err )
//       throw err;

//     console.log( JSON.stringify( data, undefined, 2 ) );

//   }
// ]);

// Attendance.aggregate([
//                 { $match: { $and: [{'attendance.subjectname' : 'WT' }, {'attendance.date':"2019-02-17 15:26:04.103"} ]},
//                 // { $group: {
//                 //     _id: '$id',
//                 //     game_total: { $sum: '$game_amount'}, 
//                 //     game_total_profit: { $sum: '$game_profit'}}
//                 // }}
// ]).exec(function ( e, d ) {
//     console.log( d.length+"d")            
// });


// Attendance.aggregate([
//                    { 
//                      $match: {
//                           $and: [ 
//                               {'attendance.subjectname':'WT' }, 
//                               { 'attendance.date':new Date("2019-02-16 15:26:04.103")}
//                               // {time: {$lt:ISODate("2013-12-09T00:00:00Z")}}
//                           ]
//                      }
//                    }
//                   ]).exec(function ( e, d ) {
//     console.log( d.length+"d" )    

// });
//makeCSV();


// Attendance.aggregate([
//   { "$match": { 
//     //"_id": mongoose.Types.ObjectId(req.params.id),
//     "attendance": {
//       "$elemMatch": { "$gte": start, "$lt": end }
//     }
//   }}])
// .exec(function ( e, d ) {
//   console.log( d.length+"d" )            
//  });




function add(){

      var dateobj = new Date();
      var b=dateobj.toString();
      var char=b.split(' ');
      var day=char[0];
      var time=char[4];
      var timeind=time.split(":");
      var hh=timeind[0];
      var mm=timeind[1];
      var ss=timeind[2];
       
      // if(mm>=20 &&mm<40){
      //   mm=20
      //  }
      //  else if(mm>=40 &&mm<60){
      //   mm=40
      //  }
      //  else{
      //   mm="00";
      //  }
        console.log(mm+"mmfirst");

       if(mm%2!=0){
       mm=mm-1;
       if(mm<10){
        mm="0"+mm;
       }
       }

    
       console.log(mm+"mm");
       var final=day + " " + hh +":" + mm;
       console.log(final+"final");
       timetable.findOne({Date:final},function(err,timetable){
       if(timetable){
       console.log("Schedule:" + timetable.Date)
       console.log("SubjectName:" + timetable.SubjectName)
       var date= new Date();
      
        var status,newdate;
       Attendance.find({ },function(err,user){
           if(err)
           {
           console.log(err);
           }
           else
           {
              for(i=0;i<user.length;i++){
                if(result.e_no.indexOf(parseInt(user[i].EnrollmentNo))==-1){
                  //status='A';
                }
                
                else{
                  status='P'
                  newdate={subjectname:timetable.SubjectName,date:date,status:status}
                 user[i].attendance.push(newdate);
            user[i].save();
            console.log("added")
                }

       
              }
           
            }
            })
          }  
      else
      {
      console.log("Not found")
      }
      }
      )
      setTimeout(add,120000)
      }



        // if(mm>=20 &&mm<40){
      //   mm=20
      //  }
      //  else if(mm>=40 &&mm<60){
      //   mm=40
      //  }
      //  else{
      //   mm="00";
      //  }




      app.get("/attendance", function (req, res) {
  console.log("hiii")
  var date = "28Jan"
  var status = true
  var i = 0;
  var newdate = { date: date, status: status }
  for (i = 0; i < 50; i++) {
    Attendance.findOne({ EnrollmentNo: "160010107049" }, function (err, user) {
      user.WT.push(newdate);
      user.save();
      console.log(user)
    })
  }
})