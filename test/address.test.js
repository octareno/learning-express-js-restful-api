import supertest from "supertest";
import {
  createTestContact,
  createTestUser,
  getTestContact,
  removeAllTestAddresses,
  removeAllTestContacts,
  removeTestUser,
  createTestAddress,
  getTestAddress,
} from "./test-util.js";
import { web } from "../src/application/web.js";

// Command to run all test case in this file : npx jest address.test.js
// Command to run specific test case : npx jest address.test.js -t "POST /api/contacts/:contactId/addresses"
describe("POST /api/contacts/:contactId/addresses", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  // Command to run specific test case : npx jest address.test.js -t "Should can create new address"
  it("Should can create new address", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "street test",
        city: "city test",
        province: "province test",
        country: "Indonesia",
        postal_code: "123123",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("street test");
    expect(result.body.data.city).toBe("city test");
    expect(result.body.data.province).toBe("province test");
    expect(result.body.data.country).toBe("Indonesia");
    expect(result.body.data.postal_code).toBe("123123");
  });

  // Command to run specific test case : npx jest address.test.js -t "Should reject create address if address request is invalid"
  it("Should reject create address if address request is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "street test",
        city: "city test",
        province: "province test",
        country: "",
        postal_code: "",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  // Command to run specific test case : npx jest address.test.js -t "Should reject create address if contact is not found"
  it("Should reject create address if contact is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post("/api/contacts/" + (testContact.id + 1) + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "street test",
        city: "city test",
        province: "province test",
        country: "",
        postal_code: "",
      });

    expect(result.status).toBe(404);
  });
});

// Command to run specific test case : npx jest address.test.js -t "POST /api/contacts/:contactId/addresses"
describe("GET /api/contacts/:contactId/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  // Command to run specific test case : npx jest address.test.js -t "Should can get address"
  it("Should can get address", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("street test");
    expect(result.body.data.city).toBe("city test");
    expect(result.body.data.province).toBe("province test");
    expect(result.body.data.country).toBe("Indonesia");
    expect(result.body.data.postal_code).toBe("123123");
  });

  // Command to run specific test case : npx jest address.test.js -t "Should reject get address if contact is not found"
  it("Should reject get address if contact is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get(
        "/api/contacts/" + (testContact.id + 1) + "/addresses/" + testAddress.id
      )
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });

  // Command to run specific test case : npx jest address.test.js -t "Should reject get address if address is not found"
  it("Should reject get address if address is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get(
        "/api/contacts/" + testContact.id + "/addresses/" + (testAddress.id + 1)
      )
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

// Command to run specific test case : npx jest address.test.js -t "PUT /api/contacts/:contactId/addresses/:addressId"
describe("PUT /api/contacts/:contactId/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  // Command to run specific test case : npx jest address.test.js -t "Should can update address"
  it("Should can update address", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "test")
      .send({
        street: "street",
        city: "city",
        province: "province",
        country: "Singapore",
        postal_code: "111111",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testAddress.id);
    expect(result.body.data.street).toBe("street");
    expect(result.body.data.city).toBe("city");
    expect(result.body.data.province).toBe("province");
    expect(result.body.data.country).toBe("Singapore");
    expect(result.body.data.postal_code).toBe("111111");
  });

  // Command to run specific test case : npx jest address.test.js -t "Should reject update address if request is invalid"
  it("Should reject update address if request is invalid", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "test")
      .send({
        street: "street",
        city: "city",
        province: "province",
        country: "",
        postal_code: "",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  // Command to run specific test case : npx jest address.test.js -t "Should reject update address if address is not found"
  it("Should reject update address if address is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put(
        "/api/contacts/" + testContact.id + "/addresses/" + (testAddress.id + 1)
      )
      .set("Authorization", "test")
      .send({
        street: "street",
        city: "city",
        province: "province",
        country: "Singapore",
        postal_code: "111111",
      });

    expect(result.status).toBe(404);
  });

  // Command to run specific test case : npx jest address.test.js -t "Should reject update address if contact is not found"
  it("Should reject update address if contact is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put(
        "/api/contacts/" + (testContact.id + 1) + "/addresses/" + testAddress.id
      )
      .set("Authorization", "test")
      .send({
        street: "street",
        city: "city",
        province: "province",
        country: "Singapore",
        postal_code: "111111",
      });

    expect(result.status).toBe(404);
  });
});

// Command to run specific test case : npx jest address.test.js -t "DELETE /api/contacts/:contactId/addresses/:addressId"
describe("DELETE /api/contacts/:contactId/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  // Command to run specific test case : npx jest address.test.js -t "Should can remove address"
  it("Should can remove address", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete(
        "/api/contacts/" + testContact.id + "/addresses/" + testAddress.id
      )
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    testAddress = await getTestAddress();
    expect(testAddress).toBeNull();
  });

  // Command to run specific test case : npx jest address.test.js -t "Should reject delete address if address is not found"
  it("Should reject delete address if address is not found", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete(
        "/api/contacts/" + testContact.id + "/addresses/" + (testAddress.id + 1)
      )
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });

  // Command to run specific test case : npx jest address.test.js -t "Should reject delete address if contact is not found"
  it("Should reject delete address if contact is not found", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete(
        "/api/contacts/" + (testContact.id + 1) + "/addresses/" + testAddress.id
      )
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

// Command to run specific test case : npx jest address.test.js -t "GET /api/contacts/:contactId/addresses"
describe("GET /api/contacts/:contactId/addresses", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  // Command to run specific test case : npx jest address.test.js -t "Should can list addresses"
  it("Should can list addresses", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1);
  });

  // Command to run specific test case : npx jest address.test.js -t "Should reject get address if contact is not found"
  it("Should reject get address if contact is not found", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .get("/api/contacts/" + (testContact.id + 1) + "/addresses")
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});
