import { prisma } from "@/services/db.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
    const posts = await prisma.post.findMany()
    return json({ posts });
};

export default function Index() {
    const { posts } = useLoaderData<typeof loader>();

    return (
        <div className="font-sans p-4">
            My post
            <div>
            {posts.length ? (
              <ul>
                {posts.map((post) => (
                  <li key={post.id}>
                    {post.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
            </div>
        </div>
    );
}