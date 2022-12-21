const req = require("supertest");
const app = require("../src/server/app");

//source: https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

describe("Test the root path", () => {
  test("It should response the GET method", (done) => {
    req(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
