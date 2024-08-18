import bcrypt from 'bcryptjs'
import { Authenticator } from "remix-auth";
import { authSessionStorage } from "./sessions.server";
import { prisma } from "./db.server";
import { User } from '@prisma/client'
import { redirect } from '@remix-run/node';


export const authenticator = new Authenticator<User>(authSessionStorage);

export const sessionKey = 'sessionId'

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30
export const getSessionExpirationDate = () =>
	new Date(Date.now() + SESSION_EXPIRATION_TIME)


export async function requireAnonymous(request: Request) {
	const userId = await getUserId(request)
	if (userId) {
		throw redirect('/')
	}
}

export async function getUserId(request: Request) {
	const authSession = await authSessionStorage.getSession(
		request.headers.get('cookie'),
	)
	const sessionId = authSession.get(sessionKey)
	if (!sessionId) return null
	const session = await prisma.session.findUnique({
		select: { user: { select: { id: true } } },
		where: { id: sessionId, expirationDate: { gt: new Date() } },
	})
	if (!session?.user) {
		throw redirect('/', {
			headers: {
				'set-cookie': await authSessionStorage.destroySession(authSession),
			},
		})
	}
	return session.user.id
}

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