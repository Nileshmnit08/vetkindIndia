import { Leaf, ShieldCheck, Target, Users, MapPin, Beaker } from "lucide-react";

export const metadata = {
  title: "About Us | VetKind",
  description: "Learn about VetKind's mission, vision, and philosophy for advancing animal health through science-backed nutrition.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-green-900 py-24 text-white md:py-32">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center md:px-6 max-w-4xl">
          <span className="mb-4 inline-block rounded-full bg-green-800/50 px-4 py-1.5 text-sm font-bold tracking-wider text-green-300 border border-green-700">
            OUR STORY
          </span>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Advancing Animal Health with <span className="text-green-300">Integrity & Science</span>
          </h1>
          <p className="mx-auto text-xl text-green-100 max-w-2xl leading-relaxed">
            Based in Jaipur, Rajasthan, VetKind formulates science-backed veterinary nutrition and phytogenic solutions. We serve dairy, poultry, and small ruminant farms across India, delivering field-tested products that enhance both animal health and farm productivity.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center rounded-3xl bg-white p-10 shadow-xl shadow-zinc-200/50 dark:bg-zinc-900 dark:shadow-none border border-zinc-100 dark:border-zinc-800 transition-transform hover:-translate-y-1 duration-300">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <Target className="h-8 w-8" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">Our Mission</h2>
            <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              To empower Indian farmers and veterinarians with premium, science-backed nutritional solutions that sustainably improve animal welfare, optimize performance, and drive tangible farm profitability.
            </p>
          </div>
          
          <div className="flex flex-col justify-center rounded-3xl bg-zinc-900 p-10 text-white shadow-xl shadow-zinc-200/50 dark:bg-zinc-800 dark:shadow-none border border-zinc-800 dark:border-zinc-700 transition-transform hover:-translate-y-1 duration-300">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-300 dark:bg-zinc-700">
              <Users className="h-8 w-8" />
            </div>
            <h2 className="mb-4 text-3xl font-bold">Our Vision</h2>
            <p className="text-lg leading-relaxed text-zinc-300">
              To be India&apos;s most trusted veterinary nutrition brand, recognized for uncompromising integrity, rigorous research, and practical field impact across every major livestock production system.
            </p>
          </div>
        </div>
      </section>

      {/* Why VetKind */}
      <section className="bg-zinc-100 py-16 dark:bg-zinc-900/50 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Why Choose VetKind?
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              The principles that drive our formulation and manufacturing processes.
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Uncompromising Quality",
                desc: "Every batch is rigorously tested at our manufacturing facilities and partner laboratories to ensure absolute purity and potency."
              },
              {
                icon: Leaf,
                title: "Science-Backed Phytogenics",
                desc: "We blend traditional herbal knowledge with modern veterinary science to create highly bioavailable, natural solutions."
              },
              {
                icon: Users,
                title: "Farmer-Centric Approach",
                desc: "Our products are designed not just for animal health, but to provide a tangible return on investment for the farmer."
              }
            ].map((feature, idx) => (
              <div key={idx} className="rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <feature.icon className="mb-6 h-10 w-10 text-green-600 dark:text-green-500" />
                <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership / Philosophy */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-green-900 flex items-center justify-center p-8 shadow-2xl">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-800/40 via-transparent to-transparent" />
             <div className="relative z-10 flex flex-col items-center text-center">
               <div className="flex gap-4 mb-8">
                 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm text-green-300">
                   <Leaf className="h-8 w-8" />
                 </div>
                 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm text-green-300">
                   <Beaker className="h-8 w-8" />
                 </div>
               </div>
               <h3 className="text-3xl font-bold text-white mb-4">Jaipur R&D Centre</h3>
               <p className="text-green-100 max-w-sm flex items-center justify-center gap-2">
                 <MapPin className="h-5 w-5 shrink-0" /> Formulated in Rajasthan, Proven across India.
               </p>
             </div>
          </div>
          
          <div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Our Philosophy
            </h2>
            <div className="prose prose-lg text-zinc-700 dark:text-zinc-300">
              <p className="mb-4">
                At VetKind, we believe that true animal health starts from the ground up. It requires a holistic understanding of nutrition, environment, and everyday farm management practices.
              </p>
              <p className="mb-4">
                We source only the highest quality raw materials and standardized phytogenic extracts, ensuring complete traceability and consistent potency in every batch formulated at our facilities.
              </p>
              <p>
                Backed by a pan-India network of experienced veterinarians and nutritionists, we bridge the gap between advanced laboratory science and practical, on-farm realities to deliver solutions that farmers can rely on.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
