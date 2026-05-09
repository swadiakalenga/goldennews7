import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/ui/BottomNav";
import { getPublicCategories } from "@/lib/api/categories";
import { getSiteSettings } from "@/lib/api/siteSettings";
import { navItems as fallbackNavItems } from "@/data/mock-news";
import type { NavItem } from "@/types";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, settings] = await Promise.all([
    getPublicCategories(),
    getSiteSettings(),
  ]);

  const navItems: NavItem[] =
    categories.length > 0
      ? categories.map((c) => ({ label: c.name, href: `/${c.slug}` }))
      : fallbackNavItems;

  const socials = [
    settings.facebook_url ? { label: "Facebook", href: settings.facebook_url } : null,
    settings.twitter_url ? { label: "Twitter / X", href: settings.twitter_url } : null,
    settings.youtube_url ? { label: "YouTube", href: settings.youtube_url } : null,
    settings.telegram_url ? { label: "Telegram", href: settings.telegram_url } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  const displaySocials =
    socials.length > 0
      ? socials
      : [
          { label: "Facebook", href: "#" },
          { label: "Twitter / X", href: "#" },
          { label: "YouTube", href: "#" },
          { label: "Telegram", href: "#" },
        ];

  return (
    <>
      <TopBar socials={displaySocials} />
      <Header tagline={settings.site_tagline ?? undefined} />
      <Navigation navItems={navItems} />
      <main className="flex-1 pb-14 md:pb-0">{children}</main>
      <Footer navItems={navItems} socials={displaySocials} />
      <BottomNav />
    </>
  );
}
