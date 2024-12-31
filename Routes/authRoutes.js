//import
const express = require('express');
const testroute = express.Router();
const authroute = express.Router();
//Import controller functions
const { posttest, userRegister, userLogin } = require('../Controllers/authController');
const { userauth } = require('../Middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');

//ip limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})
/**
 * @swagger
 * components:
 *   schemas:
 *     user:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: id is auto-generated
 *           example: 674d63bfdb893a0a6c1862de
 *         name:
 *           type: string
 *           description: Full name or First name required
 *           example: John or John Doe
 *         lastname:
 *           type: string
 *           description: Last name
 *           example: Doe
 *         email:
 *           type: string
 *           description: Email is required
 *           example: johndoe@gmail.com
 *         password:
 *           type: string
 *           description: User password should be at least 6 characters long
 *           example: test@123
 *         location:
 *           type: string
 *           description: Location of a user can be a country or city
 *           example: Pakistan or Sargodha
 *
 * tags:
 *   - name: Auth
 *     description: Authentication APIs
 *
 * /api/v1/auth/userregister/:
 *   post:
 *     summary: Register new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/user"
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/user"
 *       500:
 *         description: Internal server error
 */

//test route
testroute.post('/post-test', userauth, posttest);

//register user
authroute.post('/userregister', userRegister);

//login user
authroute.post('/userlogin', limiter, userLogin);


module.exports = {
    testroute,
    authroute
}
