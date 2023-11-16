const express = require("express")
const cors = require("cors"); // Add this line
const app = express()
const port = 3000

app.use(cors());
app.use(express.json()); // Middleware for parsing the request body.

const mysql = require("mysql2")

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "express-react-project"
})

// GET method
// http://localhost:3000/driversv2
app.get('/driversv2', (req, res) => {
    // Similar to res.send(DriverList);
    connection.query("SELECT * FROM `drivers`", (error, rows, fields) => {
        res.send(rows)
    })
})

// POST method
// http://localhost:3000/addDriversv2
app.post('/addDriversv2', (req, res) => {
    connection.query("INSERT INTO `drivers` (`Name`, `Team`) VALUES (?, ?)", [req.body.Name, req.body.Team], (error, rows, fields) => {
        if (error) {
            res.status(400).send({ message: "Error: Data incomplete." });
        } else{
            res.status(200).send({ message: "Driver added successfully." });
        }
    })
})

// app.post('/addDriversv2', (req, res) => {
//     const { Name, Team } = req.body;

//     connection.query("INSERT INTO `drivers` ( `Name`, `Team`) VALUES (?, ?)", [Name, Team], (error, rows, fields) => {
//         if (error) {
//             res.status(400).send({ message: "Error: Data incomplete." });
//         } else{
//             res.status(200).send({ message: "Driver added successfully." });
//         }
//     });
// });

// DELETE method
// http://localhost:3000/deleteDriverv2/2
app.delete('/deleteDriverv2/:driverID', (req, res) => {
    connection.query("DELETE FROM `drivers` WHERE `ID` = ?", [req.params.driverID], (error, rows, fields) => {
        if (error) {
            res.status(404).send({ message: "No driver with that ID." });
        } else {
            res.status(200).send({ message: "Driver deleted successfully." });
        }
    })
})

// PUT method
// http://localhost:3000/updateDriverv2/5
app.put('/updateDriverv2/:driverID', (req, res) => {
    connection.query("UPDATE `drivers` SET `Name` = ?, `Team` = ? WHERE  `ID` = ?", [req.body.Name, req.body.Team, req.params.driverID], (error, rows, fields) => {
        if (error) {
            res.status(404).send({ message: "No driver with that ID." });
        } else{
            res.status(200).send({ message: "Driver updated successfully." });
        }
    })
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

const DriverList = [
    {id: 1,
    name: "Max Verstappen",
    team: "Red Bull"},
    {id: 2,
    name: "Fernando Alonso",
    team: "Aston Martin"},
    {id: 3,
    name: "Lando Norris",
    team: "MacLaren"}
]

// GET method
// http://localhost:3000/
app.get('/', (req, res) => {
    res.send('Express.js')
})

// http://localhost:3000/drivers
app.get('/drivers', (req, res) => {
    // res.send(DriverList);
    res.json(DriverList);
})

// http://localhost:3000/drivers/1
app.get('/drivers/:driverID', (req, res) => {
    const foundDriver = DriverList.find((driver) => driver.id == req.params.driverID) 
    //`id` property in `DriverList` objects is of int
    // `req.params.driverID` is string
    // use `==` for loose equality
    
    console.log(foundDriver);
    
    if (foundDriver != undefined) {
        res.send(foundDriver);
    }else{
        res.send("No driver with that ID.");
    }
})

// POST method
// http://localhost:3000/addDrivers
app.post('/addDrivers', (req, res) => {
    if (req.body.name !== undefined && req.body.team !== undefined) {
        DriverList.push(req.body);
        res.status(200).send({ message: "Driver added successfully." });
    } else {
        res.status(400).send({ message: "Error: Data incomplete." });
    }
});

// DELETE method
// http://localhost:3000/deleteDriver/2
app.delete('/deleteDriver/:driverID', (req, res) => {
    const driverID = parseInt(req.params.driverID);
    const driverIndex = DriverList.findIndex((driver) => driver.id === driverID);
    if (driverIndex !== -1) {
        // Remove the driver from the array
        DriverList.splice(driverIndex, 1);
        
        res.status(200).send({ message: "Driver deleted successfully." });
    } else {
        res.status(404).send({ message: "No driver with that ID." });
    }
});

// PUT method
app.put('/updateDriver/:driverID', (req, res) => {
    const driverID = parseInt(req.params.driverID);
    const driverIndex = DriverList.findIndex((driver) => driver.id === driverID);
    if (driverIndex !== -1) {
        DriverList[driverIndex] = {
            id: driverID,
            name: req.body.name || DriverList[driverIndex].name, 
            team: req.body.team || DriverList[driverIndex].team, 
        };

        res.status(200).send({ message: "Driver updated successfully." });
    } else {
        res.status(404).send({ message: "No driver with that ID." });
    }
});