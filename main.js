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
      const wrozbyData = JSON.parse(rawString);

      const wrozby = Object.keys(wrozbyData);

      let wrozbyBezlosow = wrozby.filter((el) => !el.includes("Losuj"));
      let wrozbyBezLosowData = {};
      wrozbyBezlosow.forEach((el) => (wrozbyBezLosowData[el] = wrozbyData[el]));
      let wrozbyLosy = wrozby.filter((el) => el.includes("Losuj"));
      let wrozbyLosyData = {};
      wrozbyLosy.forEach((el) => (wrozbyLosyData[el] = wrozbyData[el]));

      return [
            wrozby,
            wrozbyData,
            wrozbyBezlosow,
            wrozbyBezLosowData,
            wrozbyLosy,
            wrozbyLosyData,
      ];
};

let [
      wrozby,
      wrozbyData,
      wrozbyBezlosow,
      wrozbyBezLosowData,
      wrozbyLosy,
      wrozbyLosyData,
] = getWrozby();

app.listen(PORT, () => {
      console.log("App listening on port " + PORT);
});

app.get("/", (req, res) => {
      res.render("index", {
            title: "Kaufiec",
            wrozby: wrozbyBezlosow,
            wrozbyData: wrozbyBezLosowData,
            wrozbyLosy,
            wrozbyLosyData,
      });
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
      [
            wrozby,
            wrozbyData,
            wrozbyBezlosow,
            wrozbyBezLosowData,
            wrozbyLosy,
            wrozbyLosyData,
      ] = getWrozby();
      return res.send(wrozby);
});
