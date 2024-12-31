const swaggerUi = require('swagger-ui-express');
const swaggerjsDoc = require('swagger-jsdoc');
//package imports
const express = require('express');
const dotenv = require('dotenv');
const { dbconn } = require('./config/dbconfig');
const cors = require('cors');
const morgan = require('morgan');
require('express-async-errors');
//security packages
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
//file imports
const { testroute, authroute } = require('./Routes/authRoutes');
const { userroute } = require('./Routes/userRoutes');
const { jobroute } = require('./Routes/jobRoutes');
const { errorMiddleware } = require('./Middlewares/errorMiddleware');

//dotenv config
dotenv.config();

//Mongo DB connection
dbconn();

//swagger api config
//swagger options
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Job Portal Application',
            description: 'Node Expressjs Job Portal Application'
        },
        servers: [{
            url: 'http://localhost:3100'
        }]
    },
    apis: ['./Routes/*.js'] //swagger will access apis from here.
}
const spec = swaggerjsDoc(options);
//rest object
const app = express();

//middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

//routes
app.use('/api/v1/test', testroute);
app.use('/api/v1/auth', authroute);
app.use('/api/v1/user', userroute);
app.use('/api/v1/job', jobroute);
app.get('/', (req, resp) => {
    resp.send("Welcome to the Job Portal");
})

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(spec));

//Error Middleware
app.use(errorMiddleware);
//port
PORT = 3100 || process.env.PORT

//listen
app.listen(PORT, () => {
    console.log(`server is running in ${process.env.DEV_MODE} mode on port ${PORT}`);
})