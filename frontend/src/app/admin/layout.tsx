import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ToastProvider } from "@/components/admin/ToastProvider";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: {
    default: "GoldenNews7 CMS",
    template: "%s | GoldenNews7 CMS",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware handles the primary auth redirect; this is a safety net for
  // server-rendered access to the admin shell.
  if (!user) redirect("/admin/login");

  const profileResult = (await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single()) as unknown as { data: { full_name: string | null; role: string } | null };
  const profile = profileResult.data;

  if (!profile || profile.role !== "admin") redirect("/admin/login?error=unauthorized");

  const adminUser = {
    id: user.id,
    email: user.email ?? "",
    name: profile.full_name,
  };

  return (
    <ToastProvider>
      <AdminShell user={adminUser}>{children}</AdminShell>
    </ToastProvider>
  );
}
