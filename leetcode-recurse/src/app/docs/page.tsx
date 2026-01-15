import Link from "next/link";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-gray-200 px-4 sm:px-6 py-12 mt-14">
      {/* HEADER */}
      <header className="text-center mb-12 sm:mb-16 relative">
        <div
          className="absolute top-20 left-52 w-2.5 h-2.5 rounded-full"
          id="docs-page"
        ></div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          📘 Documentation
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-2">
          Learn how to use the{" "}
          <b>
            <i>Anamnesis</i>
          </b>{" "}
          Problem Review Tracker effectively.
        </p>
      </header>

      {/* MAIN CONTENT */}
      <main className="space-y-14 sm:space-y-16 max-w-4xl mx-auto">
        {/* SECTION 1 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            1. What is this app?
          </h2>
          <article className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              This application helps you track coding problems you solve on
              platforms like LeetCode, GFG, Codeforces, and more. It uses a{" "}
              <b>
                <i>spaced repetition</i>
              </b>{" "}
              system to ensure long-term retention.
            </p>
            <p>
              You add a problem → App schedules review → You review on time →
              You stay consistent.
            </p>
          </article>
        </section>

        {/* SECTION 2 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            2. Authentication
          </h2>
          <article className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              You can sign in using <b>Google OAuth</b>. No password required
              and your data remains secure.
            </p>
            <ul className="list-disc ml-6 sm:ml-8 space-y-1">
              <li>Email</li>
              <li>Name</li>
              <li>Profile Picture</li>
              <li>Your stored problems, activity logs, and review data</li>
            </ul>
          </article>
        </section>

        {/* SECTION 3 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            3. Adding Problems
          </h2>
          <article className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Navigate to{" "}
              <code className="px-1 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded">
                /problems
              </code>{" "}
              to add a new problem.
            </p>

            <p>Fields to fill:</p>
            <ul className="list-disc ml-6 sm:ml-8 space-y-1">
              <li>Problem name</li>
              <li>Problem URL</li>
              <li>Difficulty</li>
              <li>Source</li>
              <li>Notes (optional)</li>
              <li>Date solved</li>
            </ul>

            <p>
              Once added, the app automatically schedules your{" "}
              <b>
                <i>next review date</i>
              </b>{" "}
              based on spaced repetition.
            </p>
          </article>
        </section>

        {/* SECTION 4 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            4. Viewing Problems
          </h2>
          <article className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Visit{" "}
              <code className="px-1 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded">
                /view-problems
              </code>{" "}
              to see your entire list.
            </p>

            <ul className="list-disc ml-6 sm:ml-8 space-y-1">
              <li>Pagination</li>
              <li>Filtering</li>
              <li>Status indicators</li>
              <li>Edit/Delete problem</li>
              <li>10 entries per page by default</li>
            </ul>
          </article>
        </section>

        {/* SECTION 5 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            5. Review System
          </h2>
          <article className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>The app shows what you should review next:</p>

            <ul className="list-disc ml-6 sm:ml-8 space-y-1">
              <li>
                <b>Upcoming Reviews</b> → next 7 days
              </li>
              <li>
                <b>Pending Today</b> → due today
              </li>
              <li>
                <b>Overdue</b> → missed problems
              </li>
            </ul>

            <p>
              Clicking{" "}
              <b className="relative">
                <b
                  className="absolute  w-[130px] h-2.5 top-15 rounded-full "
                  id="problem-review-instruction"
                ></b>
                <i>Solve the problem</i>
              </b>{" "}
              resets the next review date automatically.
            </p>
          </article>
        </section>

        {/* SECTION 6 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            6. Dashboard
          </h2>
          <article className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Dashboard at{" "}
              <code className="px-1 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded">
                /dashboard
              </code>{" "}
              visualizes:
            </p>

            <ul className="list-disc ml-6 sm:ml-8 space-y-1">
              <li>Total problems</li>
              <li>Reviewed today</li>
              <li>Pending</li>
              <li>Overdue</li>
              <li>Difficulty distribution</li>
              <li>Weekly progress chart</li>
              <li>Recent activity logs</li>
            </ul>
          </article>
        </section>

        {/* SECTION 7 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            7. Daily Cron Jobs
          </h2>
          <article className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              A scheduled CronJob runs daily to check for due reviews and send
              reminder emails.
            </p>
            <p>
              Cron runs at <b>00:00 (midnight)</b> using sender:
              <br />
              <b>
                <i>anamnesis.tracker@gmail.com</i>
              </b>
            </p>
          </article>
        </section>

        {/* SECTION 8 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            8. FAQs
          </h2>
          <article className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              <b>Q:</b> Are my problems private?
              <br />
              <b>A:</b> Yes — only you can access them.
            </p>

            <p>
              <b>Q:</b> Can I export my problems?
              <br />
              <b>A:</b> Export feature will be added soon.
            </p>

            <p>
              <b>Q:</b> What if cron fails?
              <br />
              <b>A:</b> Dashboard detects pending reviews automatically.
            </p>
          </article>
        </section>

        {/* FOOTER */}
        <footer className="text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-12">
          © {new Date().getFullYear()} Problem Review Tracker — Built with ❤️ &
          Next.js by{" "}
          <Link
            href="https://www.linkedin.com/in/nithishmr/?originalSubdomain=in"
            target="_blank"
            className="hover:underline text-blue-600 dark:text-blue-400"
          >
            NithishMR
          </Link>
        </footer>
      </main>
    </div>
  );
}
