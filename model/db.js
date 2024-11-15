const mongoose = require("mongoose");
//mongodb+srv://k3a4tuananhh:tuananh123@cluster0.j388l73.mongodb.net/
// "mongodb://localhost:27017/ASM_ANDROID"
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
