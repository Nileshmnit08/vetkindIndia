export const metadata = {
  title: "Terms of Service | VetKind",
  description: "Terms of service and conditions for VetKind.",
};

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950">
      <section className="bg-green-900 py-16 text-white md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Terms of Service
          </h1>
          <p className="text-xl text-green-100">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 md:px-6 md:py-20 max-w-4xl">
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>1. Terms</h2>
          <p>
            By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use.
          </p>
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on VetKind's website for personal, non-commercial transitory viewing only.
          </p>
          <h2>3. Disclaimer</h2>
          <p>
            The materials on VetKind's website are provided "as is". VetKind makes no warranties, expressed or implied.
          </p>
        </div>
      </section>
    </div>
  );
}
