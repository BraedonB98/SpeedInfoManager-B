//------------------Auth--------------------------
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//------------------Models------------------------------
const HttpError = require("../models/http-error");
const User = require("../models/user-model");
//-----------------------HelperFunctions-----------------------
getUserByEID = async (eid) => {
  let user;
  if (eid === null) {
    return {
      error: error,
      errorMessage: "no eid provided",
      errorCode: 400,
    };
  }
  try {
    user = await User.findOne({ employeeId: eid });
  } catch (error) {
    return {
      error: error,
      errorMessage: "Could not access database",
      errorCode: 500,
    };
  }
  if (!user) {
    return {
      error: true,
      errorMessage: "User not in database",
      errorCode: 404,
    };
  }
  return user;
};

const getUserById = async (uid) => {
  let user;
  if (uid === null) {
    return {
      error: error,
      errorMessage: "no uid provided",
      errorCode: 400,
    };
  }
  if (typeof uid === "string") {
    var ObjectID = require("mongodb").ObjectID;
    uid = new ObjectID(uid);
  }
  try {
    user = await User.findById(uid);
  } catch (error) {
    return {
      error: error,
      errorMessage: "Could not access user in database",
      errorCode: 500,
    };
  }
  if (!user) {
    return {
      error: true,
      errorMessage: "User not in database",
      errorCode: 404,
    };
  }
  return user;
};

//----------------------Controllers-------------------------

const login = async (req, res, next) => {
  //check first login if true then change password
  const { employeeId, password } = req.body;
  console.log(employeeId);
  //Locating User
  let existingUser;
  existingUser = await getUserByEID(employeeId);
  if (existingUser.error) {
    return next(
      new HttpError(existingUser.errorMessage, existingUser.errorCode)
    );
  }
  //Checking Passwords
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(new HttpError("Not able to check credentials", 500));
  }
  if (!isValidPassword) {
    return next(new HttpError("Login Failed,invalid credentials", 401));
  }
  //JWT Token
  let token;
  try {
    token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
      },
      process.env.JWT_Key,
      { expiresIn: "2h" }
    );
  } catch (error) {
    console.log(error);
    return next(new HttpError("Logging in user failed", 500));
  }
  const userRestricted = {
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    preferredName: existingUser.lastName,
    employeeId: existingUser.employeeId,
    email: existingUser.email,
    phoneNumber: existingUser.phoneNumber,
    jobCode: existingUser.jobCode,
    permissions: existingUser.permissions,
    id: existingUser._id,
    token: token,
    imageUrl: existingUser.imageUrl,
  };
  res.json(userRestricted);
};

const addUser = async (req, res, next) => {
  const uid = req.userData.id;
  let user = await getUserById(uid);
  console.log(user);
  if (!!user.error) {
    return next(new HttpError(user.errorMessage, user.errorCode));
  }
  let accessLevel = false;
  //checking if user has permission to create store
  user.permissions.map((permission) => {
    if (permission.storeId === "0" && permission.accessLevel === "admin") {
      accessLevel = true;
    }
  });
  if (!accessLevel) {
    return next(
      new HttpError("You dont have permission to create a store", 401)
    );
  }

  const {
    firstName,
    lastName,
    preferredName,
    employeeId,
    email,
    phoneNumber,
    jobCode,
    permissions,
    password,
  } = req.body; //will set password automatically to employeeId

  //Checking if user already has account
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      existingUser = await User.findOne({ phoneNumber: phoneNumber });
    }
  } catch (error) {
    return next(
      new HttpError("Sign up failed, Could not access database", 500)
    );
  }

  if (existingUser) {
    return next(
      new HttpError("Could not create user, credentials already in use", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12); //12 is the number of salting rounds(how secure)
  } catch (error) {
    return next(new HttpError("Could not set password correctly", 500));
  }

  //Creating new user
  const createdUser = new User({
    firstName,
    lastName,
    preferredName,
    jobCode,
    imageUrl: "data/uploads/images/default.svg",
    email,
    phoneNumber: "+1" + phoneNumber,
    password: hashedPassword,
    employeeId,
    certifications: [],
    permissions,
  });
  //Sending new user to DB
  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Creating user failed", 500));
  }

  const userRestricted = {
    firstName: createdUser.firstName,
    lastName: createdUser.lastName,
    preferredName: createdUser.lastName,
    employeeId: createdUser.employeeId,
    email: createdUser.email,
    phoneNumber: createdUser.phoneNumber,
    jobCode: createdUser.jobCode,
    permissions: createdUser.permissions,
    id: createdUser._id,
    imageUrl: createdUser.imageUrl,
  };

  res.json(userRestricted);
};

exports.login = login;
exports.addUser = addUser;
exports.getUserById = getUserById;
exports.getUserByEID = getUserByEID;
