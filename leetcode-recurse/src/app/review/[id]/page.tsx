"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
        setReviewCount(data.timesSolved); // using existing count
      } catch (err) {
        console.error("Error fetching problem:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  // 🔹 Handle submit (ONLY GitHub)
  const handleSubmit = async () => {
    if (!problemName || reviewCount === null || !code) {
      alert("Fill all fields");
      return;
    }

    setSubmitting(true);

    try {
      // sanitize problem name (VERY IMPORTANT)
      const safeProblemName = problemName.toLowerCase().replace(/\s+/g, "-");

      const githubRes = await fetch(`/api/github/push-solution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemName: safeProblemName,
          reviewCount, // use current count
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

  if (loading) return <div className="mt-20">Loading...</div>;

  return (
    <div className="mt-20 px-6 max-w-3xl mx-auto">
      {/* 🔹 Problem Details */}
      <h1 className="text-2xl font-bold mb-2">{problemName}</h1>
      <p className="mb-6 text-gray-600">Current Review Count: {reviewCount}</p>

      {/* 🔹 Language Dropdown */}
      <label className="block mb-2 font-medium">Select Language</label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border p-2 mb-4 w-full rounded"
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
      </select>

      {/* 🔹 Code Input */}
      <label className="block mb-2 font-medium">Your Solution</label>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border p-3 w-full h-64 mb-4 font-mono rounded"
        placeholder="Paste your code here..."
      />

      {/* 🔹 Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Push to GitHub"}
      </button>
    </div>
  );
}
