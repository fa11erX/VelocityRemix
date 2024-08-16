import { Authenticator } from "remix-auth";
import { authSessionStorage } from "./sessions.server";
import { User } from "@prisma/client";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(authSessionStorage);