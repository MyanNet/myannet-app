import { redirect } from "next/navigation";

// The kyat rates page was retired on Nov 28, 2026; old links go to the home page.
export default function RatesPage() {
  redirect("/");
}
