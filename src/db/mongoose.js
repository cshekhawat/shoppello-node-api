const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", error => console.log("ERROR ---- Mongoose connection error!"));
db.on("open", error =>
  console.log("CONNECTED ---- Mongoose connection succesful!")
);
