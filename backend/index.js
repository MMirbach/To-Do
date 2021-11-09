const express = require("express");
const app = express();
const { Pool } = require("pg");
const cors = require("cors");

const db = new Pool({
    user: "MJ",
    host: "localhost",
    database: "to-do",
    password: "Pogo97531",
    port: 5432,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3001, () => {
    console.log("hi there");
});

app.get("/api/get", (req, res) => {
    const sqlSelect = "select * from tasks order by id;";

    db.query(sqlSelect, (err, result) => {
        if (!err) res.send(result.rows);
        else {
            console.log(err);
            res.send([]);
        }
    });
});

app.post("/api/add", (req, res) => {
    const sqlInsert = "insert into tasks values ($1,$2,$3);";
    const values = [req.body.id, req.body.description, req.body.checked];

    db.query(sqlInsert, values, (err, result) => {
        if (err) console.log(err);
    });

    res.send();
});

app.put("/api/reset", (req, res) => {
    const sqlReset = "update tasks set checked = false;";

    db.query(sqlReset, (err, result) => {
        if (err) console.log(err);
    });

    res.send();
});

app.delete("/api/deleteDone", (req, res) => {
    const sqlDeleteDone = "delete from tasks where checked = true;";

    db.query(sqlDeleteDone, (err, result) => {
        if (err) console.log(err);
    });

    res.send();
});

app.delete("/api/clear", (req, res) => {
    const sqlClear = "delete from tasks;";

    db.query(sqlClear, (err, result) => {
        if (err) console.log(err);
    });

    res.send();
});

app.delete("/api/delete", (req, res) => {
    const sqlDelete = "delete from tasks where id = $1;";
    const values = [req.body.id];

    db.query(sqlDelete, values, (err, result) => {
        if (err) console.log(err);
    });

    res.send();
});

app.put("/api/toggle", (req, res) => {
    const sqlToggle = "update tasks set checked = not checked where id = $1;";
    const values = [req.body.id];

    db.query(sqlToggle, values, (err, result) => {
        if (err) console.log(err);
    });

    res.send();
});
