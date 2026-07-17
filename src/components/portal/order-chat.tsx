"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

type Message = { id: string; client_id: string | null; sender_id: string | null; body: string; kind: string; created_at: string };
const demo: Message[] = [
  { id: "demo-1", client_id: null, sender_id: "specialist", body: "Your order workspace is ready. Confirm your queue window here and we will keep every update in one place.", kind: "text", created_at: new Date().toISOString() }
];

function time(value: string) {
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export function OrderChat({ conversationId, currentUserId }: { conversationId: string | null; currentUserId: string }) {
  const [messages, setMessages] = useState<Message[]>(conversationId ? [] : demo);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(Boolean(conversationId));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) return;
    let active = true;
    async function load() {
      try {
        const response = await fetch(`/api/conversations/${conversationId}/messages`);
        const payload = await response.json() as { messages?: Message[]; error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Messages could not be loaded.");
        if (active) setMessages(payload.messages ?? []);
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Messages could not be loaded.");
      } finally { if (active) setLoading(false); }
    }
    void load();
    const channel = createClient().channel(`order-messages:${conversationId}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` }, (payload) => {
      const next = payload.new as Message;
      setMessages((current) => current.some((message) => message.id === next.id || (next.client_id && message.client_id === next.client_id)) ? current : [...current, next]);
    }).subscribe();
    return () => { active = false; void createClient().removeChannel(channel); };
  }, [conversationId]);

  async function sendMessage() {
    const clean = body.trim();
    if (!clean || !conversationId || sending) return;
    const clientId = crypto.randomUUID();
    const optimistic: Message = { id: `optimistic-${clientId}`, client_id: clientId, sender_id: currentUserId, body: clean, kind: "text", created_at: new Date().toISOString() };
    setMessages((current) => [...current, optimistic]); setBody(""); setSending(true); setError(null);
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body: clean, clientId }) });
      const payload = await response.json() as { message?: Message; error?: string };
      if (!response.ok || !payload.message) throw new Error(payload.error ?? "Message could not be sent.");
      setMessages((current) => current.map((message) => message.client_id === clientId ? payload.message! : message));
    } catch (cause) {
      setMessages((current) => current.filter((message) => message.client_id !== clientId));
      setBody(clean); setError(cause instanceof Error ? cause.message : "Message could not be sent.");
    } finally { setSending(false); }
  }

  const unavailable = !conversationId;
  return <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black/15"><header className="flex items-center justify-between border-b border-white/[0.08] p-4"><div><p className="text-sm font-bold">Order chat</p><p className="mt-0.5 text-[0.58rem] text-cyan">Private, order-scoped messages</p></div><span className="rounded-full border border-cyan/20 px-3 py-1.5 text-[0.6rem] font-bold text-cyan">Live</span></header>
    <div aria-live="polite" className="h-[360px] space-y-4 overflow-y-auto p-4 sm:p-5">{loading ? <div className="grid h-full place-items-center"><LoaderCircle className="size-5 animate-spin text-cyan" /></div> : messages.length ? messages.map((message) => { const mine = message.sender_id === currentUserId; return <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${mine ? "rounded-br-sm bg-crimson/85 text-white" : "rounded-tl-sm bg-white/[0.07] text-[#d6dad7]"}`}><p>{message.body}</p><p className={`mt-1 text-right text-[0.55rem] ${mine ? "text-white/60" : "text-mist"}`}>{time(message.created_at)}</p></div></div>; }) : <div className="grid h-full place-items-center text-center text-xs text-mist">No messages yet. Start the delivery conversation here.</div>}</div>
    <footer className="border-t border-white/[0.08] p-3"><div className="flex items-end gap-2"><label className="sr-only" htmlFor="message-body">Message</label><textarea id="message-body" rows={1} value={body} disabled={unavailable || sending} onChange={(event) => setBody(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} placeholder={unavailable ? "Chat opens when the paid order workspace is ready." : "Write a message…"} className="min-h-10 flex-1 resize-none rounded-xl border border-white/10 bg-panel px-3 py-2.5 text-sm focus:border-cyan/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" /><button onClick={() => void sendMessage()} disabled={unavailable || sending || !body.trim()} aria-label="Send message" className="grid size-10 shrink-0 place-items-center rounded-full bg-crimson disabled:cursor-not-allowed disabled:opacity-45">{sending ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}</button></div>{error ? <p role="alert" className="mt-2 text-[0.65rem] text-[#ef9a9a]">{error}</p> : <p className="mt-2 px-2 text-[0.56rem] text-[#666e6b]">Messages are stored with your order and update in real time for members of this workspace.</p>}</footer>
  </section>;
}
