//--------------------imports-------------------------
const mongoose = require("mongoose");
//const sgMail = require("@sendgrid/mail");
//sgMail.setApiKey(process.env.SendGridApi_Key);

//------------------Modules--------------------------

//------------------Models------------------------------
const HttpError = require("../models/http-error");

//-----------------------HelperFunctions-----------------------

//----------------------Controllers-------------------------

const createCount = async (req, res, next) => {};

const countNext = async (req, res, next) => {};

const editEntireCount = async (req, res, next) => {};

const deleteCount = async (req, res, next) => {};

const postponeCount = async (req, res, next) => {};

const getCount = async (req, res, next) => {};

exports.createCount = createCount;
exports.countNext = countNext;
exports.editEntireCount = editEntireCount;
exports.deleteCount = deleteCount;
exports.postponeCount = postponeCount;
exports.getCount = getCount;
