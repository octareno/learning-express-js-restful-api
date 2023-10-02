import supertest from "supertest";
import {
  createManyTestContact,
  createTestContact,
  createTestUser,
  getTestContact,
  removeAllTestContacts,
  removeTestUser,
} from "./test-util.js";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";

// Command to run all test case in this file : npx jest contact.test.js
// Command to run specific test case : npx jest contact.test.js -t "POST /api/contacts"
describe("POST /api/contacts", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  // Command to run specific test case : npx jest contact.test.js -t "Should can create new contact"
  it("Should can create new contact", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "test",
        last_name: "test",
        email: "test@gmail.com",
        phone: "555444321",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe("test");
    expect(result.body.data.last_name).toBe("test");
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.phone).toBe("555444321");
  });

  // Command to run specific test case : npx jest contact.test.js -t "Should reject create contact if request is invalid"
  it("Should reject create contact if request is invalid", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "",
        last_name: "test",
        email: "test",
        phone:
          "5554443211111111111111111111111111111111111111111111111111111111",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

// Command to run specific test case : npx jest contact.test.js -t "GET /api/contacts/:contactId"
describe("GET /api/contacts/:contactId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  // Command to run specific test case : npx jest contact.test.js -t "Should can get contact"
  it("Should can get contact", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe(testContact.first_name);
    expect(result.body.data.last_name).toBe(testContact.last_name);
    expect(result.body.data.email).toBe(testContact.email);
    expect(result.body.data.phone).toBe(testContact.phone);
  });

  // Command to run specific test case : npx jest contact.test.js -t "Should return 404 if contact id is not found"
  it("Should return 404 if contact id is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + (testContact.id + 1))
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

// Command to run specific test case : npx jest contact.test.js -t "PUT /api/contacts/:contactId"
describe("PUT /api/contacts/:contactId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  // Command to run specific test case : npx jest contact.test.js -t "Should can update existing contact"
  it("Should can update existing contact", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set("Authorization", "test")
      .send({
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@gmail.com",
        phone: "99999999",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe("John");
    expect(result.body.data.last_name).toBe("Doe");
    expect(result.body.data.email).toBe("johndoe@gmail.com");
    expect(result.body.data.phone).toBe("99999999");
  });

  // Command to run specific test case : npx jest contact.test.js -t "Should reject update contact if request is invalid"
  it("Should reject update contact if request is invalid", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set("Authorization", "test")
      .send({
        first_name: "",
        last_name: "",
        email: "johndoe",
        phone: "",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  // Command to run specific test case : npx jest contact.test.js -t "Should reject update contact if contact is not found"
  it("Should reject update contact if contact is not found", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .put("/api/contacts/" + (testContact.id + 1))
      .set("Authorization", "test")
      .send({
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@gmail.com",
        phone: "99999999",
      });

    expect(result.status).toBe(404);
  });
});

// Command to run specific test case : npx jest contact.test.js -t "DELETE /api/contacts/:contactId"
describe("DELETE /api/contacts/:contactId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  // Command to run specific test case : npx jest contact.test.js -t "Should can delete contact"
  it("Should can delete contact", async () => {
    let testContact = await getTestContact();
    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    testContact = await getTestContact();
    expect(testContact).toBeNull();
  });

  // Command to run specific test case : npx jest contact.test.js -t "Should reject delete contact if contact is not found"
  it("Should reject delete contact if contact is not found", async () => {
    let testContact = await getTestContact();
    const result = await supertest(web)
      .delete("/api/contacts/" + (testContact.id + 1))
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

// Command to run specific test case : npx jest contact.test.js -t "GET /api/contacts"
describe("GET /api/contacts", function () {
  beforeEach(async () => {
    await createTestUser();
    await createManyTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  // Command to run specific test case : npx jest contact.test.js -t "Should can search without parameter"
  it("Should can search without parameter", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  // Command to run specific test case : npx jest contact.test.js -t "Should can search to page 2"
  it("Should can search to page 2", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        page: 2,
      })
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(5);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  // Command to run specific test case : npx jest contact.test.js -t "Should can search using name"
  it("Should can search using name", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        name: "test 1",
      })
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  // Command to run specific test case : npx jest contact.test.js -t "Should can search using email"
  it("Should can search using email", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        email: "test1",
      })
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  // Command to run specific test case : npx jest contact.test.js -t "Should can search using phone"
  it("Should can search using phone", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        phone: "5554440001",
      })
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });
});
