import chai from "chai";
import chaiHttp from "chai-http";
import axios from "axios";
import app from "../app";
import "mocha";
import { PrismaClient } from ".prisma/client";
import { Wallet } from "ethers";

chai.use(chaiHttp);

let prisma: PrismaClient;
let userId: number;

describe("Tests", function () {
  before(async () => {
    prisma = new PrismaClient();
  });

  after(async () => {
    prisma.$disconnect;
  });

  it("Should create new user with wallet", async function () {
    const res = await chai.request(app).post("/users").send({
      name: "Test",
      email: "test@example.com",
    });

    userId = Number(res.body.id);
    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.a("object");
  });

  it("Should have one user registered", async function () {
    const res = await chai.request(app).get("/users/all").send();

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.a("array");
    chai.expect(res.body.length).to.equal(1);
    chai.expect(res.body[0].id).to.equal(userId);
  });

  it("should be able to sign message", async function () {
    const res = await chai
      .request(app)
      .post(`/wallet/${userId}/sign-message`)
      .send({
        message: "Hello world",
      });

    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.be.a("object");
    chai.expect(res.body.signed).to.be.a("string");
  });
});
