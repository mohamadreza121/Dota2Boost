import { permanentRedirect } from "next/navigation";

interface Props { params: Promise<{ slug: string }> }

export default async function LegacyCoachProfilePage({ params }: Props) {
  const { slug } = await params;
  permanentRedirect(`/boosters/${slug}`);
}
