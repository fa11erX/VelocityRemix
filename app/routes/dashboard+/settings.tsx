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
import { json } from "@remix-run/node";
import { format } from "date-fns";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
    const sessions = await prisma.session.findMany()
    return json({ sessions });
};

export default function Index() {
    const { sessions } = useLoaderData<typeof loader>();

    return (
        <div className="font-sans p-4">
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
                                <TableCell><Button size="sm">Revoke</Button></TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </div>
        </div>
    );
}