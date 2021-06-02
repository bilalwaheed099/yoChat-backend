const mongoose = require("mongoose");
const users = require("../routes/users");
const key = require('../config/keys').mongoURI;
const axios = require('axios');

describe("Connection", () => {
  beforeAll(async () => {
    await mongoose.connect(key);
    console.log("connected to db");
  });

  test("login the user", async () => {
    const username = "johndoe123";
    const password = "123456";
    const values = {username, password};

    const res = await axios.post('http://localhost:5000/api/users/login', values); // res = {success: true, token: ..}
    expect(res.data.success).toBe(true);
  });

  afterAll(done => {
    mongoose.disconnect();
    done();
    });

});