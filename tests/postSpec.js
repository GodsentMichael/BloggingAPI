const request = require("supertest");
const { connect } = require("./database");
const app = require("../index");
const moment = require("moment");
const postModel = require("../models/postModel");
const OrderModel = require("../models/orderModel");
const UserModel = require("../models/userModel");
const { post } = require("../routes/userRoute");

describe("posts Route", () => {
  let conn;
  let token;

  beforeAll(async () => {
    conn = await connect();

    await userModel.create({ username: "chinuaachebe", password: "achebe123" });

    const loginResponse = await request(app)
      .post("/login")
      .set("content-type", "application/json")
      .send({
        username: "chinuaachebe",
        password: "achebe123",
      });

    token = loginResponse.body.token;
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should return blogPosts", async () => {
    // create order in our db
    await postModel.create({
      title: "Trials of brother jero",
      tags: "prose",
      author: "Wole Soyinka",
      owner: "63426f08d1761f3a6473e537",
      description: "Brother jero passed through a lot, but at the end he came out stronger",
      body: "In a time when people never believed a man could be rich and popular yet maintain a monagamous family, Brither jero passed through a lot, but at the end he came out stronger",
      readTime,
    });

    await postModel.create({
      title: "Marriage of Anansewa",
      tags: "prose",
      author: "Wole Soyinka",
      owner: "62426f28d1761a3a6473e267",
      description: "Anansewa, had a tough life growing up as the only female in the house.",
      body: "In a time when marriages felt like justa simple rite of passage, Anansewa, had a tough life growing up as the only female in the house.",
      readTime,
    });

    const response = await request(app)
      .get("/posts")
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("blogPost");
    expect(response.body).toHaveProperty("status", true);
  });

  it("should return postss with state draft", async () => {
    // create order in our db
    await OrderModel.create({
      title: "Half a Yellow sun",
      tags: "prose",
      author: "chinua achebe",
      owner: "63622f08d1761f3a6471f534",
      description: "Life is more than what our physical eyes can see",
      body: "Nigeria should stop ostracizing men and as well stop ",
      readTime,
    });

    await postModel.create({
      title: "Getting Justice",
      tags: "satire",
      author: "Victor Olaitan",
      owner: "63622f08d1761f3a6471f534",
      description:"when it comes to dealing with societal constructs, without spaeaking up",
      body: "Life has made us understand that, when it comes to dealing with societal constructs, without spaeaking up",
      readTime,
    });

    const response = await request(app)
      .get("/posts?state=published")
      .set("content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("blogPost");
    expect(response.body).toHaveProperty("status", true);
    expect(response.body.orders.every((blogPost) => blogPost.state === 2)).toBe(true);
  });
});
