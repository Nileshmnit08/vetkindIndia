import { ArrowDown, Package, FlaskConical, Beaker, Factory, ShieldCheck, CheckCircle2, Truck } from "lucide-react";

export const metadata = {
  title: "Manufacturing | VetKind",
  description: "Explore the step-by-step manufacturing and production process at VetKind facilities.",
};

export default function ManufacturingPage() {
  const steps = [
    {
      id: "raw-materials",
      title: "Raw Material Sourcing & Quarantine",
      desc: "Incoming botanical extracts, minerals, and vitamins are held in quarantine upon arrival.",
      icon: Package,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
    },
    {
      id: "testing",
      title: "Analytical Testing",
      desc: "Samples are sent to Ridhi Sidhi Laboratories for comprehensive purity, heavy metal, and microbial testing.",
      icon: FlaskConical,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
    },
    {
      id: "formulation",
      title: "Precision Formulation",
      desc: "Approved ingredients are weighed and blended according to precise, research-backed master formulas.",
      icon: Beaker,
      color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
    },
    {
      id: "manufacturing",
      title: "Manufacturing & Processing",
      desc: "Processing through state-of-the-art closed-loop systems to prevent cross-contamination.",
      icon: Factory,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
    },
    {
      id: "quality-control",
      title: "In-Process Quality Control",
      desc: "Continuous monitoring of mixing homogeneity, particle size, and stability.",
      icon: ShieldCheck,
      color: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    },
    {
      id: "finished-product",
      title: "Finished Product Testing & Packaging",
      desc: "Final assay testing. Approved batches are securely packaged to protect against environmental degradation.",
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
    },
    {
      id: "dispatch",
      title: "Dispatch & Distribution",
      desc: "Products are stored in climate-controlled warehousing before dispatch to our distribution network.",
      icon: Truck,
      color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950">
      
      {/* Hero Section */}
      <section className="bg-zinc-900 py-20 text-white md:py-32">
        <div className="container mx-auto px-4 text-center md:px-6 max-w-4xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-300 border border-zinc-700">
            <Factory className="h-8 w-8" />
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            State-of-the-Art <span className="text-green-400">Manufacturing</span>
          </h1>
          <p className="mx-auto text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Take a transparent look at how a VetKind product moves from raw botanical and mineral inputs to a finished, commercial-grade veterinary solution.
          </p>
        </div>
      </section>

      {/* Vertical Timeline Flowchart */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24 max-w-3xl">
        <div className="relative">
          {/* Continuous Line */}
          <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-zinc-200 dark:bg-zinc-800 md:left-1/2 md:-ml-[1px]" />
          
          <div className="space-y-12">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={step.id} className="relative flex flex-col md:flex-row items-start md:items-center">
                  
                  {/* Left Side (Empty on mobile, alternating on desktop) */}
                  <div className={`hidden md:block md:w-1/2 pr-12 text-right ${isEven ? '' : 'md:opacity-0'}`}>
                    {isEven && (
                      <div className="animate-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{step.title}</h3>
                        <p className="text-zinc-600 dark:text-zinc-400">{step.desc}</p>
                      </div>
                    )}
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-0 md:left-1/2 md:-ml-8 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white shadow-md dark:border-zinc-950 dark:bg-zinc-900 z-10">
                     <div className={`flex h-12 w-12 items-center justify-center rounded-full ${step.color}`}>
                       <step.icon className="h-6 w-6" />
                     </div>
                  </div>

                  {/* Right Side / Mobile View */}
                  <div className={`pl-20 md:w-1/2 md:pl-12 text-left ${!isEven ? '' : 'md:hidden'}`}>
                    <div className="animate-in slide-in-from-left-4 duration-500">
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{step.title}</h3>
                      <p className="text-zinc-600 dark:text-zinc-400">{step.desc}</p>
                    </div>
                  </div>

                  {/* Connecting Arrow (except last item) */}
                  {idx < steps.length - 1 && (
                    <div className="absolute left-8 top-16 md:left-1/2 md:-ml-3.5 mt-2 h-10 flex items-center justify-center">
                      <ArrowDown className="h-6 w-6 text-zinc-300 dark:text-zinc-700 bg-zinc-50 dark:bg-zinc-950 z-20" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="border-t border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="container mx-auto px-4 text-center md:px-6">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">Learn More About Our Quality Controls</h2>
          <p className="mb-8 text-zinc-600 dark:text-zinc-400">Discover the laboratory testing that ensures every step of this process is flawless.</p>
          <a href="/quality" className="inline-flex rounded-full bg-zinc-900 px-8 py-3.5 font-bold text-white shadow-md transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white">
            View Quality Assurance
          </a>
        </div>
      </section>

    </div>
  );
}
