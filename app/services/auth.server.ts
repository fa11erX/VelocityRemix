import bcrypt from 'bcryptjs'
import { Authenticator } from "remix-auth";
import { authSessionStorage } from "./sessions.server";
import { prisma } from "./db.server";
import { User } from '@prisma/client'


export const authenticator = new Authenticator<User>(authSessionStorage);

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30
export const getSessionExpirationDate = () =>
	new Date(Date.now() + SESSION_EXPIRATION_TIME)

export async function createUser({
	email,
	password,
}: {
	email: User['email']
	password: string
}) {

	const hashedPassword = await getPasswordHash(password)


	const session = await prisma.session.create({
		data: {
			expirationDate: getSessionExpirationDate(),
			user: {
				create: {
					email: email.toLowerCase(),
					roles: { connect: { name: 'user' } },
					password: {
						create: {
							hash: hashedPassword,
						},
					},
				},
			},
		},
		select: { id: true, expirationDate: true },
	})

	return session

}


export async function getPasswordHash(password: string) {
	const hash = await bcrypt.hash(password, 10)
	return hash
}