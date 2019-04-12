var express = require('express')
var passport = require("passport")
var mongoose = require("mongoose")
//const fileUpload = require('express-fileupload');
var bodyparser = require('body-parser');
var Faculty = require("./models/faculty")
var Admin = require("./models/admin")
var Student = require("./models/student")
var Leave = require("./models/leave")
var cookieParser = require('cookie-parser')
var session = require("express-session")
var Attendance = require("./models/attendance")
var timetable = require("./models/timetable")
var result = require("./one.json")
var passportConf = require("./config/amapassport")
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var rand, mailOptions, host, link;
var exphbs = require('express-handlebars');
var csv = require('csv-express');
var stringify = require("csv-stringify")
const http = require("http");
var app = express();
var multer = require("multer");
var fs = require("fs");
var path = require("path");
var upload = multer({ dest: 'tmp/' });
const accountSid = "AC48cd8c66886e3aa0f82890c8b2166e04";
const authToken = "2174366d780c3abf68f347516c8fcb82";
const client = require('twilio')(accountSid, authToken);


const handleError = (err, res) => {
	res
		.status(500)
		.contentType("text/plain")
		.end("Oops! Something went wrong!");
};

// const upload = multer({
//   dest: "tmp/"
//   // you might also want to set some limits: https://github.com/expressjs/multer#limits
// });


//var multer  = require('multer');
//var upload = multer({ dest: '/tmp/'});
//var ejs=require("ejs")
// app.set('views', path.join(__dirname, 'views'));
// app.engine('html', require('ejs').renderFile,);
// app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'html');

var smtpTransport = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: "verifyverify19@gmail.com",
		pass: "Gmail1234"
	}
});

mongoose.connect("mongodb://localhost/AttendanceSystem", function (err) {
	if (err) {
		console.log(err)
	}
	else {
		console.log("Connected1")
	}
})

app.use(express.static('public'))

app.use(bodyparser.urlencoded({ extended: true }))
app.use(cookieParser("hey"));


//app.use(fileUpload());

app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: "hey",
	//store:new MongoStore({url:"mongodb://localhost/amazon",autoReconnect:true})
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(function (req, res, next) {
	res.locals.user = req.user
	next()
})
//var index=require("./public/js/index.js");
app.use(bodyparser.json());

//add function to store attendence in database
var loop = 160010107001;


// var Storage = multer.diskStorage({
//     destination: function(req, file, callback) {
//         callback(null, "./tmp");
//     },
//     filename: function(req, file, callback) {
//         callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
//     }
// });

// var upload = multer({
//     storage: Storage
// }).array("imgUploader", 3);


function addobject() {

	newno = { EnrollmentNo: loop }
	Attendance.create(newno, function (err, user) {
		if (err) throw err;
		console.log("added")
		//console.log("added")
	})
	loop = loop + 1;
	if (loop < 160010107061) {
		setTimeout(addobject, 2000);
	}
}
//addobject();

function add() {

	var dateobj = new Date();
	var b = dateobj.toString();
	var char = b.split(' ');
	var day = char[0];
	var time = char[4];
	var timeind = time.split(":");
	var hh = timeind[0];
	var mm = timeind[1];
	var ss = timeind[2];
	console.log(mm + "mmfirst");
	if (mm % 2 != 0) {
		mm = mm - 1;
		if (mm < 10) {
			mm = "0" + mm;
		}
	}
	console.log(mm + "mm");
	// var final = day + " " + hh + ":" + mm;
	var final="MON 10:22";
	console.log(final + "final");
	timetable.findOne({ Date: final }, function (err, timetable) {
		if (timetable) {
			console.log("Schedule:" + timetable.Date)
			console.log("SubjectName:" + timetable.SubjectName)
			var date = new Date();
			var status = "P";
			for (i = 0; i < result.e_no.length; i++) {
				Attendance.findOne({ EnrollmentNo: result.e_no[i] }, function (err, user) {
					if (err) throw err;
					newdate = { subjectname: timetable.SubjectName, date: date, status: status }
					user.attendance.push(newdate);
					user.save();
					console.log(user.EnrollmentNo + "is Present")
				})
			}
		}
		else {
			console.log("Not found")
		}
	})
	setTimeout(add, 120000)
}

