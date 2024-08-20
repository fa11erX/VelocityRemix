import bcrypt from 'bcryptjs'
import { Authenticator } from "remix-auth";
import { authSessionStorage } from "./sessions.server";
import { prisma } from "./db.server";
import { Password, User } from '@prisma/client'
import { redirect } from '@remix-run/node';
import { safeRedirect } from 'remix-utils/safe-redirect';
import { combineHeaders, combineResponseInits } from '@/utils/misc.server';


export const authenticator = new Authenticator<User>(authSessionStorage);

export const sessionKey = 'sessionId'

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30
export const getSessionExpirationDate = () =>
	new Date(Date.now() + SESSION_EXPIRATION_TIME)


export async function requireAnonymous(request: Request) {
	const userId = await getUserId(request)
	if (userId) {
		throw redirect('/dashboard')
	}
}

export async function getUserId(request: Request) {
	const authSession = await authSessionStorage.getSession(
		request.headers.get('cookie'),
	)
	const sessionId = authSession.get(sessionKey)
	if (!sessionId) return null
	console.log('get session')
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

export async function requireUserId(
	request: Request,
	{ redirectTo }: { redirectTo?: string | null } = {},
) {
	const userId = await getUserId(request)
	if (!userId) {
		const requestUrl = new URL(request.url)
		redirectTo =
			redirectTo === null
				? null
				: redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`
		const loginParams = redirectTo ? new URLSearchParams({ redirectTo }) : null
		const loginRedirect = ['/auth', loginParams?.toString()]
			.filter(Boolean)
			.join('?')
		throw redirect(loginRedirect)
	}
	return userId
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

export async function login({
	email,
	password,
}: {
	email: User['email']
	password: string
}) {
	const user = await verifyUserPassword({ email }, password)
	if (!user) return null
	const session = await prisma.session.create({
		select: { id: true, expirationDate: true, userId: true },
		data: {
			expirationDate: getSessionExpirationDate(),
			userId: user.id,
		},
	})
	return session
}

export async function verifyUserPassword(
	where: Pick<User, 'email'> | Pick<User, 'id'>,
	password: Password['hash'],
) {
	const userWithPassword = await prisma.user.findUnique({
		where,
		select: { id: true, password: { select: { hash: true } } },
	})

	if (!userWithPassword || !userWithPassword.password) {
		return null
	}

	const isValid = await bcrypt.compare(password, userWithPassword.password.hash)

	if (!isValid) {
		return null
	}

	return { id: userWithPassword.id }
}


export async function getPasswordHash(password: string) {
	const hash = await bcrypt.hash(password, 10)
	return hash
}

export async function logout(
	{
		request,
		redirectTo = '/',
	}: {
		request: Request
		redirectTo?: string
	},
	responseInit?: ResponseInit,
) {
	const authSession = await authSessionStorage.getSession(
		request.headers.get('cookie'),
	)
	const sessionId = authSession.get(sessionKey)
	// if this fails, we still need to delete the session from the user's browser
	// and it doesn't do any harm staying in the db anyway.
	if (sessionId) {
		// the .catch is important because that's what triggers the query.
		// learn more about PrismaPromise: https://www.prisma.io/docs/orm/reference/prisma-client-reference#prismapromise-behavior
		void prisma.session.deleteMany({ where: { id: sessionId } }).catch(() => { })
	}
	throw redirect(safeRedirect(redirectTo), {
		...responseInit,
		headers: combineHeaders(
			{ 'set-cookie': await authSessionStorage.destroySession(authSession) },
			responseInit?.headers,
		),
	})
}

interface CreateUserSessionArgs {
	request: Request;
	session: {
		id: string,
		expirationDate: Date,
		userId: string
	};
	redirectTo?: string;
}


export async function createUserSession({
	request,
	session,
	redirectTo = '/dashboard',
}: CreateUserSessionArgs): Promise<Response> {
	const authSession = await authSessionStorage.getSession(
		request.headers.get('cookie'),
	);

	authSession.set(sessionKey, session.id);

	const responseInit: ResponseInit = combineResponseInits({
		headers: {
			'set-cookie': await authSessionStorage.commitSession(authSession),
		},
	});

	return redirect(safeRedirect(redirectTo), responseInit);
}