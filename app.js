const express = require("express");
const bodyParser = require("body-parser");

require("./logic/consumer");
const routes = require("./routes");
const db = require("./models");

const app = express();

db.sequelize.sync({ force: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", routes);

app.listen(3000, () => {
  console.log("listening on port 3000!");
});