//add();


app.get('/signup', function (req, res) {
	res.render('signup');
})

app.post("/signup", function (req, res) {
	var admin = new Admin()
	//user.profile.name=req.body.name
	admin.username = req.body.name;
	admin.password = req.body.password;
	Admin.findOne({ username: req.body.name }, function (err, existingUser) {
		if (existingUser) {
			console.log(req.body.enrollno + "already exists")
			return res.redirect("/signup")
		}
		else {
			admin.save(function (err, user, next) {
				// if(err) return next(err);
				req.logIn(admin, function (err) {
					//if(err) return next(err);
					console.log(req.user + "user")
					res.redirect("/main")
				})
			})
		}
	})
})

app.get("/login", isLoggedOut, function (req, res) {
	res.render('login');
}
)

app.post("/Adminlogin", function (req, res) {
	passport.authenticate("admin-login", function (err, user, params) {
		if (req.xhr) {
			//thanks @jkevinburton
			if (err) {
				return res.json({ error: err.message });
			}

			// e.g. in auth.js:
			// if (!user.emailVerified) { return done(null, false, { message: 'Email is not verified. Please check your email for the link.' }); }
			if (!user && params) {
				return res.json({ error: params.error });
			}
			if (!user) {
				return res.json({ error: "Invalid Login" });
			}
			req.login(user, {}, function (err) {
				if (err) {
					return res.json({ error: err });

				}

				console.log("reqlogin")
				return res.json({
					user: {
						id: req.user.id,
						email: req.user.email,
						joined: req.user.joined
					},
					success: true
				});
			});
		}
		else {
			if (err) {
				return res.redirect("/login");
			}
			if (!user) {
				return res.redirect("/login");
			}
			req.login(user, {}, function (err) {
				if (err) {
					return res.redirect("/login");
				}
				console.log("hello")
				console.log(req.user + "req.user")
				return res.redirect("/main");
			});
		}
	})(req, res);
});


app.post("/Facultylogin", function (req, res) {
	passport.authenticate("faculty-login", function (err, user, params) {
		if (req.xhr) {
			//thanks @jkevinburton
			if (err) {
				return res.json({ error: err.message });
			}

			// e.g. in auth.js:
			// if (!user.emailVerified) { return done(null, false, { message: 'Email is not verified. Please check your email for the link.' }); }
			if (!user && params) {
				return res.json({ error: params.error });
			}
			if (!user) {
				return res.json({ error: "Invalid Login" });
			}
			req.login(user, {}, function (err) {
				if (err) {
					return res.json({ error: err });
				}
				return res.json({
					user: {
						id: req.user.id,
						email: req.user.email,
						joined: req.user.joined
					},
					success: true
				});
			});
		}
		else {
			if (err) {
				return res.redirect("/login");
			}
			if (!user) {
				return res.redirect("/login");
			}
			req.login(user, {}, function (err) {
				if (err) {
					return res.redirect("/login");
				}
				return res.redirect("/main");
			});
		}
	})(req, res);
});


app.post("/Studentlogin", function (req, res) {

	passport.authenticate("student-login", function (err, user, params) {
		if (req.xhr) {
			//thanks @jkevinburton
			if (err) {
				return res.json({ error: err.message });
			}

			// e.g. in auth.js:
			// if (!user.emailVerified) { return done(null, false, { message: 'Email is not verified. Please check your email for the link.' }); }
			if (!user && params) {
				return res.json({ error: params.error });
			}
			if (!user) {
				return res.json({ error: "Invalid Login" });
			}
			req.login(user, {}, function (err) {
				if (err) {
					return res.json({ error: err });
				}
				return res.json({
					user: {
						id: req.user.id,
						email: req.user.email,
						joined: req.user.joined
					},
					success: true
				});
			});
		} else {
			if (err) {
				return res.redirect("/login");
			}
			if (!user) {
				return res.redirect("/login");
			}
			req.login(user, {}, function (err) {
				if (err) {
					return res.redirect("/login");
				}
				return res.redirect("/main");
			});
		}
	})(req, res);
});


