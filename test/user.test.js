import supertest from "supertest";
import { web } from "../src/application/web";
import { prismaClient } from "../src/application/database";
import { logger } from "../src/application/logging";

// Command to run all test case in this file : npx jest -t "POST /api/users"
describe("POST /api/users", function () {
  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        username: "johndoe",
      },
    });
  });

  // Command to run specific test case : npx jest -t "Should can register new user"
  it("Should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "johndoe",
      password: "testpassword",
      name: "John Doe",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("johndoe");
    expect(result.body.data.name).toBe("John Doe");
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
      username: "johndoe",
      password: "testpassword",
      name: "John Doe",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("johndoe");
    expect(result.body.data.name).toBe("John Doe");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send({
      username: "johndoe",
      password: "testpassword",
      name: "John Doe",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
