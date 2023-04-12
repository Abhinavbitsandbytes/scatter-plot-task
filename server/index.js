const fs = require("fs");
const express = require("express");
const app = express();
const multer = require("multer");
var cors = require('cors')
app.use(cors())

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, "data.csv");
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req);
  res.send(req.file);
});

app.get("/data", (req, res) => {
  fs.readFile("./uploads/data.csv", { encoding: "utf8" }, (err, data) => {
    let arr = data
      .split("\n") // split string to lines
      .map((e) => e.trim()) // remove white spaces for each line
      .map((e) => e.split(",").map((e) => e.trim()))
      .map((e) => {
        e[0] = +e[0];
        e[1] = +e[1];
        return e;
      });
    arr.shift();
    arr.pop();
    res.send(arr);
  });
});

app.listen(4800, () => {
  console.log("server is running at port 4800");
});
