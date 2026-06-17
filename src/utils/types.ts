import { Role } from "@prisma/client";

export interface user {
    username: string;
    firstname: string;
    lastname: string;
    role: Role;
    email: string;
    password: string;
    course: string;
}
