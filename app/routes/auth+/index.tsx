/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { z } from "zod";
import { safeRedirect } from 'remix-utils/safe-redirect'
import { Input } from "@/components/ui/input";
import { H3 } from "@/components/ui/typographie";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { login, requireAnonymous, sessionKey } from "@/services/auth.server";
import { authSessionStorage } from "@/services/sessions.server";
import { combineResponseInits } from "@/utils/misc.server";

export async function loader({ request }: LoaderFunctionArgs) {
    await requireAnonymous(request)
    return json({})
}

export async function action({
    request,
}: ActionFunctionArgs) {
    await requireAnonymous(request)

    const formData = await request.formData();

    const submission = await parseWithZod(formData, {
        schema: (intent) =>
            schema.transform(async (data, ctx) => {
                if (intent !== null) return { ...data, session: null }

                const session = await login(data)
                if (!session) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Invalid username or password',
                    })
                    return z.NEVER
                }

                return { ...data, session }
            }),
        async: true,
    })

    if (submission.status !== 'success' || !submission.value.session) {
        return json(
            { result: submission.reply({ hideFields: ['password'] }) },
            { status: submission.status === 'error' ? 400 : 200 },
        )
    }

    const { session, redirectTo } = submission.value


    const authSession = await authSessionStorage.getSession(
        request.headers.get('cookie'),
    )
    authSession.set(sessionKey, session.id)

    console.log(redirectTo)

    return redirect(
        safeRedirect(redirectTo),
        combineResponseInits(
            {
                headers: {
                    'set-cookie': await authSessionStorage.commitSession(authSession)
                },
            },
        ),
    )

}

const schema = z.object({
    email: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
    redirectTo: z.string().optional(),
    remember: z.boolean().optional(),
});

export default function LoginRoute() {

    const actionData = useActionData<typeof action>()

    const [searchParams] = useSearchParams()
    const redirectTo = searchParams.get('redirectTo')

    console.log(redirectTo)

    const [form, fields] = useForm({
        lastResult: actionData?.result,
        shouldRevalidate: 'onBlur',
        defaultValue: { redirectTo },
        constraint: getZodConstraint(schema),
        onValidate({ formData }) {
            const result = parseWithZod(formData, { schema: schema })
            return result
        },
    });

    return (
        <div>
            <div className="flex flex-col p-6 space-y-1">
                <H3>Login</H3>
                <p className="text-sm text-muted-foreground">
                    Login to your account</p>
                {form.errors}
            </div>
            <div className="p-6 pt-0 grid gap-4">
                <Form method="post" id={form.id} onSubmit={form.onSubmit} className="space-y-8">
                    <div className="">
                        <Input type="email" placeholder="Email" name={fields.email.name} />
                        <div>{fields.email.errors}</div>
                    </div>
                    <div className="">
                        <Input type="password" placeholder="Password" name={fields.password.name} />
                        <div>{fields.password.errors}</div>
                    </div>
                    <input
                        {...getInputProps(fields.redirectTo, { type: 'hidden' })}
                    />
                    <div className="flex items-center pt-0">
                        <Button type="submit" className="w-full">Create account</Button>
                    </div>
                </Form>
            </div>
            <div className="p-6 pt-0 grid gap-4 text-center">
                <Link to="/auth/register">
                    <p className="text-sm">
                        Don't have an account? Create account now
                    </p>
                </Link>
            </div>
        </div>
    );
}
