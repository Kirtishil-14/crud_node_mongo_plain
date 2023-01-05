const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "test";
const collectionName = "testing";

//Get all data
app.get("/", (req, res) => {
  MongoClient.connect(
    connectionURL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        return console.log("Unable to connect to database!");
      }
      const db = client.db(databaseName);
      const output = db
        .collection(collectionName)
        .find()
        .toArray(function (err, results) {
          console.log(results);
          res.send(results);
        });
    }
  );
});

// Post a course
app.post("/create", (req, res) => {
  console.log(req.body.name);
  console.log(req.body.age);
  MongoClient.connect(
    connectionURL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        return console.log("Unable to connect to database!");
      }
      const db = client.db(databaseName);
      db.collection(collectionName).insertOne({
        name: req.body.name,
        age: req.body.age,
      });
    }
  );
  const created = [{ created: "Yes" }];
  res.send(created);
});

//delete
app.delete("/delete", (req, res) => {
  console.log(req.body.name);
  console.log(req.body.age);
  MongoClient.connect(
    connectionURL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        return console.log("Unable to connect to database!");
      }

      async function deletedata() {
        const db = client.db(databaseName);
        const coll = db.collection(collectionName);
        const result = await coll.findOneAndDelete({
          name: req.body.name,
          age: req.body.age,
        });
        if (result.lastErrorObject.n === 1) {
          res.send({ status: 200, count: result.lastErrorObject.n });
        } else {
          res.send({ status: 111, count: 0 });
        }
      }
      deletedata();
    }
  );


});

//update
app.post("/update", (req, res) => {
  console.log(req.body.name);
  console.log(req.body.age);
  MongoClient.connect(
    connectionURL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        return console.log("Unable to connect to database!");
      }

      async function updatedata() {
        const db = client.db(databaseName);
        const coll = db.collection(collectionName);
        const result = await coll.updateOne(
          {
            name: req.body.name,
          },
          {
            $set: {
              name: req.body.newname,
              age: req.body.age,
            },
          });
        if (result.modifiedCount > 0) {
          res.send({ status: 200, count: result });
        } else {
          res.send({ status: 111, count: 0 });
        }
      }
      updatedata();
    }
  );
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
