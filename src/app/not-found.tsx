import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-shell flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <span className="eyebrow before:hidden">404 · Out of vision</span>
      <h1 className="display-type mt-6 text-7xl font-black uppercase md:text-9xl">This lane is empty.</h1>
      <p className="mt-6 max-w-lg text-mist">The page moved, the link expired, or this route has not been unlocked yet.</p>
      <LinkButton href="/" className="mt-8">Return home</LinkButton>
    </section>
  );
}