app.post("/admin/addfaculty", function (req, res) {
	var name = req.body.name;
	var subject = req.body.subject;
	var email = req.body.email;
	var contactno = req.body.contactno
	var password = req.body.password;
	var newfaculty = { username: name, password: password, email: email, subject: subject, contactno: contactno };

	Faculty.create(newfaculty, function (err, faculty) {
		if (err) {
			console.log(err)
		}
		else {
			res.redirect("/admin")
		}
	}
	)
})

app.post("/admin/addstudent", function (req, res) {
	var student = new Student()
	student.username = req.body.enrollmentno;
	student.name = req.body.name;
	student.department = req.body.department;
	student.email = req.body.email;
	student.contact = req.body.contactno;
	student.password = req.body.password;
	Student.findOne({ username: req.body.enrollmentno }, function (err, existingUser) {
		if (existingUser) {
			console.log(req.body.enrollno + "already exists")

			return res.redirect("/admin")
		}
		else {

			student.save(function (err, user, next) {
				console.log(req.user._id + "user")
				res.redirect("/admin")
			})
		}
	})
})

app.get("/admin", isLoggedIn, isAdmin, function (req, res) {
	Admin.findById(req.user._id, function (err, User) {
		res.render("final/Admin/index", { User: User });
	})
})
app.get("/admin/addstudent", isLoggedIn, isAdmin, function (req, res) {
	Admin.findById(req.user._id, function (err, User) {
		res.render("final/Admin/addstu", { User: User });
	})
})
app.get("/admin/addfaculty", isLoggedIn, isAdmin, function (req, res) {
	Admin.findById(req.user._id, function (err, User) {
		res.render("final/Admin/addfac", { User: User });
	})
})
app.get("/student", isLoggedIn, function (req, res) {
	Student.findById(req.user._id, function (err, User) {
		res.render("final/Student/index", { User: User });
	})
})

app.get("/faculty", isLoggedIn, isFaculty, function (req, res) {
	Faculty.findById(req.user._id, function (err, User) {
		res.render("Faculty", { User: User });
	})
})

app.get("/main", isLoggedIn, function (req, res) {
	var x = req.user.types;
	res.redirect("/" + x);
})

app.post("/login", function (req, res) {
	res.redirect("/login")
})

app.get("/logout", function (req, res) {
	req.logout()
	res.redirect("/main")
})

app.get("/forgot", function (req, res) {
	res.render("forgotpassword", { user: req.user })
})

app.post('/forgot', function (req, res, next) {
	random = Math.floor((Math.random() * 100000000000) + 54);
	host = req.get('host');
	link = "http://" + req.get('host') + "/reset/" + random;
	Student.findOne({ email: req.body.email }, function (err, user) {
		if (!user) {
			//req.flash('error', 'No account with that email address exists.');
			Faculty.findOne({ email: req.body.email }, function (err, users) {
				if (!users) {
					//req.flash('error', 'No account with that email address exists.');
					return res.redirect('/forgot');
				}
				console.log("Faculty entry found")
				users.resetPasswordToken = random;
				//user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
				users.save();
				mailOptions = {
					to: req.body.email,
					subject: "Reset Password Link",
					html: "Hello,<br> Please Click on the link to reset your password.<br><a href=" + link + ">Click here to reset your password</a>"
				}
				console.log(mailOptions);
				smtpTransport.sendMail(mailOptions, function (error, response) {
					if (error) {
						console.log(error);
						res.end("error");
					}
					else {
						console.log("Message sent: " + response.message);
						res.end("sent Verify it to see profile");
					}
				})
			})
		} else {
			console.log("Student entry found")
			user.resetPasswordToken = random;
			//user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
			user.save();
			mailOptions = {
				to: req.body.email,
				subject: "Reset Password Link",
				html: "Hello,<br> Please Click on the link to reset your password.<br><a href=" + link + ">Click here to reset your password</a>"
			}
			console.log(mailOptions);
			smtpTransport.sendMail(mailOptions, function (error, response) {
				if (error) {
					console.log(error);
					res.end("error");
				} else {
					console.log("Message sent: " + response.message);
					res.end("sent Verify it to see profile");
					a = 1;
				}
			})
		}
	})
})

