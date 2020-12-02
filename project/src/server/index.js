require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')
const reload = require('reload')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls
app.get('/:name', async (req, res) => {
    const name = req.params.name.toLowerCase()
    let url;
    if (name === 'apod') {
        url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    } else {
        url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/latest_photos?api_key=${process.env.API_KEY}`
    }
    try {
        let data = await fetch(url)
            .then(res => res.json())
        res.send({ data })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
reload(app);