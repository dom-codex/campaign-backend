//const http = require("http");
const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const uploader = require("./controller/upload").uploader;
const upload = multer();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const uploadImg = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      callback(null, true);
    } else {
      //callback(null, false);

      return callback(
        new Error("only png,jpg and jpeg format are allowed", false)
      );
    }
  },
}).single("img");
//const server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.get("/", (req, res, next) => {
  res.write("<h1>working</h1>");
});
app.listen(process.env.PORT || 4500, () => {
  console.log("listening");
});

app.post("/generate/flyer", uploadImg, (req, res, _) => {
  //const upload = multer({ storage: storage }).single("img");
  // upload(req, res, (e) => {
  uploader(req, res);
  // });
});
