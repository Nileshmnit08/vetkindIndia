import { auth } from "@/auth";
import { DistributorInquiryForm } from "@/components/forms/DistributorInquiryForm";

export const metadata = {
  title: "Become a Distributor | VetKind",
  description: "Apply to become a VetKind distributor and join our network of veterinary nutrition partners.",
};

export default async function DistributorInquiryPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Become a Distributor
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            Join our growing network of veterinary nutrition partners. Fill out the application below, and our team will review your business profile.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
          <DistributorInquiryForm user={user} />
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Having trouble with the application? Contact our partnership team directly at <a href="mailto:partners@vetkind.in" className="text-green-600 dark:text-green-500 hover:underline">partners@vetkind.in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
