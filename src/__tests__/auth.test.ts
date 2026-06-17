import request from "supertest";
import createApp from "../app";
import prisma from "../lib/prisma";

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

const app = createApp();

// A common pattern: clear and seed the database for each test or test suite
beforeAll(async () => {
    // Clear the database before all tests run
    await prisma.users.deleteMany({});
});

afterAll(async () => {
    await prisma.$disconnect(); // Disconnect Prisma Client after all tests
});

describe("AUTH API", () => {
    // Test POST /usertests
    it("should create a new users", async () => {
        const newuser = {
            username: "TiredDev3",
            firstname: "Tired3",
            lastname: "Dev3",
            password: "hello3",
            role: "ADMIN",
            email: "tireddev3@dev.com",
            course: "Software Engineering",
        };

        const res = await request(app)
            .post("/api/auth/signup")
            .send(newuser)
            .set("Accept", "application/json")
            .expect(201);

        expect(res.body.user).toHaveProperty("id", res.body.user.id);
        expect(res.body.user).toHaveProperty("firstname", newuser.firstname);

        // Verify it's actually in the database
        const usertestInDb = await prisma.users.findUnique({
            where: { email: newuser.email },
        });
        expect(usertestInDb).not.toBeNull();
        expect(usertestInDb?.firstname).toEqual(newuser.firstname);
    });

    it("should return 400 if email is missing when creating a usertest", async () => {
        const newuser = {
            username: "TiredDev3",
            firstname: "Tired3",
            lastname: "Dev3",
            password: "hello3",
            role: "ADMIN",
            course: "Software Engineering",
        };

        const res = await request(app)
            .post("/api/auth/signup")
            .send(newuser)
            .set("Accept", "application/json")
            .expect(400);

        expect(res.body).toHaveProperty("success", false);
    });

    it("should return 400 if email is wrong", async () => {
        await request(app)
            .post("/api/auth/login")
            .send({
                email: "tireddev2@dev.com",
                password: "hello3",
            })
            .set("Accept", "application/json")
            .expect(404);
    });

    it("should return 400 if password is wrong", async () => {
        await request(app)
            .post("/api/auth/login")
            .send({
                email: "tireddev3@dev.com",
                password: "hello2",
            })
            .set("Accept", "application/json")
            .expect(400);
    });

    it("should set cookie if email and password are valid", async () => {
        const login_data = {
            email: "tireddev3@dev.com",
            password: "hello3",
        };

        const res = await request(app)
            .post("/api/auth/login")
            .send(login_data)
            .set("Accept", "application/json")
            .expect(200);

        expect(res.headers["set-cookie"]).toBeDefined();
        expect(res.headers["set-cookie"][0]).toMatch(/^tk=.*/);
        expect(res.headers["set-cookie"][0]).toMatch(/HttpOnly/i); // Check for HttpOnly flag

        expect(res.body).toHaveProperty("success", true);
    });
});
