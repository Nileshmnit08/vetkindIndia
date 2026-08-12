import { SpeciesForm } from "@/components/admin/SpeciesForm";

export const metadata = {
  title: "Create Species | Admin",
};

export default function NewSpeciesPage() {
  return (
    <div className="space-y-6">
      <SpeciesForm />
    </div>
  );
}
