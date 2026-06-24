"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPost, deletePost } from "../action/user.action";
import Link from "next/link";

export default function PostsPage() {
  const queryClient = useQueryClient();

  // Fetch posts
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await getPost();
      return response.post;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await deletePost(id);
    },
    onSuccess: () => {
      // Invalidate the query to refetch posts automatically
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  if (isLoading) return <div className="text-center mt-10">Loading posts...</div>;
  if (isError) return <div className="text-center mt-10 text-red-500">Error loading posts.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Posts</h1>
        <Link
          href="/createPost"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Create New Post
        </Link>
      </div>

      {data?.length === 0 ? (
        <p className="text-gray-500">No posts available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 truncate">{post.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
              
              <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/posts/${post.id}`}
                  className="flex-1 text-center bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition text-sm font-medium"
                >
                  Edit
                </Link>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this post?")) {
                      deleteMutation.mutate(post.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="flex-1 bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 transition text-sm font-medium disabled:opacity-50"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
