//--------------------imports-------------------------
const mongoose = require("mongoose");
//const sgMail = require("@sendgrid/mail");
//sgMail.setApiKey(process.env.SendGridApi_Key);

//------------------Modules--------------------------

//------------------Models------------------------------
const HttpError = require("../models/http-error");

//-----------------------HelperFunctions-----------------------

//----------------------Controllers-------------------------

const createStore = async (req, res, next) => {};

const editStore = async (req, res, next) => {};

const deleteStore = async (req, res, next) => {};

const getStore = async (req, res, next) => {};

exports.createStore = createStore;
exports.editStore = editStore;
exports.deleteStore = deleteStore;
exports.getStore = getStore;
