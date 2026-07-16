import { permanentRedirect } from "next/navigation";

export default function LegacyCoachesPage() {
  permanentRedirect("/boosters");
}
