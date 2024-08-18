import { Button } from "@/components/ui/button";
import { useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { H2 } from "@/components/ui/typographie";
import { Form, Link, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { prisma } from "@/services/db.server";
import { createUser } from "@/services/auth.server";


export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    schema: schema.superRefine(async (data, ctx) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
        select: { id: true },
      })
      if (existingUser) {
        ctx.addIssue({
          path: ['email'],
          code: z.ZodIssueCode.custom,
          message: 'A user already exists with this email',
        })
        return
      }
    }).transform(async (data) => {
      const session = await createUser({ ...data })
      return { ...data, session }
    }),
    async: true,
  })

  if (submission.status !== 'success') {
    return json(
      { result: submission.reply() },
      { status: submission.status === 'error' ? 400 : 200 },
    )
  }
  return redirect('/login')

}

const schema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export default function RegisterRoute() {

  const actionData = useActionData<typeof action>()

  const [form, fields] = useForm({
    lastResult: actionData?.result,
    shouldRevalidate: 'onBlur',
    constraint: getZodConstraint(schema),
    onValidate({ formData }) {
      const result = parseWithZod(formData, { schema: schema })
      return result
    },
  });

  return (
    <div>
      <H2>Create account</H2>
      <Form method="post" id={form.id} onSubmit={form.onSubmit} className="space-y-8">
        <div className="">
          <Input type="email" placeholder="Email" name={fields.email.name} />
          <div>{fields.email.errors}</div>
        </div>
        <div className="">
          <Input type="password" placeholder="Password" name={fields.password.name} />
          <div>{fields.password.errors}</div>
        </div>
        <Button type="submit">Submit</Button>
      </Form>
      <Link to="/auth">
        Login
      </Link>
    </div>
  );
}
