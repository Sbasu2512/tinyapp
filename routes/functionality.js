const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const { urlsForUser, generateRandomString, emailLooker } = require("../helper");
const bcrypt = require("bcrypt");
const saltRounds = 10;