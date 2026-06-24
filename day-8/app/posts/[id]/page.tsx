"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostById, updatePost } from "../../action/user.action";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import Link from "next/link";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resolvedParams = use(params);
  const postId = Number(resolvedParams.id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Fetch post data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await getPostById(postId);
      return response.post;
    },
  });

  // Populate state when data is loaded
  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setContent(data.content);
    }
  }, [data]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      await updatePost(postId, title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      router.push("/posts");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateMutation.mutate({ title, content });
  };

  if (isLoading) return <div className="text-center mt-10">Loading post...</div>;
  if (isError || !data) return <div className="text-center mt-10 text-red-500">Error loading post or post not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Edit Post
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <div className="mt-1">
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <div className="mt-1">
                <textarea
                  id="content"
                  name="content"
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Link
                href="/posts"
                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? "Updating..." : "Update Post"}
              </button>
            </div>
            
            {updateMutation.isError && (
              <div className="text-red-500 text-sm text-center">
                Something went wrong. Please try again!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
