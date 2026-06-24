"use client";

import { useMutation } from "@tanstack/react-query";
import { createPost } from "../action/user.action";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function CreatePostPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      await createPost(formData);
    },
    onSuccess: () => {
      formRef.current?.reset();
      router.push("/posts");
      router.refresh();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new Post
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="My awesome title"
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="What's on your mind?"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? "Publishing..." : "Publish Post"}
              </button>
            </div>
            
            {mutation.isError && (
              <div className="text-red-500 text-sm text-center">
                Something went wrong. Please try again!
              </div>
            )}
            
            {mutation.isSuccess && (
              <div className="text-green-600 text-sm text-center">
                Post created successfully! Redirecting...
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
