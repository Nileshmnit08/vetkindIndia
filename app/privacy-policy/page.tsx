export const metadata = {
  title: "Privacy Policy | VetKind",
  description: "Privacy policy for VetKind.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950">
      <section className="bg-green-900 py-16 text-white md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-xl text-green-100">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 md:px-6 md:py-20 max-w-4xl">
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to VetKind. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you as to how we look after your personal data when you visit our website.
          </p>
          <h2>2. The data we collect about you</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you.
          </p>
          <h2>3. How we use your personal data</h2>
          <p>
            We will only use your personal data when the law allows us to.
          </p>
        </div>
      </section>
    </div>
  );
}