app.get('/reset/:token', function (req, res) {
	Student.findOne({ resetPasswordToken: req.params.token }, function (err, user) {
		if (!user) {
			// req.flash('error', 'Password reset token is invalid or has expired.');
			Faculty.findOne({ resetPasswordToken: req.params.token }, function (err, users) {
				if (!users) {
					// req.flash('error', 'Password reset token is invalid or has expired.');
					return res.redirect('/forgot');
				}
				console.log("Faculty entry found")
				res.render('reset', {
					user: req.user
				});
				//return res.redirect('/forgot');
			})
		}
		else {
			res.render('reset', {
				user: req.user
			});
		}
	});
});

app.post('/reset/:token', function (req, res) {
	Student.findOne({ resetPasswordToken: req.params.token }, function (err, user) {
		if (!user) {
			// req.flash('error', 'Password reset token is invalid or has expired.');
			Faculty.findOne({ resetPasswordToken: req.params.token }, function (err, users) {
				if (!users) {
					// req.flash('error', 'Password reset token is invalid or has expired.');
					return res.redirect('/forgot');
				} console.log("Faculty entry found")
				users.password = req.body.password;
				users.resetPasswordToken = undefined;
				users.save();
				console.log("Password updated")
				return res.redirect("/login")
			});
		}
		else {
			console.log(user)
			console.log("Student entry found")
			user.password = req.body.password;
			user.resetPasswordToken = undefined;
			user.save();
			console.log("Password updated")
			res.redirect("/login")
		}
	});
});

app.get("/leave", isLoggedIn, function (req, res) {
	Student.findById(req.user._id, function (err, User) {
		res.render("final/Student/leave", { User: User });
	})
})

app.get("/leave/:file", function (req, res) {
	var filePath = "/leave/" + req.params.file + ".pdf";

	fs.readFile(__dirname + filePath, function (err, data) {
		res.contentType("application/pdf");
		res.send(data);
	})
})

app.post(
	"/file_upload",
	upload.single("file" /* name attribute of <file> element in your form */),
	(req, res) => {
		const tempPath = req.file.path;
		const targetPath = path.join(__dirname, "./leave/" + req.user.username + ".pdf");

		if (path.extname(req.file.originalname).toLowerCase() === ".pdf") {
			fs.rename(tempPath, targetPath, err => {
				if (err) console.log(err);

				var enrollmentno = req.body.Enrollment;
				var name = req.body.name;
				var subject = req.body.subject;
				var from = req.body.from;
				console.log("from" + from);
				var to = req.body.to;
				console.log("to" + to);
				var newleave = { EnrollmentNo: enrollmentno, Name: name, Subject: subject, From: from, To: to, Document: req.file.originalname }
				Faculty.findOne({ subject: subject }, function (err, User) {
					if (err) throw err;
					Leave.create(newleave, function (err, leave) {
						if (err) throw err;
						console.log(leave + "leave")
						console.log(User + "user")
						User.leave.push(leave);
						User.save();
						res.redirect("/main");
					})

				})
			});
		} else {
			fs.unlink(tempPath, err => {
				if (err) return handleError(err, res);
				res
					.status(403)
					.contentType("text/plain")
					.end("Only .pdf files are allowed!");
			});
		}
	}
);
// app.get('/chart', function (req, res, err) {
// 	Attendance.findOne({ EnrollmentNo: req.user.username }).then((data) => {
// 		// console.log(JSON.stringify(data));
// 		var json = {}
// 		var labels = []
// 		var counts = []
// 		data.subjectList.map((subject) => {
// 			json[subject] = 0;
// 			labels.push(subject)
// 			data.attendance.map((element) => {
// 				if (element.subjectname == subject) {
// 					json[subject] += 1;
// 				}
// 			});
// 			timetable.findOne({ SubjectName: subject })
// 				.then((timetable) => {
// 					counts.push((json[subject] /
// 						timetable.count) * 100);
// 				});
// 		});
// 		console.log(json);
// 		console.log(labels);
// 		console.log(counts);
// 		res.render('data-chart', { labels, counts });
// 	}, (err) => {
// 		console.log('Something wen wrong while fetching user data', err);
// 		console.log('render ok');
// 	});
// });

