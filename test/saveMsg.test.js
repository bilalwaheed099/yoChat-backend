const mongoose = require("mongoose");
const chats = require("../routes/chats");
const key = require('../config/keys').mongoURI;
const axios = require('axios');

describe("Connection", () => {
  beforeAll(async () => {
    await mongoose.connect(key);
    console.log("connected to db");
  });

  test("save a message", async () => {
    const handle = 'johndoe123';
    const curUser = 'abcd';
    const msgIDs = ['60b682cd8b9ce6288835ce04']; // array of DBs
    const values = {handle, curUser, msgIDs};

    // some message IDs for future testing --> 60b682cb8b9ce6288835ce03, 60b682c98b9ce6288835ce01
    const res = await axios.post('http://localhost:5000/api/chats/saveMsg', values); // res = {success: true, token: ..}
    console.log(res)
    expect(res.data.success).toBe(true);
  });

  afterAll(done => {
    mongoose.disconnect();
    done();
    });

});