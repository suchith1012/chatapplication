import moment from "moment";

import dbQuery from "../db/dev/dbQuery";

import {
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  generateUserToken,
} from "../helpers/validations";

import { errorMessage, successMessage, status } from "../helpers/status";

/**
 * Create A User
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const createUser = async (req, res) => {
  const { email, first_name, nick_name, password } = req.body;

  const created_on = moment(new Date());
  const uniqueid = nick_name + Math.floor(Math.random() * 10000);
  if (
    isEmpty(email) ||
    isEmpty(first_name) ||
    isEmpty(nick_name) ||
    isEmpty(password)
  ) {
    errorMessage.error =
      "Email, password, first name and last name field cannot be empty";
    return res.status(status.bad).send(errorMessage);
  }
  if (!isValidEmail(email)) {
    errorMessage.error = "Please enter a valid Email";
    return res.status(status.bad).send(errorMessage);
  }
  if (!validatePassword(password)) {
    errorMessage.error = "Password must be more than five(8) characters";
    return res.status(status.bad).send(errorMessage);
  }
  const hashedPassword = hashPassword(password);
  console.log("hashpassword", hashedPassword);
  const createUserQuery = `INSERT INTO
      users(email, first_name, nick_name, password, unique_id,created_on)
      VALUES($1, $2, $3, $4, $5,$6)
      returning *`;
  const values = [
    email,
    first_name,
    nick_name,
    hashedPassword,
    uniqueid,
    created_on,
  ];

  try {
    const { rows } = await dbQuery.query(createUserQuery, values);
    const dbResponse = rows[0];
    delete dbResponse.password;
    const token = generateUserToken(
      dbResponse.email,
      dbResponse.id,
      dbResponse.unique_id,
      dbResponse.first_name,
      dbResponse.nick_name
    );
    console.log("tokennn", token);
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log("error");
    if (error.routine === "_bt_check_unique") {
      errorMessage.error = "User with that EMAIL already exist";
      return res.status(status.conflict).send(errorMessage);
    }
    errorMessage.error = "Operation was not successful";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Signin
 * @param {object} req
 * @param {object} res
 * @returns {object} user object
 */
const siginUser = async (req, res) => {
  const { email, password } = req.body;
  if (isEmpty(email) || isEmpty(password)) {
    errorMessage.error = "Email or Password detail is missing";
    return res.status(status.bad).send(errorMessage);
  }
  if (!isValidEmail(email) || !validatePassword(password)) {
    errorMessage.error = "Please enter a valid Email or Password";
    return res.status(status.bad).send(errorMessage);
  }
  const signinUserQuery = "SELECT * FROM users WHERE email = $1";
  try {
    const { rows } = await dbQuery.query(signinUserQuery, [email]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      errorMessage.error = "User with this email does not exist";
      return res.status(status.notfound).send(errorMessage);
    }
    if (!comparePassword(dbResponse.password, password)) {
      errorMessage.error = "The password you provided is incorrect";
      return res.status(status.bad).send(errorMessage);
    }
    const token = generateUserToken(
      dbResponse.email,
      dbResponse.id,
      dbResponse.unique_id,
      dbResponse.first_name,
      dbResponse.nick_name
    );
    delete dbResponse.password;
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = "Operation was not successful";
    return res.status(status.error).send(errorMessage);
  }
};

export { createUser, siginUser };
