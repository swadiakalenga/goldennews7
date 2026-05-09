import type { Metadata } from "next";
import AuthorForm from "@/components/admin/AuthorForm";

export const metadata: Metadata = { title: "Nouvel auteur — Admin" };

export default function NewAuthorPage() {
  return <AuthorForm />;
}
