const mongoose = require("mongoose");
const users = require("../routes/users");
const key = require('../config/keys').mongoURI;
const axios = require('axios');

describe("Connection", () => {
  beforeAll(async () => {
    await mongoose.connect(key);
    console.log("connected to db");
  });

 // for registering the user for the first time
  test("register the user first time", async () => {
    const firstName = "james";
    const lastName = "bond";
    const username = "jb9";
    const email = "jb@gmail.com";
    const password = "123456";
    const values = {firstName, lastName, username, email,  password};

    // const article =  await ArticleService.getArticlebyId(id);
    const res = await axios.post('http://localhost:5000/api/users/register', values); // res = {success: true, token: ..}
    expect(res.data.success).toBe(true);
  });

 // for registering the user for the second time
  test("try to register the user second time", async () => {
    const firstName = "james";
    const lastName = "bond";
    const username = "jb9";
    const email = "jb@gmail.com";
    const password = "123456";
    const values = {firstName, lastName, username, email,  password};

    const res = await axios.post('http://localhost:5000/api/users/register', values); // res = {success: true, token: ..}
    expect(res.data.success).toBe(false);
  });

  afterAll(done => {
    mongoose.disconnect();
    done();
    });

});