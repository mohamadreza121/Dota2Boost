"use client";

import { useEffect, useId, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";
import { coachApplicationSchema, type CoachApplicationInput } from "@/lib/validation/coach-application";

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void; theme: "dark" }) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-3.5 text-sm text-white focus:border-cyan/60 focus:outline-none";

function FieldError({ message }: { message?: string }) {
  return message ? <span className="mt-2 block text-[0.65rem] text-[#ef9a9a]">{message}</span> : null;
}

function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const id = useId().replaceAll(":", "");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  useEffect(() => {
    if (!siteKey) return;
    const element = document.getElementById(id);
    if (!element) return;
    let widgetId: string | undefined;
    const render = () => { if (window.turnstile && !widgetId) widgetId = window.turnstile.render(element, { sitekey: siteKey, callback: onToken, "expired-callback": () => onToken(""), theme: "dark" }); };
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"]');
    if (existing) { if (window.turnstile) render(); else existing.addEventListener("load", render, { once: true }); }
    else { const script = document.createElement("script"); script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; script.async = true; script.defer = true; script.addEventListener("load", render, { once: true }); document.head.appendChild(script); }
    return () => { if (widgetId && window.turnstile) window.turnstile.remove(widgetId); };
  }, [id, onToken, siteKey]);
  if (!siteKey) return null;
  return <div id={id} className="min-h-[65px]" />;
}

export function CoachApplicationForm() {
  const [complete, setComplete] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<CoachApplicationInput>({
    resolver: zodResolver(coachApplicationSchema),
    defaultValues: { sampleCoachingVideoUrl: "", agreement: false }
  });

  async function submit(values: CoachApplicationInput) {
    setServerError(null);
    const response = await fetch("/api/coach-applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const body = (await response.json()) as { error?: string };
    if (!response.ok) { setServerError(body.error ?? "We could not submit your application."); return; }
    setComplete(true);
  }

  if (complete) return <div className="surface rounded-[1.7rem] p-8 text-center"><span className="mx-auto grid size-14 place-items-center rounded-full bg-cyan/10"><CheckCircle2 className="size-6 text-cyan" /></span><h2 className="mt-6 text-2xl font-black">Application received.</h2><p className="mt-3 text-sm leading-6 text-mist">We will review your background and contact you from an official Highground address if we need evidence or an interview.</p></div>;

  return (
    <form onSubmit={handleSubmit(submit)} className="surface rounded-[1.7rem] p-5 sm:p-8" noValidate>
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <label className="text-xs font-bold">Legal name<input className={fieldClass} autoComplete="name" {...register("legalName")} /><FieldError message={errors.legalName?.message} /></label>
        <label className="text-xs font-bold">Public display name<input className={fieldClass} {...register("displayName")} /><FieldError message={errors.displayName?.message} /></label>
        <label className="text-xs font-bold">Email<input className={fieldClass} type="email" autoComplete="email" {...register("email")} /><FieldError message={errors.email?.message} /></label>
        <label className="text-xs font-bold">Country<input className={fieldClass} autoComplete="country-name" {...register("country")} /><FieldError message={errors.country?.message} /></label>
        <label className="text-xs font-bold">Time zone<input className={fieldClass} placeholder="e.g. America/Toronto" {...register("timeZone")} /><FieldError message={errors.timeZone?.message} /></label>
        <label className="text-xs font-bold">Languages<input className={fieldClass} placeholder="English, French" {...register("languages")} /><FieldError message={errors.languages?.message} /></label>
        <label className="text-xs font-bold">Current Dota rank<input className={fieldClass} {...register("currentRank")} /><FieldError message={errors.currentRank?.message} /></label>
        <label className="text-xs font-bold">Peak rank<input className={fieldClass} {...register("peakRank")} /><FieldError message={errors.peakRank?.message} /></label>
        <label className="text-xs font-bold">Main roles<input className={fieldClass} placeholder="Carry, Mid" {...register("mainRoles")} /><FieldError message={errors.mainRoles?.message} /></label>
        <label className="text-xs font-bold">Best heroes<input className={fieldClass} placeholder="Comma-separated" {...register("bestHeroes")} /><FieldError message={errors.bestHeroes?.message} /></label>
        <label className="text-xs font-bold sm:col-span-2">Public gameplay profile URL<input className={fieldClass} type="url" placeholder="https://…" {...register("gameplayProfile")} /><FieldError message={errors.gameplayProfile?.message} /></label>
        <label className="text-xs font-bold sm:col-span-2">Coaching experience<textarea className={`${fieldClass} min-h-28 py-3`} {...register("coachingExperience")} /><FieldError message={errors.coachingExperience?.message} /></label>
        <label className="text-xs font-bold">Weekly availability<textarea className={`${fieldClass} min-h-24 py-3`} placeholder="Days, hours, and time zone" {...register("weeklyAvailability")} /><FieldError message={errors.weeklyAvailability?.message} /></label>
        <label className="text-xs font-bold">Preferred compensation<input className={fieldClass} placeholder="Per session or hourly" {...register("preferredCompensation")} /><FieldError message={errors.preferredCompensation?.message} /></label>
        <label className="text-xs font-bold sm:col-span-2">Short biography<textarea className={`${fieldClass} min-h-32 py-3`} {...register("biography")} /><FieldError message={errors.biography?.message} /></label>
        <label className="text-xs font-bold sm:col-span-2">Sample replay analysis<textarea className={`${fieldClass} min-h-40 py-3`} placeholder="Choose a public match ID and show how you would explain two or three important patterns." {...register("sampleReplayAnalysis")} /><FieldError message={errors.sampleReplayAnalysis?.message} /></label>
        <label className="text-xs font-bold sm:col-span-2">Sample coaching video URL <span className="font-normal text-mist">(optional)</span><input className={fieldClass} type="url" placeholder="Private unlisted link" {...register("sampleCoachingVideoUrl")} /><FieldError message={errors.sampleCoachingVideoUrl?.message} /></label>
        <label className="text-xs font-bold sm:col-span-2">Why do you want to join?<textarea className={`${fieldClass} min-h-28 py-3`} {...register("whyJoin")} /><FieldError message={errors.whyJoin?.message} /></label>
      </div>
      <label className="mt-6 flex items-start gap-3 rounded-xl border border-white/[0.09] bg-black/15 p-4 text-xs leading-5 text-mist"><input className="mt-1 accent-[#d25353]" type="checkbox" {...register("agreement")} />I confirm that the information is accurate, I will never request customer account credentials, and I agree to the application and communication standards.</label><FieldError message={errors.agreement?.message} />
      <div className="mt-5"><Turnstile onToken={(token) => setValue("turnstileToken", token, { shouldValidate: true })} /></div>
      {serverError ? <p role="alert" className="mt-5 rounded-xl border border-crimson/20 bg-crimson/[0.08] p-3 text-xs text-[#ef9a9a]">{serverError}</p> : null}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="flex max-w-md items-start gap-2 text-[0.65rem] leading-5 text-mist"><ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-cyan" />Application details are private and visible only to authorized reviewers.</p><button disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-crimson px-7 text-sm font-bold disabled:opacity-50">{isSubmitting ? <><LoaderCircle className="size-4 animate-spin" />Submitting</> : "Submit application"}</button></div>
    </form>
  );
}
