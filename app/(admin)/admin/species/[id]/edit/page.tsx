import { SpeciesForm } from "@/components/admin/SpeciesForm";
import { getSpeciesById } from "@/app/actions/species";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Species | Admin",
};

export default async function EditSpeciesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const species = await getSpeciesById(resolvedParams.id);

  if (!species) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <SpeciesForm initialData={species} />
    </div>
  );
}
