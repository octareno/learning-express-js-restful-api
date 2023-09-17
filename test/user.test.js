import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";
import { createTestUser, getTestUser, removeTestUser } from "./test-util";
import bcrypt from "bcrypt";
import { func } from "joi";

// Command to run all test case in this file : npx jest user.test.js
// Command to run specific test case : npx jest -t "POST /api/users"
describe("POST /api/users", function () {
  afterEach(async () => {
    await removeTestUser();
  });

  // Command to run specific test case : npx jest -t "Should can register new user"
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

  // Command to run specific test case : npx jest -t "Should reject if requestis invalid"
  it("Should reject if requestis invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  // Command to run specific test case : npx jest -t "Should reject if username already registered"
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

// Command to run specific test case : npx jest -t "POST /api/users/login"
describe("POST /api/users/login", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  // Command to run specific test case : npx jest -t "should can login"
  it("should can login", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "testpassword",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("test");
  });

  // Command to run specific test case : npx jest -t "should reject login if request is invalid"
  it("should reject login if request is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  // Command to run specific test case : npx jest -t "should reject login if password is wrong"
  it("should reject login if password is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "wrongpassword",
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  // Command to run specific test case : npx jest -t "should reject login if username is wrong"
  it("should reject login if username is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "wrongusername",
      password: "wrongpassword",
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

// Command to run specific test case : npx jest -t "GET /api/users/current"
describe("GET /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  // Command to run specific test case : npx jest -t "should can get current user"
  it("should can get current user", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
  });

  // Command to run specific test case : npx jest -t "should reject if token is invalid"
  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "wrongtoken");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

// Command to run specific test case : npx jest -t "PATCH /api/users/current"
describe("PATCH /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  // Command to run specific test case : npx jest -t "should can update user"
  it("should can update user", async () => {
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

  // Command to run specific test case : npx jest -t "should can update user name"
  it("should can update user name", async () => {
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

  // Command to run specific test case : npx jest -t "should can update user password"
  it("should can update user password", async () => {
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

  // Command to run specific test case : npx jest -t "should reject if request is not valid"
  it("should reject if request is not valid", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "wrongtoken")
      .send({});

    expect(result.status).toBe(401);
  });
});

// Command to run specific test case : npx jest -t "DELETE /api/users/logout"
describe("DELETE /api/users/logout", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  // Command to run specific test case : npx jest -t "should can logout"
  it("should can logout", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    const user = await getTestUser();
    expect(user.token).toBeNull();
  });

  // Command to run specific test case : npx jest -t "should reject logout if token is invalid"
  it("should reject logout if token is invalid", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "wrongtoken");

    expect(result.status).toBe(401);
  });
});
