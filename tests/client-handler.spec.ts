import assert from "node:assert/strict";
import { test, describe, before, after } from "node:test";
import { DynamoDBClient } from "../src/infra/database/dynamoDB";
import { handler as createHandler } from "../src/handlers/clients/create";
import { handler as getHandler } from "../src/handlers/clients/get";
import { handler as getAllHandler } from "../src/handlers/clients/getAll";
import { handler as updateHandler } from "../src/handlers/clients/update";
import { handler as deleteHandler } from "../src/handlers/clients/delete";
import { startServer, stopServer } from "./setup";
import { request } from "./mocks/api-gateway";
import { randomUUID } from "node:crypto";
import { ClientNotFoundError } from "../src/core/exceptions/client-not-found";
import { InvalidRequestBodyError } from "../src/core/exceptions/invalid-request-body";
import { ValidationRequestError } from "../src/core/exceptions/validation-request";
import { RequiredPathParamError } from "../src/core/exceptions/path-param-required";

const dbClient = new DynamoDBClient();
let clientID = "";

before(() => {
  startServer();
});

after(() => {
  dbClient.emptyDatabase();
  stopServer();
});

describe("Client API", () => {
  describe("Success", () => {
    test("Should create a client", async () => {
      const data = {
        name: "Test User",
        birthDate: new Date(),
        status: "active",
        contacts: [{ type: "email", value: "test@example.com" }],
      };

      const event = request(data, "POST");

      const response = await createHandler(event);
      const createdClient = JSON.parse(response.body);

      clientID = createdClient.id;

      assert.strictEqual(response.statusCode, 201);
      assert.ok(createdClient.id);
      assert.ok(createdClient.name, data.name);
    });

    test("Should retrieve a client by ID", async () => {
      const event = request("", "GET", { id: clientID });

      const response = await getHandler(event);

      assert.strictEqual(response.statusCode, 200);
      assert.ok(JSON.parse(response.body).id, clientID);
    });

    test("Should retrieve all clients", async () => {
      const event = request("", "GET", );

      const response = await getAllHandler(event);

      assert.strictEqual(response.statusCode, 200);
    });

    test("Should update a client", async () => {
      const updatedData = { name: "Updated Name" };

      const event = request(updatedData, "PUT", { id: clientID });

      const response = await updateHandler(event);

      assert.strictEqual(response.statusCode, 204);
    });

    test("Should delete a client", async () => {
      const event = request("", "DELETE", { id: clientID });
      const response = await deleteHandler(event);

      assert.strictEqual(response.statusCode, 204);
    });
  });

  describe("Error", () => {
    describe("Error 404", () => {
      test("Should return a 404 when attempting to retrieve a non-existent client", async () => {
        const id = randomUUID();
        const event = request("", "GET", { id });
        const response = await getHandler(event);

        assert.strictEqual(response.statusCode, 404);
        assert.strictEqual(
          JSON.parse(response.body).message,
          new ClientNotFoundError(`Client not found for the provided ID (${id}).`).message
        );
      });

      test("Should return a 404 when attempting to delete a non-existent client", async () => {
        const id = randomUUID();
        const event = request("", "DELETE", { id });
        const response = await deleteHandler(event);

        assert.strictEqual(response.statusCode, 404);
        assert.strictEqual(
          JSON.parse(response.body).message,
          new ClientNotFoundError(`Client not found for the provided ID (${id}).`).message
        );
      });

      test("Should return a 404 when attempting to updating a non-existent client", async () => {
        const id = randomUUID();
        const event = request({ name: "Update Name" }, "PUT", { id });
        const response = await updateHandler(event);

        assert.strictEqual(response.statusCode, 404);
        assert.strictEqual(
          JSON.parse(response.body).message,
          new ClientNotFoundError(`Client not found for the provided ID (${id}).`).message
        );
      });
    });

    describe("Error 400", () => {
      test("Should return a 400 when passing an invalid or empty body", async () => {
        const event = request("", "POST");
        const response = await createHandler(event);

        assert.strictEqual(response.statusCode, 400);
        assert.strictEqual(
          JSON.parse(response.body).message,
          new InvalidRequestBodyError().message
        );
      });

      test("Should return a 400 when updating a client without providing an ID parameter", async () => {
        const event = request({ name: "Update Name" }, "PUT");
        const response = await updateHandler(event);

        assert.strictEqual(response.statusCode, 400);
        assert.strictEqual(
          JSON.parse(response.body).message,
          new RequiredPathParamError("Client ID is required").message
        );
      });

      test("Should return a 400 when deleting a client without providing an ID parameter", async () => {
        const event = request("", "DELETE");
        const response = await deleteHandler(event);

        assert.strictEqual(response.statusCode, 400);
        assert.strictEqual(
          JSON.parse(response.body).message,
          new RequiredPathParamError("Client ID is required").message
        );
      });
    });

    describe("Error 422", () => {
      test("Should return a 422 when validation fails while creating a client", async () => {
        const data = { name: "T", birthDate: new Date(), status: "active", contacts: [] };
        const event = request(data, "POST");
        const response = await createHandler(event);

        assert.strictEqual(response.statusCode, 422);
        assert.strictEqual(
          JSON.parse(response.body).message,
          new ValidationRequestError(null).message
        );
      });

      test("Should return a 422 when validation fails while updating a client", async () => {
        const id = randomUUID();
        const event = request({ name: "T" }, "PUT", { id });
        const response = await updateHandler(event);

        assert.strictEqual(response.statusCode, 422);
        assert.strictEqual(
          JSON.parse(response.body).message,
          new ValidationRequestError(null).message
        );
      });
    });
  });
});
