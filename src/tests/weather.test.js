const request = require("supertest");
const app = require("../../index");

describe("Weather API Validation", () => {

    it("should return a successful response for a valid city", async () => {
        const response = await request(app)
            .get("/api/weather")
            .query({city: "Lviv"});
        expect(response.statusCode).toBe(200);
    });

    it("should fail with status 400 when city parameter is missing", async () => {
        const response = await request(app)
            .get("/api/weather"); // No .query() means no city parameter

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    path: "city",
                    msg: "City parameter is required",
                    location: "query"
                })
            ])
        );
    });

    it("should fail with status 400 when city parameter is an empty string", async () => {
        const response = await request(app)
            .get("/api/weather")
            .query({city: ""});

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({path: "city", msg: "City parameter is required"}),
                expect.objectContaining({path: "city", msg: "City name must be at least 2 characters long"})
            ])
        );
    });

    it("should fail with status 400 when city name is too short", async () => {
        const response = await request(app)
            .get("/api/weather")
            .query({city: "A"});

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({path: "city", msg: "City name must be at least 2 characters long"})
            ])
        );
    });
});