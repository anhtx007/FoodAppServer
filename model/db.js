const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://anhtx:Aaaaaa1x@anhtx.rykiz.mongodb.net/FastFood")
  // .connect("mongodb://localhost:27017/FastFood")
  .then(() => {
    console.log("Kết nối thành công!");
  })
  .catch((error) => {
    console.log("Kết nối thất bại " + error);
  });
module.exports = { mongoose };