// app.get('/chart', async function (req, res, err) {
// 	Attendance.findOne({ EnrollmentNo: req.user.username }).then(async (data) => {
// 		// console.log(JSON.stringify(data));
// 		var json = {}
// 		var labels = []
// 		var counts = []
// 		await Promise.all(data.subjectList.map(async (subject) => {
// 			json[subject] = 0;
// 			labels.push(subject)
// 			data.attendance.map((element) => {
// 				if (element.subjectname == subject) {
// 					json[subject] += 1;
// 				}
// 			});
// 			let object = await timetable.findOne({ SubjectName: subject });
// 			await counts.push((json[subject] / object.count) * 100);
// 		})).then(() =>
// 			res.render('data-chart', { labels, counts })
// 		);
// 	}, (err) => {
// 		console.log('Something wen wrong while fetching user data', err);
// 		console.log('render ok');
// 	});
// });

app.get('/chart', async (req, res, err) => {
	Attendance.findOne({ EnrollmentNo: req.user.username }).then(async (data) => {
		// console.log(JSON.stringify(data));
		var json = {}
		var labels = []
		var counts = []
		for (const subject of data.subjectList) {
			json[subject] = 0;
			labels.push(subject);
			data.attendance.map((element) => {
				if (element.subjectname == subject) {
					json[subject] += 1;
				}
			});
			let object = await timetable.findOne({ SubjectName: subject });
			await counts.push((json[subject] / object.count) * 100);
		}
		res.render('data-chart', { labels, counts })
	}, (err) => {
		console.log('Something wen wrong while fetching user data', err);
		console.log('render ok');
	});
});


app.post('/upload', function (req, res) {
	console.log("uploaded data");
	var json = req.body.data;
	// console.log(json[0].Name+"srupid ")
	var dateobj = new Date("2019");
	var b = dateobj.toString();
	var char = b.split(' ');
	var day = char[0];
	var time = char[4];
	var timeind = time.split(":");
	var hh = timeind[0];
	var mm = timeind[1];
	var ss = timeind[2];
	console.log(mm + "mmfirst");
	if (mm % 2 != 0) {
		mm = mm - 1;
		if (mm < 10) {
			mm = "0" + mm;
		}
	}
	console.log(mm + "mm");
	var final = day + " " + hh + ":" + mm;
	final = "Mon 10:24"
	console.log(final + "final");
	timetable.findOneAndUpdate({ Date: final }, { $inc: { count: 1 } }, function (err, timetable) {
		if (timetable) {
			timetable.count
			console.log("Schedule:" + timetable.Date)
			console.log("SubjectName:" + timetable.SubjectName)
			var date = new Date();
			var status = "P";
			for (i = 0; i < json.length; i++) {
				Attendance.findOne({ EnrollmentNo: json[i].Enrollment }, function (err, user) {
					if (err) throw err;
					newdate = { subjectname: timetable.SubjectName, date: date, status: status }
					user.attendance.push(newdate);
					user.save();
					console.log(user.EnrollmentNo + "is Present")
				})
			}
		}
	})
	res.status(200).send("success")
})

let columns = [
	'EnrollmentNo', "2019-02-21", "2019-02-22"
]
app.post("/exporttocsv", function (req, res) {
	let data = [];
	json = { ...columns };

	var i = 1;
	var count = 0;
	var subjectname = req.body.subjectname;
	function makeTable() {
		let enroll = [];
		var start = columns[i] + "T00:00:00.000Z"
		var end = "2019-02-22" + "T18:00:00.000Z"
		console.log(start);
		console.log(start);
		Attendance.find({
			attendance: {
				$elemMatch: {
					subjectname: subjectname, date:
						{ $gte: new Date(start).toISOString(), $lt: new Date(end).toISOString() }
				}
			}
		}, function (err, attenders) {
			if (err) throw err;
			console.log(attenders.length)
			for (k = 0; k < attenders.length; k++) {
				enroll.push(attenders[k].EnrollmentNo)
			}
			console.log(enroll + "enroll")
			Attendance.find({}, function (err, user) {
				if (err) throw err;
				for (j = 0; j < user.length; j++) {
					console.log(user[j] + "user")
					if (count < user.length) {
						data.push([user[j].EnrollmentNo])
						count++;
					}
					if (enroll.indexOf(user[j].EnrollmentNo) == -1) {

						data[j].push("A")
					}
					else {
						data[j].push("P")

					}
				}
				console.log(data + "data")
				//console.log(data)
				stringify(data, { header: true, columns: json }, (err, output) => {
					if (err) throw err;
					console.log(output + "out")
					fs.writeFile('' + subjectname + '.csv', output, (err) => {
						if (err) throw err;
						console.log('' + subjectname + '.csv saved.');
					});
				});

			})
		})
		i++;
		console.log(columns.length + "length")
		if (i < columns.length) {
			setTimeout(makeTable, 100);
		}
		else {
			res.download('' + subjectname + '.csv');
		}
	}
	makeTable();

})

