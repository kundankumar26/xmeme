const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const memesRoute = require('./api/routes/memes');

mongoose.connect("mongodb+srv://kundankumar:" + 
process.env.ATLAS_MONGODB + 
"@cluster0.lyd4z.mongodb.net/memes?retryWrites=true&w=majority", 
{
    useUnifiedTopology: true,
    useNewUrlParser: true
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Library API',
      version: '1.0.0',
      title: "Swagger Memestore"
    }
  },
  apis: ['app.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);


/**
 * @swagger
 * /memes:
 *  get:
 *    description: Get all the memes
 *    responses:
 *      200:
 *        description: success
 */

/**
 * @swagger
 * /memes:
 *  post:
 *    description: Create a meme
 *    parameters:
 *      - name: name
 *        description: name of the owner
 *        in: formData
 *        required: true
 *        type: string
 *      - name: caption
 *        description: caption of meme
 *        in: formData
 *        required: true
 *        type: string
 *      - name: url
 *        description: url of meme
 *        in: formData
 *        required: true
 *        type: string
 *        format: url
 *    responses:
 *      201:
 *        description: Success
 *      400:
 *        description: Invalid input
 *      409:
 *        description: An existing item already exist
 * /memes/{memeId}:
 *  patch:
 *    description: "Update existing meme"
 *    parameters:
 *    - name: memeId
 *      in: path
 *      description: ID of the meme
 *    - name: caption
 *      descripton: caption of meme
 *      in: formData
 *      type: string
 *    - name: url
 *      description:  url of meme
 *      in: formData
 *      type: string
 *      form: url
 *    responses:
 *      400: 
 *        description: Invalid ID supplied
 *      404:
 *        description: meme not found
 *      409:
 *        description: Meme already present
 * 
 *  delete:
 *    description: "Delete existing meme"
 *    parameters:
 *    - name: memeId
 *      in: path
 *      description: ID of the meme
 *    responses:
 *      400: 
 *        description: Invalid ID supplied
 *      404:
 *        description: meme not found 
 */

app.use('/memes', memesRoute);
app.use('/edit/:memeId', function(req, res){
  console.log(req.params.memeId);
  const memeId = req.params.memeId;
  res.status(200).render("edit").send(memeId);
});
app.use('/', function(req, res){
  res.render("home");
});

app.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error
        }
    })
});

module.exports = app;