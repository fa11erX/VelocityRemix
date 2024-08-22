import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { prisma } from "@/services/db.server";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { format } from "date-fns";
import { Form, useLoaderData } from "@remix-run/react";

export const loader = async () => {
    const sessions = await prisma.session.findMany()
    return json({ sessions });
};

export async function action({ request }: ActionFunctionArgs) {
    if (request.method === 'DELETE') {
        const data = new URLSearchParams(await request.text())

        const sessionId = data.get('sessionId')
        if (!sessionId)
            return json(
                { error: 'Session id must be defined' },
                {
                    status: 400,
                }
            )
        const deletedSession = await prisma.session.delete({
            where: {
                id: sessionId
            }
        })

        return json({ session: deletedSession }, { status: 200 })

    }
    return null
}

export default function Index() {
    const { sessions } = useLoaderData<typeof loader>();

    return (
        <div className="font-sans p-4 w-full">
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Sessions</h2>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Session id</TableHead>
                            <TableHead>Expiration date</TableHead>
                            <TableHead>Update At</TableHead>
                            <TableHead>action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sessions.map((session) => (
                            <TableRow key={session.id} >
                                <TableCell className="font-medium">{session.id}</TableCell>
                                <TableCell>{format(session.expirationDate, "dd MMMM yyyy hh:mm")}</TableCell>
                                <TableCell>{format(session.updatedAt, "dd MMMM yyyy hh:mm")}</TableCell>
                                <TableCell>
                                    <Form
                                        method="delete"
                                    >
                                        <input hidden name="sessionId" defaultValue={session.id} />
                                        <Button size="sm">
                                            Revoke
                                        </Button>
                                    </Form>
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </div>
        </div>
    );
}