app.get("/showAttendance", function (req, res) {

	var json = {};
	var labels = [];
	var counts = [];

	var msg = "";
	Attendance.find({}).then(async (data) => {
		for (var i = 0; i < data.length; i++) {
			for (var subject of data[i].subjectList) {
				json[subject] = 0;
				labels.push(subject);
				data[i].attendance.map((element) => {
					if (element.subjectname == subject) {
						json[subject] += 1;
					}
				});
				let object = await timetable.findOne({ SubjectName: subject });
				await counts.push((json[subject] / object.count) * 100);
			}
			msg = msg + data[i].EnrollmentNo + ",";
			for (var j = 0; j < labels.length; j++) {
				// msg=msg+"your attendance in subject "+labels[j]+" is "+counts[j]+"%"+"\n";
				msg = msg + labels[j] + "&nbsp" + counts[j] + "%&nbsp";
			}
			
			msg = msg + "</br>";

			labels = [];
			counts = [];

		}


		// console.log(JSON.stringify(data));




		// res.send(msg);
		// console.log(msg);
		res.send(msg);
	})
});
// app.get('/sendSms',function(req,res){
// 	res.render('./npta_list');
// })
app.get('/sendSms', async function (req, res) {
	var a = [];
	
	var json = {};
	var labels = [];
	var counts = [];
	var npta_list=[];
	 var x=0;
	var npta=50;

	var msg = "";
	

	Student.find({})
		.then(async (data1) => {
			for (var i = 0; i < data1.length; i++) {
				a[data1[i].username] = data1[i].contact;
				
			}
			 console.log(a);
			Attendance.find({}).then(async (data) => {
				for (var i = 0; i < data.length; i++) {
					for (var subject of data[i].subjectList) {
						json[subject] = 0;
						labels.push(subject);
						data[i].attendance.map((element) => {
							if (element.subjectname == subject) {
								json[subject] += 1;
							}
						});
						let object = await timetable.findOne({ SubjectName: subject });
						await counts.push((json[subject] / object.count) * 100);
					}
					
					msg = msg+"Your EnrollmentNo:- " + data[i].EnrollmentNo + "\n\n ";
					
					
					for (var j = 0; j < labels.length; j++) {
						if(counts[j]<50)
						{
							
							x=1;
							npta_list.push(labels[j]);
							
						}
						
						msg = msg + labels[j] + "  "+"  "+ counts[j] + "%\n ";
						
					}
					if(x==1){
						msg=msg+"\n"+"You are in NPTA list:\n\n ";
					}
					for(var z=0;z<npta_list.length;z++){
						msg=msg+npta_list[z]+"\n ";
					}
					if(x==1){
						msg=msg+"\n\n"+"Please start attending your lectures regularly.";
						
					}
					
					client.messages
						.create({
							from: 'whatsapp:+14155238886',
							body: msg,
							to: 'whatsapp:+91'+a[data[i].EnrollmentNo],

						}, (err,data) => {
							if(err) {
								 console.log("message not sent");
							}else{
								console.log("message sent");
							}
						});
						
						
					labels = [];
					counts = [];
					 x=0;
					npta_list=[];
					msg = "";
					

				}

			})


		})
	res.send(200);
})
app.get('/sendSmsParent', async function (req, res) {
	var a = [];
	var name=[];
	var json = {};
	var labels = [];
	var counts = [];
	var npta_list=[];
	 var x=0;
	var npta=50;

	var msg = "Dear parents";
	

	Student.find({})
		.then(async (data1) => {
			for (var i = 0; i < data1.length; i++) {
				a[data1[i].username] = data1[i].pcontact;
				name.push(data1[i].name);
				
				
			}
			 console.log(a);
			 console.log(name);
			Attendance.find({}).then(async (data) => {
				for (var i = 0; i < data.length; i++) {
					for (var subject of data[i].subjectList) {
						json[subject] = 0;
						labels.push(subject);
						data[i].attendance.map((element) => {
							if (element.subjectname == subject) {
								json[subject] += 1;
							}
						});
						let object = await timetable.findOne({ SubjectName: subject });
						await counts.push((json[subject] / object.count) * 100);
					}
					
					msg = msg+"Your child " + name[i] + "'s,\nAttendance report is as per below\n\n ";
					
					
					for (var j = 0; j < labels.length; j++) {
						if(counts[j]<50)
						{
							
							x=1;
							npta_list.push(labels[j]);
							
						}
						
						msg = msg + labels[j] + "  "+"  "+ counts[j] + "%\n ";
						
					}
					if(x==1){
						msg=msg+"\n"+"Your child in NPTA list:\n\n ";
					}
					for(var z=0;z<npta_list.length;z++){
						msg=msg+npta_list[z]+"\n ";
					}
					if(x==1){
						msg=msg+"\n\n"+"Please inform your child to start attending lectures regulerly.";
						
					}
					
					client.messages
						.create({
							from: 'whatsapp:+14155238886',
							body: msg,
							to: 'whatsapp:+91'+a[data[i].EnrollmentNo],

						}, (err,data) => {
							if(err) {
								 console.log("message not sent",err);
							}else{
								console.log("message sent successfully done");
							}
						});
						
						
					labels = [];
					counts = [];
					 x=0;
					npta_list=[];
					msg = "";
					

				}

			})


		})
	res.send(200);
})
// app.get('/sendReportHod',function(req,res){
// 	var msg="";
// 	Faculty.findById(req.user._id)
// 	.then((data)=>{
// 		Timetable.find({SubjectName:data.subject})
// 		.then((data1)=>{
// 			console.log(data1);
// 		})
// 		var count= Timetable.count;
// 		msg="total number of lacture in subject"+subject+"is "+count;


