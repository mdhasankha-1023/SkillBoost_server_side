const express = require('express')
const app = express();
const port = process.env.PORT || 5000;

// middleware
// app.use(cors())


// test server
app.get('/', (req, res) => {
    res.send('This is skillBoost server')
})

// listen server
app.listen(port, () => {
    console.log(`This server is running on port: ${port}`);
})
