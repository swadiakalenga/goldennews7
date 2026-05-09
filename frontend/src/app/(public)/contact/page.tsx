export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getPublicStaticPage } from "@/lib/api/staticPages";
import ContactForm from "@/components/contact/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicStaticPage("contact");
  return {
    title: page?.seo_title ?? "Contact | GoldenNews7",
    description: page?.seo_description ?? "Contactez la rédaction de GoldenNews7.",
  };
}

export default async function ContactPage() {
  const page = await getPublicStaticPage("contact");

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Contact</span>
        <h1 className="text-4xl font-black text-gray-900 mb-3 font-serif">
          {page?.title ?? "Contactez-nous"}
        </h1>
        <p className="text-gray-600">
          {page?.excerpt ?? "Une question, un témoignage ou un partenariat ? Écrivez-nous."}
        </p>
      </div>

      <ContactForm />
    </div>
  );
}
