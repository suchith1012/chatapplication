import moment from "moment";

import dbQuery from "../db/dev/dbQuery";

import {
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  empty,
  generateUserToken,
} from "../helpers/validations";

import { errorMessage, successMessage, status } from "../helpers/status";
import {addinglist} from "../helpers/global"
/**
 * friend request
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */

const addfriend = async (req, res) => {
  const { friendname, userid, friendid } = req.body;
  const requeststatus = 0;
  const created_on = moment(new Date());

  if (empty(friendname) || empty(userid) || empty(friendid)) {
    errorMessage.error = "All fields are required";
    return res.status(status.bad).send(errorMessage);
  }

  const createBusQuery = `INSERT INTO
          friendlist(friendname, requeststatus, userid, friendid, created_date)
          VALUES($1, $2, $3, $4, $5)
          returning *`;
  const values = [friendname, requeststatus, userid, friendid, created_on];

  try {
    const { rows } = await dbQuery.query(createBusQuery, values);
    const dbResponse = rows[0];

    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    // console.log(error);
    errorMessage.error = "Unable to add firend";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * accept friend request
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const requestfriend = async (req, res) => {
  const {
      friendname,
    requestid,
    requeststatus,
    userid,
    useruniqueid,
    frienduniqueid,

  } = req.body;
  const accepted_date = moment(new Date());
 

  if (empty(requestid) || empty(requeststatus) || empty(userid)||empty(friendname)||empty(useruniqueid)||empty(frienduniqueid)) {
    errorMessage.error = "All fields are required";
    return res.status(status.bad).send(errorMessage);
  }
  let socket_name = "";
  if (requeststatus == 1) {
    socket_name =
      useruniqueid + frienduniqueid + Math.floor(Math.random() * 10);
  } else {
    socket_name = null;
  }

  const updatefriend =
    "UPDATE friendlist SET requeststatus=($1) ,accepted_date=($2),socket_name=($3) WHERE (userid=($4) AND friendid=($5)) RETURNING *";
  const value = [requeststatus, accepted_date, socket_name, requestid, userid];
  try {
    const { rows } = await dbQuery.query(updatefriend, value);
    const dbResponse = rows[0];
    const insertfriend =`INSERT INTO
    friendlist(friendname, requeststatus, userid, friendid, created_date,accepted_date,socket_name)
    VALUES($1, $2, $3, $4, $5,$6,$7)
    returning *`;
    const values = [friendname, requeststatus,userid,requestid, dbResponse.created_date,dbResponse.accepted_date,dbResponse.socket_name];
    console.log(values) 
    try{
        const { insertrows } = await dbQuery.query(insertfriend, values);
        successMessage.data = dbResponse;
        return res.status(status.created).send(successMessage);
     }catch(error){

     }
   
  } catch (error) {
    console.log(error);
    errorMessage.error = "Unable to add add firend";
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * get friend list
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const friendlist = async (req, res) => {
  const userid = req.params.id;
  console.log(userid);
  if (empty(userid)) {
    errorMessage.error = "id is not defined ";
    return res.status(status.bad).send(errorMessage);
  }
  const friendlistquery =
    "SELECT * FROM friendlist WHERE userid = $1";
  try {
    const { rows } = await dbQuery.query(friendlistquery, [userid]);
    const dbResponse = rows[0];
    const dbresp = rows;
    if (!dbResponse) {
      errorMessage.error = "User with this id  does not exist";
      return res.status(status.notfound).send(errorMessage);
    }
    const sss = addinglist(rows)

    successMessage.data = dbresp;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    console.log(error);
    errorMessage.error = "Unable to add add firend";
    return res.status(status.error).send(errorMessage);
  }
};

export { addfriend, requestfriend, friendlist };
