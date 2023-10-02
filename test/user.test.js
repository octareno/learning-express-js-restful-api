import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { createTestUser, getTestUser, removeTestUser } from "./test-util.js";
import bcrypt from "bcrypt";

// Command to run all test case in this file : npx jest user.test.js
// Command to run specific test case : npx jest user.test.js -t "POST /api/users"
describe("POST /api/users", function () {
  afterEach(async () => {
    await removeTestUser();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should can register new user"
  it("Should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "testpassword",
      name: "test",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should reject register if request is invalid"
  it("Should reject register if request is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should reject if username already registered"
  it("Should reject if username already registered", async () => {
    let result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "testpassword",
      name: "test",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "testpassword",
      name: "test",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

// Command to run specific test case : npx jest user.test.js -t "POST /api/users/login"
describe("POST /api/users/login", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should can login"
  it("Should can login", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "testpassword",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("test");
  });

  // Command to run specific test case : npx jest user.test.js -t "Should reject login if request is invalid"
  it("Should reject login if request is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should reject login if password is incorrect"
  it("Should reject login if password is incorrect", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "wrongpassword",
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should reject login if username is incorrect"
  it("Should reject login if username is incorrect", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "wrongusername",
      password: "wrongpassword",
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

// Command to run specific test case : npx jest user.test.js -t "GET /api/users/current"
describe("GET /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should can get current user"
  it("Should can get current user", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
  });

  // Command to run specific test case : npx jest user.test.js -t "Should reject if token is invalid"
  it("Should reject if token is invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "wrongtoken");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

// Command to run specific test case : npx jest user.test.js -t "PATCH /api/users/current"
describe("PATCH /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should can update user"
  it("Should can update user", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        name: "John Doe",
        password: "secretpassword",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("John Doe");

    const user = await getTestUser();
    expect(await bcrypt.compare("secretpassword", user.password)).toBe(true);
  });

  // Command to run specific test case : npx jest user.test.js -t "Should can update user name"
  it("Should can update user name", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        name: "John Doe",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("John Doe");
  });

  // Command to run specific test case : npx jest user.test.js -t "Should can update user password"
  it("Should can update user password", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        password: "secretpassword",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");

    const user = await getTestUser();
    expect(await bcrypt.compare("secretpassword", user.password)).toBe(true);
  });

  // Command to run specific test case : npx jest user.test.js -t "Should reject update user if request is invalid"
  it("Should reject update user if request is invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "wrongtoken")
      .send({});

    expect(result.status).toBe(401);
  });
});

// Command to run specific test case : npx jest user.test.js -t "DELETE /api/users/logout"
describe("DELETE /api/users/logout", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should can logout"
  it("Should can logout", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    const user = await getTestUser();
    expect(user.token).toBeNull();
  });

  // Command to run specific test case : npx jest user.test.js -t "Should reject logout if token is invalid"
  it("Should reject logout if token is invalid", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "wrongtoken");

    expect(result.status).toBe(401);
  });
});
