// "Today", "Yesterday", "3 days ago", "Last week"… in English or Burmese.
const MMD = "၀၁၂၃၄၅၆၇၈၉";
const mmNum = (n: number) => String(n).replace(/\d/g, (d) => MMD[+d]);
export function ago(iso: string, lang: string = "en"): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 864e5);
  const mm = lang === "mm";
  if (days <= 0) return mm ? "ယနေ့" : "Today";
  if (days === 1) return mm ? "မနေ့က" : "Yesterday";
  if (days < 7) return mm ? `${mmNum(days)} ရက်က` : `${days} days ago`;
  if (days < 14) return mm ? "ပြီးခဲ့သည့်အပတ်" : "Last week";
  if (days < 31) return mm ? `${mmNum(Math.floor(days / 7))} ပတ်က` : `${Math.floor(days / 7)} weeks ago`;
  return new Date(iso).toLocaleDateString(mm ? "my-MM" : "en-US", { month: "short", day: "numeric" });
}
export const isNew = (iso: string) => Date.now() - new Date(iso).getTime() < 7 * 864e5;
