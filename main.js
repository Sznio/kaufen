const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

const PORT = 3002;

const getWrozby = () => {
      let rawString = fs.readFileSync("./wrozby.json");
      const JSONOBJ = JSON.parse(rawString);

      const wrozby = Object.keys(JSONOBJ);
      return [wrozby, JSONOBJ];
};

let [wrozby, wrozbyData] = getWrozby();

app.listen(PORT, () => {
      console.log("App listening on port " + PORT);
});

app.get("/", (req, res) => {
      res.render("index", { title: "Kaufiec", wrozby, wrozbyData });
});
app.get("/wrozba/:nazwa", (req, res) => {
      const { nazwa } = req.params;
      res.render("spin", {
            nazwa: nazwa,
            header: wrozbyData[nazwa].header || null,
            link: wrozbyData[nazwa].link,
      });
});
app.get("/odswiezwrozby", (req, res) => {
      [wrozby, wrozbyData] = getWrozby();
      return res.send(wrozby);
});
