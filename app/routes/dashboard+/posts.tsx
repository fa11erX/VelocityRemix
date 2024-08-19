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
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        My post</h2>
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
            <i>No posts</i>
          </p>
        )}
      </div>
    </div>
  );
}