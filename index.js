const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
dotenv.config();
const UserRoute = require("./routes/UsersRoutes");
const AuthRoute = require("./routes/AuthRoutes");
const PostRoute = require("./routes/PostRoutes");

//Database connectivity
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected Please Proceed...");
  })
  .catch((err) => {
    console.log(err);
  });

///middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// routings
app.use("/api/users", UserRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/posts", PostRoute);

app.listen(PORT, () => {
  console.log("server started at port : 3000");
});
