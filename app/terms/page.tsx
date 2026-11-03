import { LegalPage } from "@/components/Legal";

export const metadata = { title: "Terms of Use | MyanNet" };

export default function Terms() {
  return (
    <LegalPage title="Terms of Use · အသုံးပြုမှု စည်းမျဉ်း" updated="November 3, 2026">
      <p>By using MyanNet (www.myannet.app) you agree to these terms.</p>

      <h2>Your posts</h2>
      <ul>
        <li>You are responsible for what you post. It must be true, legal, and yours to share.</li>
        <li>No scams, fake jobs, hate speech, threats, adult content, or posts that put anyone in danger.</li>
        <li>New accounts can post up to 5 listings a day. We may remove posts or accounts that break these rules, without notice.</li>
      </ul>

      <h2>Money, jobs and deals</h2>
      <ul>
        <li>MyanNet is a notice board. We do not hold, send or receive money, and we are not part of any deal between users.</li>
        <li>Hundi and other informal transfers carry real risk. Only use agents you know or who are well reviewed, and follow the laws where you live.</li>
        <li>Check every job offer, agency, landlord and seller yourself. Never pay a fee to get a job before you have checked the employer.</li>
      </ul>

      <h2>Reviews and reports</h2>
      <p>Reviews must describe your real experience. Use the Report button for anything unsafe or false; an admin will check it.</p>

      <h2>No guarantee</h2>
      <p>MyanNet is provided as is. We do our best to keep it safe and working, but we cannot guarantee any listing, user or result.</p>

      <h2>အကျဉ်းချုပ်</h2>
      <p>သင်တင်သော ပို့စ်များအတွက် သင်တာဝန်ရှိပါသည်။ လိမ်လည်မှု၊ အလုပ်အတု၊ အမုန်းစကား မတင်ရပါ။ မြန်နက်သည် ငွေကို ကိုင်တွယ်ခြင်း မပြုပါ။ ဟွန်ဒီ၊ အလုပ်နှင့် ရောင်းဝယ်မှုတိုင်းကို ကိုယ်တိုင် စစ်ဆေးပါ။</p>

      <h2>Contact</h2>
      <p><a href="mailto:hello@myannet.app">hello@myannet.app</a></p>
    </LegalPage>
  );
}
