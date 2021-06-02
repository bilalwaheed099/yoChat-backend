const mongoose = require("mongoose");
const chats = require("../routes/chats");
const key = require('../config/keys').mongoURI;
const axios = require('axios');

describe("Connection", () => {
  beforeAll(async () => {
    await mongoose.connect(key);
    console.log("connected to db");
  });

  test("delete all unsaved messages", async () => {
    const handle = 'johndoe123';
    const curUser = 'abcd';
    const values = {handle, curUser};

    const res = await axios.post('http://localhost:5000/api/chats/deleteMsg', values); //res = {success: true}
    expect(res.data.success).toBe(true);
  });

  afterAll(done => {
    mongoose.disconnect();
    done();
    });

});