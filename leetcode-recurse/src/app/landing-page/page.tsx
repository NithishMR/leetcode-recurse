import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import ThemeSetter from "./ThemeSetter";
export default function LandingPage() {
  return (
    <main className="w-full bg-background text-foreground">
      <section className="absolute right-12 top-6">
        <ThemeSetter />
      </section>
      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6  pt-28 pb-24">
        <div className="grid gap-16 md:grid-cols-2 items-center">
          {/* Text */}
          <div className="flex flex-col gap-6">
            <p className="text-xs tracking-widest text-muted-foreground uppercase">
              Anamnesis
            </p>

            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Think once. <br />
              <span className="text-primary">Remember longer.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              Anamnesis helps developers remember how they solved problems — not
              just that they solved them.
            </p>

            <p className="text-muted-foreground max-w-xl">
              Capture your approach, mistakes, and insights, then revisit them
              later using spaced repetition.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
            >
              Get started
            </Link>

            <p className="text-xs text-muted-foreground mt-2">
              Early beta • Feedback welcome
            </p>
          </div>

          {/* Visual Placeholder */}
          <div className="flex justify-center">
            <div className="h-[300px] w-full max-w-[460px] rounded-2xl border bg-muted flex items-center justify-center text-sm text-muted-foreground">
              <Image
                src="/anamnesis-hero.png"
                alt="workflow of anamnesis"
                title="anamnesis workflow"
                width={460}
                height={300}
                className="rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY ================= */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold mb-6">Why Anamnesis exists</h2>

        <p className="text-lg text-muted-foreground mb-10">
          Most developers forget solved problems — not because they didn’t
          learn, but because they never revisited their thinking.
        </p>

        <div className="text-left max-w-2xl mx-auto space-y-4 text-muted-foreground">
          <p>Real learning happens in:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>The wrong approach you tried first</li>
            <li>The key insight that unlocked the solution</li>
            <li>The mistake you don’t want to repeat</li>
          </ul>

          <p className="pt-4">
            Anamnesis is built to store that thinking — and bring it back when
            your memory starts to fade.
          </p>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2 rounded-3xl border bg-background p-10">
          {/* Steps */}
          <div className="flex flex-col gap-10">
            {[
              {
                title: "Capture your thinking",
                desc: "Add a problem and write how you approached it.",
              },
              {
                title: "Store context",
                desc: "Save insights, mistakes, and patterns you noticed.",
              },
              {
                title: "Revisit intelligently",
                desc: "Get reminders using spaced repetition, not randomness.",
              },
            ].map((item) => (
              <div key={item.title} className="border-l-2 pl-5">
                <p className="font-medium text-lg">{item.title}</p>
                <p className="text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}

            <Link
              href="/"
              className="inline-flex w-fit items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground"
            >
              Start using Anamnesis
            </Link>
          </div>

          {/* Visual */}
          <div className="flex items-center justify-center">
            <div className=" w-full max-w-[460px] rounded-2xl border bg-muted flex items-center justify-center text-sm text-muted-foreground">
              <Image
                src="/anamnesis-workflow.png"
                alt="workflow of anamnesis"
                title="anamnesis workflow"
                width={460}
                height={600}
                className="rounded-2xl "
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold mb-12">
          Designed for focused learning
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Low friction",
              desc: "Quick entries that don’t interrupt your problem-solving flow.",
            },
            {
              title: "Personal insights",
              desc: "Your notes, your mistakes, your understanding — preserved.",
            },
            {
              title: "Memory-first",
              desc: "Built around recall and retention, not streaks or counts.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border p-8 text-left">
              <p className="font-medium text-lg mb-2">{item.title}</p>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Frequently asked questions
        </h2>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What problem does Anamnesis solve?
            </AccordionTrigger>
            <AccordionContent>
              Most developers forget how they solved problems after a few weeks.
              Anamnesis helps you store your thinking, mistakes, and insights so
              you can revisit them later instead of starting from scratch.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              Is this a replacement for LeetCode or other platforms?
            </AccordionTrigger>
            <AccordionContent>
              No. Anamnesis complements problem-solving platforms. You still
              solve problems on LeetCode, Codeforces, etc. Anamnesis is where
              you reflect, record, and remember your learning.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              How does the review system work?
            </AccordionTrigger>
            <AccordionContent>
              When you add a problem, Anamnesis schedules future review dates
              using spaced repetition. When you review and mark it solved again,
              the next review date is automatically updated.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Is Anamnesis free to use?</AccordionTrigger>
            <AccordionContent>
              Yes. Anamnesis is currently free and in early beta. The focus
              right now is learning, feedback, and building something genuinely
              useful for developers.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ================= CTA ================= */}
      <section className="border-t">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl font-semibold mb-4">
            Think once. Remember longer.
          </h2>

          <p className="text-muted-foreground mb-10">
            Anamnesis is in early beta. Your feedback shapes what it becomes.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Get started
          </Link>

          <p className="text-xs text-muted-foreground mt-4">
            Early beta • Feedback welcome
          </p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
          <p>Anamnesis © 2025</p>

          <div className="flex gap-6">
            <Link
              href="https://github.com/NithishMR"
              className="hover:text-foreground"
            >
              GitHub
            </Link>
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link
              href="https://google-inspired-portfolio.pages.dev/"
              className="hover:text-foreground"
            >
              About the developer
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
