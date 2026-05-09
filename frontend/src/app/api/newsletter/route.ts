import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json() as { email: string; source?: string };

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email requis." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.toLowerCase().trim(), source: source ?? null });

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation — already subscribed
        return NextResponse.json({ message: "Vous êtes déjà inscrit(e) à la newsletter !" }, { status: 200 });
      }
      return NextResponse.json({ error: "Une erreur est survenue. Réessayez plus tard." }, { status: 500 });
    }

    return NextResponse.json({ message: "Inscription confirmée. Merci !" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
