const request = require("supertest");
const app = require("../../index");

describe("Subscription API", () => {

    afterAll(async () => {
        if (app && app.server) {
            app.server.close((err) => {
                if (err) {
                    console.error("Error closing server:", err);
                }
            });
        } else {
            console.warn("Server instance not found on app, cannot close explicitly. This might cause Jest to hang.");
        }
    });

    it("should create a subscription with valid data", async () => {
        const response = await request(app)
            .post("/api/subscribe")
            .send({
                email: "validtest" + Date.now() + "@example.com", // unique email per run
                city: "Kyiv",
                frequency: "hourly"
            });

        expect(response.statusCode).toBe(201);
    });

    it("should fail when email is missing", async () => {
        const response = await request(app)
            .post("/api/subscribe")
            .send({
                city: "Lviv",
                frequency: "daily"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({path: "email", msg: "Please provide a valid email address"})
            ])
        );
    });

    it("should fail when city is missing", async () => {
        const response = await request(app)
            .post("/api/subscribe")
            .send({
                email: "testcitymissing@example.com",
                frequency: "daily"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({path: "city", msg: "City is required"})
            ])
        );
    });

    it("should fail when frequency is missing", async () => {
        const response = await request(app)
            .post("/api/subscribe")
            .send({
                email: "testfreqmissing@example.com",
                city: "Odesa"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({path: "frequency", msg: "Frequency is required"})
            ])
        );
    });

    it("should fail when email format is invalid", async () => {
        const response = await request(app)
            .post("/api/subscribe")
            .send({
                email: "not-an-email",
                city: "Dnipro",
                frequency: "daily"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({path: "email", msg: "Please provide a valid email address"})
            ])
        );
    });

    it("should fail when city name is too short", async () => {
        const response = await request(app)
            .post("/api/subscribe")
            .send({
                email: "cityshort@example.com",
                city: "A",
                frequency: "daily"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({path: "city", msg: "City name must be at least 2 characters long"})
            ])
        );
    });

    it("should not allow duplicate emails", async () => {
        const email = "unique.duplicate.test" + Date.now() + "@example.com";

        const firstResponse = await request(app)
            .post("/api/subscribe")
            .send({
                email,
                city: "Kharkiv",
                frequency: "daily"
            });

        expect(firstResponse.statusCode).toBe(201);

        // Second request with the same email - should fail
        const secondResponse = await request(app)
            .post("/api/subscribe")
            .send({
                email,
                city: "Kharkiv",
                frequency: "daily"
            });

        expect([400, 409]).toContain(secondResponse.statusCode);
    });
});