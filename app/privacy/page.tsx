import { LegalPage } from "@/components/Legal";

export const metadata = { title: "Privacy Policy | MyanNet" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy · ကိုယ်ရေးလုံခြုံမှုမူဝါဒ" updated="November 19, 2026">
      <p>MyanNet (www.myannet.app) is a community platform for people of Myanmar living anywhere. This page explains what we collect and how we use it.</p>

      <h2>What we collect</h2>
      <ul>
        <li><b>Sign-in details.</b> When you sign in with Google, Facebook or another method we offer, we receive your name, profile photo and the phone number or email address you use. We do not receive your passwords.</li>
        <li><b>What you post.</b> Listings, contact details you choose to show, comments, star ratings and reports.</li>
        <li><b>Visit counts.</b> Which sections are opened, the country and city a visit comes from (worked out by our host from the connection, not stored as an IP address), the site that linked to us (for example Facebook), and whether it is a phone or computer. A random number kept in your browser lets us count unique visitors; it is not linked to your name. We use this only to see how MyanNet is used and where to improve it.</li>
        <li><b>Basic technical data.</b> Error logs, used to keep the site running.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To show your posts and reviews to other visitors. Contact details you put on a post are public.</li>
        <li>To keep the community safe: limit spam, review reports and remove harmful content.</li>
        <li>To send you a sign-in code or link when you ask for one.</li>
      </ul>
      <p>We do not sell your data. We do not post to your Facebook, TikTok or Telegram account.</p>

      <h2>Who processes it</h2>
      <p>Our service providers store and deliver data for us: Supabase (database and sign-in), Vercel (hosting), and the sign-in provider you choose (Google or Meta).</p>

      <h2>Deleting your data</h2>
      <p>You can delete your own posts and reviews at any time from “My listings”. To delete your whole account and everything linked to it, email <a href="mailto:hello@myannet.app">hello@myannet.app</a> from the address or with the phone number you used, and we will delete it within 30 days. This also applies to data received through Facebook Login.</p>

      <h2>ကိုယ်ရေးအချက်အလက် ဖျက်ခြင်း</h2>
      <p>သင့်ပို့စ်နှင့် သုံးသပ်ချက်များကို “ကျွန်ုပ်၏ ပို့စ်များ” မှ အချိန်မရွေး ဖျက်နိုင်ပါသည်။ အကောင့်တစ်ခုလုံး ဖျက်လိုပါက hello@myannet.app သို့ အီးမေးလ်ပို့ပါ။ ရက် ၃၀ အတွင်း ဖျက်ပေးပါမည်။ ကျွန်ုပ်တို့သည် သင့်အချက်အလက်ကို မရောင်းချပါ။</p>

      <h2>Contact</h2>
      <p><a href="mailto:hello@myannet.app">hello@myannet.app</a></p>
    </LegalPage>
  );
}
