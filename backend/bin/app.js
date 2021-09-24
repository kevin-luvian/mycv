const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const allowedOrigins = [
    process.env.CORS_URL,
    'https://kevinlh.herokuapp.com',
    'https://cvkevin.herokuapp.com',
    'https://mycv.atkev.site',
    'http://localhost:3000'
];

const app = express();
dotenv.config();

app.use(cors({
    origin: function (origin, callback) {
        // deny requests with no origin
        if (!origin) return callback(null, false);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 1000000,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//app.use(express.static(path.join(__dirname, "frontend/build")));
//app.get("*", (req, res) => {
//    res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
//});

/**
 * Web services api endpoint
 */
const fileRouter = require("../routes/file");
app.use(fileRouter.routeURL, fileRouter.router);
app.use('/api/user', require("../routes/user"));
app.use('/api/skill', require("../routes/skill"));
app.use('/api/resume', require("../routes/resume"));
app.use('/api/myinfo', require("../routes/myInfo"));
app.use('/api/funInfo', require("../routes/funInfo"));
app.use('/api/contact', require("../routes/contact"));
app.use('/api/directory', require("../routes/directory"));
app.use('/api/auth', require("../routes/authentication"));
app.use('/api/*', require("../routes/catchAll"));

/**
 * wrap require from root directory
 * 
 * @param {string} name path from root
 */
app.rootRequire = name => require(`${__dirname}/${name}`);

module.exports = app;