// 	})
// }

// )
app.get('/sendtoHOD',(req, res, next)=> {
	var html="Respected Hod Below is the attendance of each individual students in my subject\n"; 
	
	var a=[];
	Faculty.findById(req.user._id,function(err,user){
		a[req.user._id]=user.hod_no;
	timetable.findOne({SubjectName:user.subject},function(err,timetable){
	  
	   var totalsubject=timetable.count;
	   
	   Attendance.find({}).then((data)=>{
	   for(i=0;i<data.length;i++){
		   var count=0;
		for(j=0;j<data[i].attendance.length;j++){
			  if(data[i].attendance[j].subjectname==user.subject){
					count++;
					//console.log("hello adit"+html);
			  html=html+data[i].EnrollmentNo+"  "+" "+data[i].attendance[j].date+"  "+data[i].attendance[j].status+"\n";
	
		
			  }  //html=html+"<tr><td>Total attended lecture is "+count+"</td></tr>"

		  }
		  console.log("hello",html);
		  
	}
	client.messages
						.create({
							from: 'whatsapp:+14155238886',
							body: html,
							to: 'whatsapp:+919428542410',

						}, (err,data) => {
							if(err) {
								 console.log("message not sent");
							}else{
								console.log("message sent successfully done");
							}
						});

}	
	 )})
	});
	res.send("message sent successfully");
	
});



app.get("/getcsv", function (req, res) {
	Attendance.findOne({ EnrollmentNo: "160010107001" }, function (err, user) {
		console.log(user)
		res.render("getcsv", { user: user });
	})
})

function isLoggedOut(req, res, next) {
	// if user is authenticated in the session, carry on
	if (!req.user) {
		return next();
	}

	res.redirect("/main")
}


function isAdmin(req, res, next) {

	if (req.user.types === "Admin") {
		return next()
	}

	res.redirect("/main")

}

function isFaculty(req, res, next) {

	if (req.user.types === "Faculty") {
		return next()
	}

	res.redirect("/main")

}


function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()) {

		return next();

	}
	// if they aren't redirect them to the home page

	res.redirect('/login');
}



app.listen(3000, function (err) {
	if (err) {
		console.log(err);
	}
	else {
		console.log("Magic happens at http://localhost:3000");
	}
});

