const express = require('express')
const request = require('request')
const app = express()
const router = express.Router()
const port = process.env.PUBSUB_PORT || 5000

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

router.get('/launches', (req, res) => {
  const list = ['next', 'past', 'upcoming', 'latest']
  if (!req.query.launch) {
    return console.error('url not provided')
  }
  if (!list.includes(req.query.launch)) {
    res.status(200).send('Cannot get launches using flight number for now.')
    return
  }
  request.get(
    `https://api.spacexdata.com/v3/launches/${req.query.launch}`,
    (error, response, body) => {
      if (error) {
        console.error(`Request failed: ${error}`)
        res.status(500).send(error)
      }
      if (response.statusCode != 200) {
        console.error(`Error: ${response.statusCode}`, body)
        res.status(response.statusCode).send({
          statusCode: response.statusCode,
          body: body
        })
      }
      console.log(`Launch {${req.query.launch}} retrived`)
      res.writeHead(200)
      res.end(body)
    }
  )
})

router.get('/roadster', (req, res) => {
  request.get(
    `https://api.spacexdata.com/v3/roadster`,
    (error, response, body) => {
      if (error) {
        console.error(`Request failed: ${error}`)
        res.statusCode(500).send(error)
      }
      if (response.statusCode != 200) {
        console.error(`Error: ${response.statusCode}`, body)
        res.statusCode(response.statusCode).send({
          statusCode: response.statusCode,
          body: body
        })
      }
      console.log(`Here are Elon's roadster info`)
      res.writeHead(200)
      res.end(body)
    }
  )
})

router.get('/health', (req, res) => {
  res.writeHead(200).end(`I'm heathy`)
})

app.use(router)

console.log(`App listening on port ${port}`)
app.listen(port)
