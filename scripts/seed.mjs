import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding.");

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const password = process.env.SEED_USER_PASSWORD ?? "Highground-local-2026!";

async function allUsers() {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  return data.users;
}

async function ensureUser(email, displayName, role) {
  let user = (await allUsers()).find((candidate) => candidate.email === email);
  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { display_name: displayName } });
    if (error || !data.user) throw error ?? new Error(`Could not create ${email}`);
    user = data.user;
  }
  const { error } = await supabase.from("profiles").update({ display_name: displayName, role, status: "active" }).eq("id", user.id);
  if (error) throw error;
  return user;
}

async function ensureOrder({ seedKey, customerId, serviceSlug, total, status, coachId, adminId }) {
  const { data: existing, error: existingError } = await supabase.from("orders").select("id, status").contains("requirements", { seed_key: seedKey }).maybeSingle();
  if (existingError) throw existingError;
  if (existing) return existing.id;
  const requirements = { seed_key: seedKey, service: serviceSlug, currentRank: "Legend", targetGoal: "Improve decision making", role: "Carry", region: "North America", language: "English", sessionCount: 2, sessionDuration: "60", replayCount: 1, coachTier: "Master", priority: "Standard", teamSize: 1, preferredHeroes: [] };
  const { data: orderId, error } = await supabase.rpc("create_pending_order", { p_customer_id: customerId, p_service_slug: serviceSlug, p_requirements: requirements, p_subtotal: total, p_discount: 0, p_total: total, p_currency: "cad" });
  if (error) throw error;
  if (status === "payment_pending") return orderId;
  const checkoutId = `cs_seed_${seedKey}`;
  const intentId = `pi_seed_${seedKey}`;
  const { error: paymentError } = await supabase.from("payments").insert({ order_id: orderId, customer_id: customerId, checkout_session_id: checkoutId, currency: "cad", gross_amount: total, status: "pending" });
  if (paymentError) throw paymentError;
  const { error: finalizeError } = await supabase.rpc("finalize_paid_order", { p_order_id: orderId, p_checkout_session_id: checkoutId, p_payment_intent_id: intentId, p_amount_total: total });
  if (finalizeError) throw finalizeError;
  const { error: assignmentError } = await supabase.from("order_assignments").insert({ order_id: orderId, coach_id: coachId, status: status === "completed" ? "completed" : "accepted", compensation_amount: Math.round(total * 0.7), assigned_by: adminId, accepted_at: new Date().toISOString(), ended_at: status === "completed" ? new Date().toISOString() : null });
  if (assignmentError) throw assignmentError;
  const { error: orderError } = await supabase.from("orders").update({ status, completed_at: status === "completed" ? new Date().toISOString() : null }).eq("id", orderId);
  if (orderError) throw orderError;
  return orderId;
}

const owner = await ensureUser("owner@highground.local", "Platform Owner", "owner");
const admin = await ensureUser("admin@highground.local", "Operations Admin", "admin");
const support = await ensureUser("support@highground.local", "Customer Support", "support");
const northstar = await ensureUser("northstar@highground.local", "Northstar", "coach");
const lantern = await ensureUser("lantern@highground.local", "Lantern", "coach");
const customerOne = await ensureUser("customer.one@highground.local", "Reza", "customer");
const customerTwo = await ensureUser("customer.two@highground.local", "Ari", "customer");

for (const coach of [
  { id: northstar.id, slug: "northstar-seed", current_rank: "Immortal 1,420", peak_rank: "Immortal 780", biography: "A calm, systems-first coach who turns difficult matches into a short list of repeatable decisions players can practice.", coaching_style: "Direct, analytical, and encouraging, using questions before targeted correction.", region: "North America", languages: ["English", "French"], roles: ["Carry", "Mid"], hero_specialties: ["Tempo", "Laning"], time_zone: "America/Toronto", tier: "Elite", starting_price: 7900 },
  { id: lantern.id, slug: "lantern-seed", current_rank: "Immortal 3,410", peak_rank: "Immortal 1,890", biography: "A structured support specialist who helps players measure impact through better lanes, information, and fight preparation.", coaching_style: "Patient and structured, emphasizing decision triggers rather than rigid rules.", region: "Southeast Asia", languages: ["English", "Mandarin"], roles: ["Hard Support", "Soft Support"], hero_specialties: ["Vision", "Shotcalling"], time_zone: "Asia/Singapore", tier: "Pro", starting_price: 5900 }
]) {
  const { id, ...profile } = coach;
  const { error } = await supabase.from("coach_profiles").upsert({ profile_id: id, ...profile, verification_status: "verified", is_public: true }, { onConflict: "profile_id" });
  if (error) throw error;
}

