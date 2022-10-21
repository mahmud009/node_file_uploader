const express = require("express");
const router = express.Router();
const multer = require("multer");
const mkdir = require("mkdirp");
const { nanoid } = require("nanoid");
const fs = require("fs");
const csv = require("csv");

router.post("/upload", function (req, res, next) {
  try {
    let dest = "uploads";
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        mkdir.sync(dest);
        cb(null, dest);
      },
      filename: function (req, file, cb) {
        console.log(file);
        return cb(null, `${nanoid()}_${file.originalname}`);
      },
    });

    let upload = multer({ storage }).single("file");

    upload(req, res, async function (err) {
      if (err) {
        res.status(400).send({ errorMessage: "Something went wrong with the file." });
      }

      fs.createReadStream(req.file.path)
        .pipe(csv.parse({ delimiter: ",", from_line: 1 }))
        .on("data", (row) => {
          // =====================================
          // getting the csv row
          // =====================================
          console.log(row);
        })
        .on("end", () => {
          res.send({ message: "file uploaded successfully." });
        });
    });
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
