var mongoose = require("mongoose");
const dtbse = process.env.DATABASE;
mongoose
  .connect(dtbse)
  .then(() => {
    console.log("connection succesful");
  })
  .catch((err) => console.log("no connection"));