const activeOrder = await ensureOrder({ seedKey: "active-coaching", customerId: customerOne.id, serviceSlug: "live-coaching", total: 17000, status: "in_progress", coachId: northstar.id, adminId: admin.id });
const completedOrder = await ensureOrder({ seedKey: "completed-replay", customerId: customerTwo.id, serviceSlug: "replay-analysis", total: 4500, status: "completed", coachId: lantern.id, adminId: admin.id });
await ensureOrder({ seedKey: "unpaid-plan", customerId: customerOne.id, serviceSlug: "role-mastery", total: 18900, status: "payment_pending", coachId: northstar.id, adminId: admin.id });

const { data: conversation } = await supabase.from("conversations").select("id").eq("order_id", activeOrder).single();
if (conversation) {
  const messages = [
    { client_id: "10000000-0000-4000-8000-000000000001", conversation_id: conversation.id, sender_id: northstar.id, kind: "text", body: "I reviewed the first match ID. The main opportunity is how early you commit the farming route." },
    { client_id: "10000000-0000-4000-8000-000000000002", conversation_id: conversation.id, sender_id: customerOne.id, kind: "text", body: "Should I tag the moment I decide the route, or when I realize it is unsafe?" },
    { client_id: "10000000-0000-4000-8000-000000000003", conversation_id: conversation.id, sender_id: northstar.id, kind: "audio", body: null }
  ];
  for (const message of messages) {
    const { data: existing } = await supabase.from("messages").select("id").eq("sender_id", message.sender_id).eq("client_id", message.client_id).maybeSingle();
    if (!existing) {
      const { data: inserted, error } = await supabase.from("messages").insert(message).select("id").single();
      if (error) throw error;
      if (message.kind === "audio") await supabase.from("message_attachments").insert({ message_id: inserted.id, storage_path: `${conversation.id}/${northstar.id}/seed-voice.webm`, original_name: "coach-note.webm", mime_type: "audio/webm", extension: "webm", size_bytes: 182400, duration_seconds: 34, scan_status: "clean" });
    }
  }
}

const { data: activeSession } = await supabase.from("sessions").select("id").eq("order_id", activeOrder).maybeSingle();
if (!activeSession) await supabase.from("sessions").insert({ order_id: activeOrder, coach_id: northstar.id, customer_id: customerOne.id, status: "confirmed", starts_at: new Date(Date.now() + 86400000).toISOString(), ends_at: new Date(Date.now() + 90000000).toISOString(), customer_time_zone: "America/Toronto", coach_time_zone: "America/Toronto", meeting_provider: "discord", created_by: northstar.id });

const { data: review } = await supabase.from("reviews").select("id").eq("order_id", completedOrder).maybeSingle();
if (!review) await supabase.from("reviews").insert({ order_id: completedOrder, customer_id: customerTwo.id, coach_id: lantern.id, rating: 5, feedback: "The review separated isolated mistakes from the positioning pattern that kept repeating.", service_type: "Replay Analysis", rank_before: "Ancient", role: "Hard Support", is_public: true });

const { data: application } = await supabase.from("coach_applications").select("id").eq("email", "candidate@highground.local").maybeSingle();
if (!application) await supabase.from("coach_applications").insert({ legal_name: "Development Candidate", display_name: "Orion", email: "candidate@highground.local", country: "Canada", time_zone: "America/Vancouver", languages: ["English"], current_rank: "Immortal 1,760", peak_rank: "Immortal 920", main_roles: ["Offlane"], best_heroes: ["Public seed specialty"], public_gameplay_profile: "https://example.com/public-profile", coaching_experience: "Synthetic development application used to exercise the administrator review queue.", weekly_availability: "Weekday evenings", preferred_compensation: "Per session", biography: "Synthetic seed biography with enough detail to exercise the private application review experience safely.", sample_replay_analysis: "Synthetic sample analysis that identifies an information gap, explains the decision trigger, and proposes a repeatable practice goal for development testing.", why_join: "Synthetic motivation statement used only for local development and administrator workflow testing.", agreement_accepted_at: new Date().toISOString(), status: "under_review" });

console.log("Highground seed complete.");
console.log(`Local password for seeded users: ${password}`);
console.log(`Owner: ${owner.email} · Admin: ${admin.email} · Support: ${support.email}`);
