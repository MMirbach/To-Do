const express = require("express");
const app = express();
const { Pool } = require("pg");
const cors = require("cors");
const coder = require("../frontend/src/coder.jsx");

const db = new Pool({
    user: "MJ",
    host: "localhost",
    database: "to_do",
    password: "Pogo97531",
    port: 5432,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3001, () => {});

app.get("/api/get", (req, res) => {
    const decoded = coder.decode(req.query);

    const sqlSelect = "select * from tasks where username = $1 order by id;";
    values = [decoded.username];

    db.query(sqlSelect, values, (err, result) => {
        if (!err) res.send(coder.encode(result.rows));
        else {
            console.log(err.message + " error code: " + err.code);
            res.send([]);
        }
    });
});

app.post("/api/add", (req, res) => {
    const decoded = coder.decode(req.body);

    const sqlInsert = "insert into tasks values ($1,$2,$3,$4);";
    const values = [
        decoded.username,
        decoded.task.id,
        decoded.task.description,
        decoded.task.checked,
    ];

    db.query(sqlInsert, values, (err, result) => {
        if (err) console.log(err.message + " error code: " + err.code);
    });

    res.send();
});

app.put("/api/reset", (req, res) => {
    const decoded = coder.decode(req.body);

    const sqlReset = "update tasks set checked = false where username = $1;";
    values = [decoded.username];

    db.query(sqlReset, values, (err, result) => {
        if (err) console.log(err.message + " error code: " + err.code);
    });

    res.send();
});

app.delete("/api/deleteDone", (req, res) => {
    const decoded = coder.decode(req.body);

    const sqlDeleteDone =
        "delete from tasks where username = $1 and checked = true;";
    values = [decoded.username];

    db.query(sqlDeleteDone, values, (err, result) => {
        if (err) console.log(err.message + " error code: " + err.code);
    });

    res.send();
});

app.delete("/api/clear", (req, res) => {
    const decoded = coder.decode(req.body);

    const sqlClear = "delete from tasks where username = $1;";
    values = [decoded.username];

    db.query(sqlClear, values, (err, result) => {
        if (err) console.log(err.message + " error code: " + err.code);
    });

    res.send();
});

app.delete("/api/delete", (req, res) => {
    const decoded = coder.decode(req.body);

    const sqlDelete = "delete from tasks where id = $1;";
    const values = [decoded.id];

    db.query(sqlDelete, values, (err, result) => {
        if (err) console.log(err.message + " error code: " + err.code);
    });

    res.send();
});

app.put("/api/toggle", (req, res) => {
    const decoded = coder.decode(req.body);

    const sqlToggle = "update tasks set checked = not checked where id = $1;";
    const values = [decoded.id];

    db.query(sqlToggle, values, (err, result) => {
        if (err) console.log(err.message + " error code: " + err.code);
    });

    res.send();
});

app.get("/api/checkUsername", (req, res) => {
    const decoded = coder.decode(req.query);

    console.log(req.query);
    console.log(decoded);
    res.send(1 > 0);

    // const sqlSelect = "select * from users where username = $1;";
    // const values = [decoded.username];

    // db.query(sqlSelect, values, (err, result) => {
    //     if (!err) res.send(result.rowCount > 0);
    //     else {
    //         console.log(err.message + " error code: " + err.code);
    //         res.send();
    //     }
    // });
});

app.get("/api/login", (req, res) => {
    const decoded = coder.decode(req.query);

    const sqlSelect =
        "select * from users where username = $1 and password = $2;";
    const values = [decoded.username, decoded.password];

    db.query(sqlSelect, values, (err, result) => {
        if (!err) res.send(result.rowCount > 0);
        else {
            console.log(err.message + " error code: " + err.code);
            res.send();
        }
    });
});

app.post("/api/signup", (req, res) => {
    const decoded = coder.decode(req.body);

    const sqlInsert = "insert into users values ($1,$2);";
    const values = [decoded.username, decoded.password];

    db.query(sqlInsert, values, (err, result) => {
        if (err) {
            console.log(err.message + " error code: " + err.code);
            if (err.code === "23505") res.send(false);
            else res.send();
        } else res.send(true);
    });
});
