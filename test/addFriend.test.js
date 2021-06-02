const mongoose = require("mongoose");
const friends = require("../routes/friends");
const key = require('../config/keys').mongoURI;
const axios = require('axios');

describe("Connection", () => {
  beforeAll(async () => {
    await mongoose.connect(key);
    console.log("connected to db");
  });

  test("add a new friend", async () => {
    const username = "johndoe123";
    const friendHandle = "abcd";
    const values = {username, friendHandle};

    const res = await axios.post('http://localhost:5000/api/friends/add', values); // res = {success: true, token: ..}
    console.log(res.data);
    expect(res.data.success).toBe(true);
  });

  afterAll(done => {
    mongoose.disconnect();
    done();
    });

});