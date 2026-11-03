import { LegalPage } from "@/components/Legal";

export const metadata = { title: "Privacy Policy | MyanNet" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy · ကိုယ်ရေးလုံခြုံမှုမူဝါဒ" updated="November 3, 2026">
      <p>MyanNet (www.myannet.app) is a community platform for people of Myanmar living anywhere. This page explains what we collect and how we use it.</p>

      <h2>What we collect</h2>
      <ul>
        <li><b>Sign-in details.</b> When you sign in with Facebook, TikTok, Telegram, WhatsApp, phone or email, we receive your name, profile photo and the phone number or email address you use. We do not receive your passwords.</li>
        <li><b>What you post.</b> Listings, contact details you choose to show, comments, star ratings and reports.</li>
        <li><b>Basic technical data.</b> Pages visited and error logs, used to keep the site running.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To show your posts and reviews to other visitors. Contact details you put on a post are public.</li>
        <li>To keep the community safe: limit spam, review reports and remove harmful content.</li>
        <li>To send you a sign-in code or link when you ask for one.</li>
      </ul>
      <p>We do not sell your data. We do not post to your Facebook, TikTok or Telegram account.</p>

      <h2>Who processes it</h2>
      <p>Our service providers store and deliver data for us: Supabase (database and sign-in), Vercel (hosting), Twilio (text and WhatsApp codes), and the sign-in provider you choose (Meta, TikTok, Telegram).</p>

      <h2>Deleting your data</h2>
      <p>You can delete your own posts and reviews at any time from “My listings”. To delete your whole account and everything linked to it, email <a href="mailto:hello@myannet.app">hello@myannet.app</a> from the address or with the phone number you used, and we will delete it within 30 days. This also applies to data received through Facebook Login.</p>

      <h2>ကိုယ်ရေးအချက်အလက် ဖျက်ခြင်း</h2>
      <p>သင့်ပို့စ်နှင့် သုံးသပ်ချက်များကို “ကျွန်ုပ်၏ ပို့စ်များ” မှ အချိန်မရွေး ဖျက်နိုင်ပါသည်။ အကောင့်တစ်ခုလုံး ဖျက်လိုပါက hello@myannet.app သို့ အီးမေးလ်ပို့ပါ။ ရက် ၃၀ အတွင်း ဖျက်ပေးပါမည်။ ကျွန်ုပ်တို့သည် သင့်အချက်အလက်ကို မရောင်းချပါ။</p>

      <h2>Contact</h2>
      <p><a href="mailto:hello@myannet.app">hello@myannet.app</a></p>
    </LegalPage>
  );
}
