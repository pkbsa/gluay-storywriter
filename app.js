var mysql = require("mysql");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bann-kt",
});
  
connection.connect((error) => {
    if (error) console.log(error);
    else console.log("MYSQL Connected...");
});

var app = express();

app.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
    })
  );
  

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

const publicDirectory = path.join(__dirname + "/css");
app.use(express.static(publicDirectory));

app.set("view engine", "ejs");

app.get("/", function (request, response) {
    response.render("index");
});
app.get("/questions", function (request, response) {
    response.render("qa");
});
// app.get("/results", function (request, response) {
//     connection.query("SELECT * FROM catlist", function (error, results){
//         if(error) throw error;
//         response.render("catlist", { cats: results});
//     })
// });
app.get("/submitted", function (request, response) {
    response.render("done");

});


// app.post("/addtips", function (request, response){
//     let sampleFile;
//     let uploadFile;

//     console.log(request.body)

//     if(!request.files || Object.keys(request.files).length === 0){
//         connection.query("INSERT INTO tips SET ?",
//         {
//             title : request.body.title,
//             text : request.body.text, 
//             image : null,
//         },
//         (error, rows) => {
//             response.redirect('/admin-index')
//         });
//     }else{
//         sampleFile = request.files.sampleFile;
//         uploadFile = __dirname + '/css/images/index/slide/' + sampleFile.name
//         console.log(sampleFile)

//         sampleFile.mv(uploadFile, function(error){
//             if(error) return response.status(500).send(error)

//             connection.query("INSERT INTO tips SET ?",
//             {
//                 title : request.body.title,
//                 text : request.body.text,
//                 image : sampleFile.name, 
//             },
//             (error, rows) => {
//                 response.redirect('/admin-index')
//             });
//         });
//     }
// });


app.listen(3000, function(){
    console.log("Listening at Port 3000")
  });