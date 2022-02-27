//--------------------imports-------------------------
const mongoose = require("mongoose");
//const sgMail = require("@sendgrid/mail");
//sgMail.setApiKey(process.env.SendGridApi_Key);

//------------------Modules--------------------------

//------------------Models------------------------------
const HttpError = require("../models/http-error");

//-----------------------HelperFunctions-----------------------

//----------------------Controllers-------------------------

const login = async (req, res, next) => {};

const addUser = async (req, res, next) => {};

exports.login = login;
exports.addUser = addUser;
