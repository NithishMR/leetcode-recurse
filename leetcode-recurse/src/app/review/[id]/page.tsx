"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function UpdateProblemSolution() {
  const { id } = useParams();

  const [problemName, setProblemName] = useState("");
  const [reviewCount, setReviewCount] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 🔹 Fetch problem details
  useEffect(() => {
    if (!id) return;

    const fetchProblem = async () => {
      try {
        const res = await fetch(`/api/problems/details/${id}`);
        const data = await res.json();

        setProblemName(data.problemName);
        setReviewCount(data.timesSolved);
      } catch (err) {
        console.error("Error fetching problem:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  // 🔹 Handle submit
  const handleSubmit = async () => {
    if (!problemName || reviewCount === null || !code) {
      alert("Fill all fields");
      return;
    }

    setSubmitting(true);

    try {
      const safeProblemName = problemName.toLowerCase().replace(/\s+/g, "-");

      const githubRes = await fetch(`/api/github/push-solution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemName: safeProblemName,
          reviewCount,
          code,
          language,
        }),
      });

      const data = await githubRes.json();

      if (!githubRes.ok) {
        console.error("GitHub Error:", data);
        throw new Error(data.error || "GitHub push failed");
      }

      alert("Solution pushed to GitHub!");
      setCode("");
    } catch (err) {
      console.error(err);
      alert("Failed to push solution");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen mt-16 bg-gray-50 px-4 py-10 dark:bg-[#0d0d0d]">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-[#262626] dark:bg-[#161616]">
          {/* HEADER */}
          {loading ? (
            <div className="space-y-4 mb-8">
              <Skeleton className="h-8 w-[60%]" />
              <Skeleton className="h-4 w-[40%]" />
            </div>
          ) : (
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-[#f3f3f3]">
                {problemName}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Current Review Count:{" "}
                <span className="font-semibold">{reviewCount}</span>
              </p>
            </div>
          )}

          {/* FORM */}
          <div className="space-y-6">
            {/* Language */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Language
              </label>

              {loading ? (
                <Skeleton className="h-10 w-full rounded-md" />
              ) : (
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="
                    w-full rounded-md border px-3 py-2 text-sm
                    bg-white text-gray-800 border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-500

                    dark:bg-[#121212]
                    dark:border-[#262626]
                    dark:text-gray-200
                    dark:focus:ring-blue-500
                  "
                >
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">Typescript</option>
                  <option value="csharp">C#</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="kotlin">Kotlin</option>
                  <option value="swift">Swift</option>
                  <option value="sql">Sql</option>
                </select>
              )}
            </div>

            {/* Code */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Solution
              </label>

              {loading ? (
                <Skeleton className="h-[250px] w-full rounded-xl" />
              ) : (
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                  className="
                    w-full h-64 rounded-xl border p-4 font-mono text-sm
                    bg-white text-gray-800 border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-500

                    dark:bg-[#111111]
                    dark:border-[#262626]
                    dark:text-gray-200
                  "
                />
              )}
            </div>

            {/* Submit */}
            <div>
              {loading ? (
                <Skeleton className="h-12 w-full rounded-xl" />
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="
                    w-full rounded-xl px-4 py-3 text-sm font-medium
                    bg-blue-600 text-white
                    hover:bg-blue-700
                    disabled:opacity-50

                    transition
                    cursor-pointer
                  "
                >
                  {submitting ? "Submitting..." : "Push to GitHub"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
