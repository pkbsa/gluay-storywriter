var mysql = require("mysql");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const FormData = require("form-data");
const fetch = require("node-fetch");

var connection = mysql.createConnection({
  host: "23.106.53.137",
  user: "gluaywwm_siranuta13",
  password: "siranuta13",
  database: "gluaywwm_gluaydatabase3",
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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // Replace 'ejs' with your chosen rendering engine


app.get("/storygluay", function (request, response) {
  response.render("story-start");
});
app.get("/storygluay-form", function (request, response) {
  response.render("story-form");
});
app.get("/storygluay-questions", function (request, response) {
  response.render("story-questions");
});

app.get("/storygluay-submitted", function (request, response) {
  response.render("story-submitted");
});


app.get("/storygluay-diary", function (request, response) {
  connection.query("SELECT * FROM gluay_story", function (error, results) {
    if (error) throw error;
    console.log(results)
    response.render("story-diary", { drawing: results });
  });
});

app.post("/storygluay-submitstory", function (request, response) {
  const currentDate = new Date();

  const options = {
    timeZone: "Asia/Bangkok", // Set the time zone to Thailand
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  const thaiDateTime = currentDate.toLocaleString("th-TH", options);

  console.log(thaiDateTime);

  console.log(request.body);

  connection.query(
    "INSERT INTO gluay_story SET ?",
    {
      title: request.body.title,
      story: request.body.story,
      author: request.body.author,
      instagram: request.body.instagram,
      uploaded_at: thaiDateTime,
    },
    (error, rows) => {
      console.log(error);
      const line_api = "lcbnB8JtsygvD2kimlqvjiGAJDSne6yiLcpiObt80gU";
      setTimeout(function () {
        var payload = `\n\ntitle : ${request.body.title}\nเรื่องราว : ${request.body.story}\nนามปากกา : ${request.body.author}\ninstagram : ${request.body.instagram}\n\nวันที่ : ${thaiDateTime}`;

        const formData = new FormData();
        formData.append("message", `${payload}`);
        formData.append("access_token", line_api);
        fetch("https://notify-api.line.me/api/notify", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${line_api}`,
            ...formData.getHeaders(),
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, 8000);
      response.redirect("/storygluay-submitted");
    }
  );
});

app.get("*", function (request, response) {
  response.redirect("/storygluay");
});

app.listen(3000, function () {
  console.log("Listening at Port 3000");
});
