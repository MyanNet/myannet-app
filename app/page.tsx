// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { AppCtx } from "@/lib/ctx";
import { LIVE } from "@/lib/supabase";
import { S } from "@/lib/i18n";
import * as store from "@/lib/store";
import Login from "@/components/Login";
import PostFlow from "@/components/PostFlow";
import { ReviewBar } from "@/components/Reviews";
import { CommunityListings, MyListings } from "@/components/Listings";
import { THEME } from "@/components/ui";

const T = {
  en: {
    appName:"MyanNet", appSub:"မြန်နက် · All-in-one services, anywhere, for the people of Myanmar", beta:"BETA",
    tagline:"The all-in-one platform for Burmese/Myanmar communities worldwide — find work, send money home, rent a room, ship goods, and buy & sell within a trusted community.",
    vision:"Connecting Myanmar Communities working/living abroad to their loved ones living locally, and vice versa.",
    visionTitle:"🌏 Our Vision", whoTitle:"Who MyanNet Serves",
    pillars:["Help Wanted","Hundi / Send Money","Rent","Cargo / Hand Carry","2nd Hand Goods","Businesses"],
    pillarIcons:["💼","💸","🏠","✈️","🛍️","🏪"],
    pillarDesc:["Find work or post openings across all countries","Send money home through trusted community agents","Find or offer housing in the Burmese community","Hand-carry goods between countries — trusted travelers","Buy & sell within the trusted Burmese community","Find Burmese-owned businesses, shops & services"],
    who:[{e:"🍣",t:"Burmese Sushi Workers",d:"In US restaurants, grocery stores & catering"},{e:"🏭",t:"Factory & Construction Workers",d:"In Thailand, Malaysia, Korea & Japan"},{e:"🏪",t:"Small Business Owners",d:"Restaurants, shops & services in diaspora"},{e:"✈️",t:"New Arrivals",d:"Need housing, work & community fast"},{e:"💰",t:"Families Back Home",d:"Receiving remittances from abroad"},{e:"🌏",t:"Cross-Border Travelers",d:"Hand-carrying goods between countries"}],
    findWork:"Find Work", hireWorkers:"Hire Workers", allPosts:"All", jobsAvail:"🏪 Jobs Available", seekWork:"👷 Seeking Work",
    allRooms:"All", roomsAvail:"🏠 Available", seekRoom:"🔍 Seeking",
    allCargo:"All", canCarry:"✈️ Can Carry", needCarry:"📦 Need Carry",
    postJob:"Post Job", postAgent:"Register as Agent", postRental:"Post Rental", postCarry:"Post Carry Offer", postItem:"Post Item",
    contactFb:"💬 Contact on Facebook", contactViber:"📱 WhatsApp / Viber", msgSeller:"💬 Message Seller",
    hundiNotice:"⚠️ Community Notice: Hundi is an informal trust-based transfer system widely used by Myanmar migrants. Agents are community-verified. Always use known, reviewed agents. MyanNet does not handle funds directly.",
    cargoNotice:"✈️ Hand Carry Network: Travelers with spare baggage space offer to carry goods between countries. Always meet in person. Community trust is everything.",
    rateCalc:"💱 Quick Rate Calculator", from:"From", amount:"Amount", communityAgents:"🤝 Community Agents",
    verified:"✅ Verified", pending:"⏳ Pending", reviews:"reviews", rate:"Rate", fee:"Fee", dailyLimit:"Daily Limit",
    urgent:"🔥 Urgent", burmeseHouse:"🇲🇲 Burmese House", jobAvail:"🏪 Job Available", seekingWork:"👷 Seeking Work",
    available:"🏠 Available", seeking:"🔍 Seeking", canCarryTag:"✈️ Can Carry", needCarryTag:"📦 Need Carry", budget:"Budget",
    send:"You send", receive:"MMK received*", logIn:"Log In", logOut:"Log Out", myProfile:"My Profile", myListings:"My Listings", settings:"Settings",
    registerInterest:"Register Interest", beFirst:"Be the First to Know", registerDesc:"Register your interest and get notified about new jobs, agents, listings and updates on myannet.app",
    joinFb:"Follow MyanNet on Facebook", comingSoon:"Full posting system coming soon! For now, join our Facebook group:",
    goFb:"🌐 Go to Facebook Group", close:"Close", services:"Services", countries:"Countries", contact:"Contact & Community", privacy:"Privacy Policy", terms:"Terms of Use", about:"About",
    signIn:"Sign in to your account", continueWithFb:"Continue with Facebook", or:"or", phone:"Phone Number", sendOTP:"Send OTP Code", verifyCode:"Verify Code", changePhone:"Change phone number", emailAddr:"Email Address", password:"Password", signingIn:"Signing in…", sending:"Sending…", verifying:"Verifying…", connecting:"Connecting…",
    iAm:"I am a…", worker:"👷 Worker / Job Seeker", business:"🏪 Business Owner", hundiAgent:"💸 Hundi Agent", other:"🌏 Other", country:"Country", registerNow:"Register Now", noSpam:"We never share your info. No spam, ever.",
    registered:"You're registered!", thankyou:"Thank you for joining MyanNet. We'll be in touch soon with updates!", bySigningIn:"By signing in, you agree to our Terms of Use and Privacy Policy",
  },
  mm: {
    appName:"မြန်နက်", appSub:"MyanNet · မည်သည့်နေရာမဆို မြန်မာပြည်သူများအတွက် စုံလင်သော ဝန်ဆောင်မှု", beta:"ဘီတာ",
    tagline:"ကမ္ဘာတစ်ဝှမ်းရှိ မြန်မာ/ဗမာ လူ့အဖွဲ့အစည်းများအတွက် စုံလင်သောပလက်ဖောင်း — အလုပ်ရှာ၊ အိမ်သို့ငွေလွှဲ၊ အခန်းငှား၊ ကုန်ပို့နှင့် ယုံကြည်ရသောအသိုင်းအဝိုင်းအတွင်း ဝယ်ရောင်းနိုင်သည်။",
    vision:"နိုင်ငံခြားတွင် အလုပ်လုပ်/နေထိုင်နေသော မြန်မာများနှင့် ဒေသတွင်းရှိ ချစ်ခင်ရသူများကို ချိတ်ဆက်ပေးသည် — နှစ်ဦးနှစ်ဖက်စလုံးအတွက်။",
    visionTitle:"🌏 ကျွန်ုပ်တို့၏ မျှော်မှန်းချက်", whoTitle:"မြန်နက် မည်သူများအတွက်",
    pillars:["အလုပ်အကိုင်","ဟွန်ဒီ / ငွေလွှဲ","အိမ်ငှား","ကုန်တင်ဆောင်","အသုံးချပစ္စည်း","လုပ်ငန်းများ"],
    pillarIcons:["💼","💸","🏠","✈️","🛍️","🏪"],
    pillarDesc:["နိုင်ငံအားလုံးတွင် အလုပ်ရှာဖွေ သို့မဟုတ် ဖော်ပြရန်","ယုံကြည်ရသော ကိုယ်စားလှယ်များမှတစ်ဆင့် ငွေလွှဲပေးပို့ရန်","မြန်မာ့လူ့အဖွဲ့အစည်းအတွင်း အိမ်ရှာဖွေ သို့မဟုတ် ငှားရမ်းရန်","နိုင်ငံများကြားတွင် ကိုယ်ထည်ဆောင်ပေးသောဝန်ဆောင်မှု","ယုံကြည်ရသောအသိုင်းအဝိုင်းအတွင်း ဝယ်ရောင်းရန်","မြန်မာလုပ်ငန်းများ၊ ဆိုင်များနှင့် ဝန်ဆောင်မှုများ ရှာဖွေရန်"],
    who:[{e:"🍣",t:"ဆူရှီ အလုပ်သမားများ",d:"အမေရိကန်ရှိ စားသောက်ဆိုင်နှင့် ကြယ်မှတ်ဆိုင်များတွင်"},{e:"🏭",t:"စက်ရုံနှင့် ဆောက်လုပ်ရေး",d:"ထိုင်း၊ မလေးရှား၊ ကိုရီးယား၊ ဂျပန်တွင်"},{e:"🏪",t:"လုပ်ငန်းရှင်များ",d:"ပြည်ပရှိ စားသောက်ဆိုင်၊ ဆိုင်ခန်းနှင့် ဝန်ဆောင်မှုများ"},{e:"✈️",t:"အသစ်ရောက်ရှိသူများ",d:"အိမ်ရာ၊ အလုပ်နှင့် အသိုင်းအဝိုင်း လိုအပ်သူများ"},{e:"💰",t:"မြန်မာပြည်ရှိ မိသားစု",d:"ပြည်ပမှ ငွေလွှဲလက်ခံသူများ"},{e:"🌏",t:"နိုင်ငံဖြတ်ကျော်ခရီးသည်",d:"နိုင်ငံများကြားတွင် ကုန်ပစ္စည်းဆောင်ဆောင်သူများ"}],
    findWork:"အလုပ်ရှာ", hireWorkers:"အလုပ်သမားခေါ်", allPosts:"အားလုံး", jobsAvail:"🏪 အလုပ်ရှိသည်", seekWork:"👷 အလုပ်ရှာနေသည်",
    allRooms:"အားလုံး", roomsAvail:"🏠 ငှားရမ်းရန်ရှိ", seekRoom:"🔍 အိမ်ရှာနေသည်",
    allCargo:"အားလုံး", canCarry:"✈️ ဆောင်ပေးနိုင်", needCarry:"📦 ဆောင်ပေးမည့်သူရှာ",
    postJob:"အလုပ်ဖော်ပြ", postAgent:"ကိုယ်စားလှယ်မှတ်ပုံတင်", postRental:"အိမ်ငှားဖော်ပြ", postCarry:"ဆောင်ဆောင်ဖော်ပြ", postItem:"ပစ္စည်းရောင်းဖော်ပြ",
    contactFb:"💬 Facebook မှ ဆက်သွယ်", contactViber:"📱 WhatsApp / Viber", msgSeller:"💬 ရောင်းသူကို မက်ဆေ့ပို့",
    hundiNotice:"⚠️ ဟွန်ဒီသည် မြန်မာ့ရွှေ့ပြောင်းသူများ အကြားတွင် ကျယ်ကျယ်ပြန့်ပြန့် အသုံးပြုသော ယုံကြည်မှုအခြေခံ ငွေလွှဲစနစ်ဖြစ်သည်။ ကိုယ်စားလှယ်များကို အသိုင်းအဝိုင်းမှ စစ်ဆေးအတည်ပြုသည်။",
    cargoNotice:"✈️ ကိုယ်ထည်ဆောင်ကွန်ရက်: ခရီးသွားများသည် ထားခဲ့သောဘက်ဂေ့နေရာကို ကုန်ပစ္စည်းများ ဆောင်ဆောင်ပေးရန် ကမ်းလှမ်းသည်။",
    rateCalc:"💱 နှုန်းထားတွက်ချက်မှု", from:"မှ", amount:"ပမာဏ", communityAgents:"🤝 အသိုင်းအဝိုင်း ကိုယ်စားလှယ်များ",
    verified:"✅ အတည်ပြုပြီး", pending:"⏳ စောင့်ဆိုင်းဆဲ", reviews:"သုံးသပ်ချက်", rate:"နှုန်းထား", fee:"ကြေးငွေ", dailyLimit:"နေ့စဉ်ကန့်သတ်",
    urgent:"🔥 အရေးပေါ်", burmeseHouse:"🇲🇲 မြန်မာ့အိမ်", jobAvail:"🏪 အလုပ်ရှိသည်", seekingWork:"👷 အလုပ်ရှာနေသည်",
    available:"🏠 ငှားရမ်းရန်ရှိ", seeking:"🔍 ရှာဖွေနေသည်", canCarryTag:"✈️ ဆောင်ပေးနိုင်", needCarryTag:"📦 ဆောင်ပေးမည့်သူရှာ", budget:"ဘတ်ဂျက်",
    send:"ပို့သည်", receive:"MMK လက်ခံရရှိ*", logIn:"ဝင်ရောက်မည်", logOut:"ထွက်မည်", myProfile:"ကျွန်ုပ်၏ ပရိုဖိုင်", myListings:"ကျွန်ုပ်၏ ကြော်ငြာ", settings:"ဆက်တင်",
    registerInterest:"မှတ်ပုံတင်မည်", beFirst:"မြန်နက်နှင့် ချိတ်ဆက်ပါ", registerDesc:"အသစ်သောဝန်ဆောင်မှုများ၊ အလုပ်အကိုင်များနှင့် အပ်ဒိတ်များ အကြောင်း ပထမဆုံးသိရှိရန် မှတ်ပုံတင်ပါ",
    joinFb:"Facebook တွင် မြန်နက်ကို Follow လုပ်ပါ", comingSoon:"မကြာမီ ဖော်ပြနိုင်သောစနစ် ရောက်ရှိလာမည်! ယခုအချိန်တွင် Facebook အုပ်စုမှတစ်ဆင့် ဖော်ပြပါ:",
    goFb:"🌐 Facebook အုပ်စုသို့သွား", close:"ပိတ်", services:"ဝန်ဆောင်မှုများ", countries:"နိုင်ငံများ", contact:"ဆက်သွယ်ရန်", privacy:"မူဝါဒ", terms:"အသုံးပြုသည့်စည်းမျဉ်း", about:"အကြောင်း",
    signIn:"သင်၏အကောင့်သို့ ဝင်ရောက်ပါ", continueWithFb:"Facebook ဖြင့် ဆက်လက်မည်", or:"သို့မဟုတ်", phone:"ဖုန်းနံပါတ် (WhatsApp / Viber)", sendOTP:"OTP ကုဒ် ပို့မည်", verifyCode:"အတည်ပြုမည်", changePhone:"ဖုန်းနံပါတ် ပြောင်းမည်", emailAddr:"အီးမေးလ် လိပ်စာ", password:"စကားဝှက်", signingIn:"ဝင်နေသည်…", sending:"ပို့နေသည်…", verifying:"စစ်ဆေးနေသည်…", connecting:"ချိတ်ဆက်နေသည်…",
    iAm:"သင်သည် ဘာလုပ်သနည်း?", worker:"👷 အလုပ်သမား", business:"🏪 လုပ်ငန်းရှင်", hundiAgent:"💸 ဟွန်ဒီ ကိုယ်စားလှယ်", other:"🌏 အခြား", country:"နိုင်ငံ", registerNow:"မှတ်ပုံတင်မည်", noSpam:"သင့်အချက်အလက်ကို ကျွန်ုပ်တို့ မျှဝေမည်မဟုတ်ပါ",
    registered:"မှတ်ပုံတင်ပြီးပါပြီ!", thankyou:"မြန်နက်တွင် ပါဝင်ကြောင်း ကျေးဇူးတင်ပါသည်။", bySigningIn:"ဝင်ရောက်ခြင်းဖြင့် ကျွန်ုပ်တို့၏ အသုံးပြုသည့်စည်းမျဉ်းများကို သဘောတူသည်",
  }
};

const JOBS=[
  {id:1,type:"offer",title:"Head Sushi Chef Needed",titleMM:"ဦးဆောင်ဆူရှီ ဆရာ လိုအပ်သည်",employer:"Golden Sushi Co.",location:"Houston, TX 🇺🇸",pay:"$28-32/hr",urgent:true,skills:["Nigiri","Sashimi","Rolling"],desc:"Busy restaurant, immediate start, housing help available.",descMM:"လုပ်ငန်းအလုပ်များသောဆိုင်၊ ချက်ချင်းစတင်နိုင်၊ အိမ်ရာကူညီမည်။"},
  {id:2,type:"seek",title:"Sushi Chef Looking for Work",titleMM:"ဆူရှီ ဆရာ အလုပ်ရှာနေ",name:"Kyaw Zin Oo",location:"Los Angeles, CA 🇺🇸",pay:"$22-26/hr",avail:"Available Now",skills:["Rolling","Plating","Sashimi"],desc:"8 years experience, can drive, looking full-time.",descMM:"အတွေ့အကြုံ ၈ နှစ်ရှိ၊ မောင်းနှင်နိုင်၊ အချိန်ပြည့်အလုပ်ရှာနေ။"},
  {id:3,type:"offer",title:"Thai Restaurant Kitchen Help",titleMM:"ထိုင်းစားသောက်ဆိုင် မီးဖိုချောင်ကူ",employer:"Sawadee Kitchen",location:"Bangkok 🇹🇭",pay:"฿15,000/mo",urgent:false,skills:["Prep","Dishwash","Cooking"],desc:"Burmese owner, accommodation included.",descMM:"မြန်မာပိုင်ဆိုင်သည်၊ နေရာထိုင်ခင်း ပါဝင်သည်။"},
  {id:4,type:"seek",title:"Any Kitchen Work Available",titleMM:"မီးဖိုချောင်အလုပ် မည်သည်မဆို",name:"Ei Ei Phyu",location:"Kuala Lumpur 🇲🇾",pay:"Negotiable",avail:"Available This Week",skills:["Cleaning","Prep","Delivery"],desc:"New arrival, hardworking, need work urgently.",descMM:"အသစ်ရောက်ရှိသူ၊ ကြိုးစားသော၊ အလုပ်အမြန်လိုအပ်သည်။"},
  {id:5,type:"offer",title:"Sushi Counter Helper x2",titleMM:"ဆူရှီ ကောင်တာ ကူညီသူ x2",employer:"Sakura Market",location:"Tokyo 🇯🇵",pay:"¥1,200/hr",urgent:true,skills:["Rolling","Cashier","Packaging"],desc:"Grocery counter, part-time ok.",descMM:"ကြယ်မှတ်ဆိုင်ကောင်တာ၊ အချိန်ပိုင်းလက်ခံသည်။"},
  {id:6,type:"seek",title:"Factory or Construction Work",titleMM:"စက်ရုံ သို့ ဆောက်လုပ်ရေးအလုပ်",name:"Zaw Lin",location:"Penang 🇲🇾",pay:"RM 1,500+/mo",avail:"Available Now",skills:["Construction","Driving","Loading"],desc:"Strong worker, 5 years factory experience.",descMM:"ကြံ့ခိုင်သောအလုပ်သမား၊ စက်ရုံတွင် ၅ နှစ်အတွေ့အကြုံ။"},
];
const HUNDI=[
  {id:1,agent:"Ko Thura (Trusted Agent)",from:"🇺🇸 USA",to:"🇲🇲 Myanmar",rate:"2,100 MMK",fee:"2%",limit:"$5,000/day",phone:"+1-713-555-0101",verified:true,reviews:142,desc:"15 years in Houston. Same-day delivery.",descMM:"Houston တွင် ၁၅ နှစ်ရှိ။ တူညီသောနေ့ ငွေရောက်သည်။"},
  {id:2,agent:"Ma Myat Noe",from:"🇹🇭 Thailand",to:"🇲🇲 Myanmar",rate:"870 MMK per ฿",fee:"1.5%",limit:"฿50,000/day",phone:"+66-81-555-0202",verified:true,reviews:89,desc:"Bangkok agent, 8 years trusted.",descMM:"Bangkok ကိုယ်စားလှယ်၊ ၈ နှစ်ကြာ ယုံကြည်ရသည်။"},
  {id:3,agent:"Ko Zaw Win",from:"🇲🇾 Malaysia",to:"🇲🇲 Myanmar",rate:"450 MMK per RM",fee:"2%",limit:"RM 10,000/day",phone:"+60-12-555-0303",verified:true,reviews:67,desc:"KL & Penang. Community vouched.",descMM:"KL နှင့် Penang။ အသိုင်းအဝိုင်းမှ အထောက်အကူပြု။"},
  {id:4,agent:"Daw Khin Khin",from:"🇯🇵 Japan",to:"🇲🇲 Myanmar",rate:"13.5 MMK per ¥",fee:"2.5%",limit:"¥200,000/day",phone:"+81-90-555-0404",verified:false,reviews:23,desc:"Tokyo agent, review pending.",descMM:"Tokyo ကိုယ်စားလှယ်၊ စစ်ဆေးနေဆဲ။"},
  {id:5,agent:"Ko Naing (Singapore)",from:"🇸🇬 Singapore",to:"🇲🇲 Myanmar",rate:"1,550 MMK per S$",fee:"1.8%",limit:"S$8,000/day",phone:"+65-9555-0505",verified:true,reviews:55,desc:"Fast, discreet, reliable.",descMM:"မြန်ဆန်၊ ယုံကြည်ရနိုင်သည်။"},
];
const RENTALS=[
  {id:1,type:"offer",title:"Shared Room Available",titleMM:"မျှဝေသောအခန်း ရှိသည်",location:"Houston, TX 🇺🇸",price:"$450/mo",rooms:"1 bed in shared house",burmese:true,desc:"Bills included. Sushi workers welcome.",descMM:"ဘီလ်ပါဝင်သည်။ ဆူရှီအလုပ်သမားများကြိုဆိုသည်။"},
  {id:2,type:"seek",title:"Looking for Cheap Room",titleMM:"သက်သာသောအခန်း ရှာနေ",name:"Aung Ko Ko",location:"Los Angeles, CA 🇺🇸",budget:"$400-500/mo",desc:"New arrival, quiet, need room ASAP.",descMM:"အသစ်ရောက်ရှိသူ၊ တိတ်ဆိတ်သော၊ အခန်းချက်ချင်းလိုသည်။"},
  {id:3,type:"offer",title:"Room — Burmese Community Area",titleMM:"မြန်မာ ဧရိယာ — အခန်းငှား",location:"Bangkok, Don Mueang 🇹🇭",price:"฿3,500/mo",rooms:"Private room, shared kitchen",burmese:true,desc:"Near Burmese worker community.",descMM:"မြန်မာအလုပ်သမားအသိုင်းအဝိုင်းနီးကပ်သည်။"},
  {id:4,type:"offer",title:"Cheap Room, Factory Workers OK",titleMM:"သက်သာသောအခန်း၊ စက်ရုံကြိုဆို",location:"Penang 🇲🇾",price:"RM 250/mo",rooms:"Shared dorm, 4 beds",burmese:false,desc:"Walking distance to industrial zone.",descMM:"စက်မှုဇုန်သို့ လမ်းလျှောက်ကြောင်းမှ ရောက်နိုင်သည်။"},
  {id:5,type:"seek",title:"Family Needs House",titleMM:"မိသားစု အိမ်လိုအပ်သည်",name:"Daw Aye",location:"Kuala Lumpur 🇲🇾",budget:"RM 600-800/mo",desc:"Family of 3, need 2 rooms.",descMM:"အိမ်ထောင်စု ၃ ဦး၊ ၂ ခန်းလိုသည်။"},
  {id:6,type:"offer",title:"Shared Apartment — Burmese Only",titleMM:"မြန်မာသာ — တိုက်ခန်းမျှဝေ",location:"Tokyo, Edogawa 🇯🇵",price:"¥35,000/mo",rooms:"1 room in 3LDK",burmese:true,desc:"Clean, quiet, close to train.",descMM:"သန့်ရှင်း၊ တိတ်ဆိတ်၊ ရထားနီးကပ်သည်။"},
];
const CARGO=[
  {id:1,type:"carry",name:"Ko Zaw (USA→Myanmar)",route:"Houston → Yangon",date:"Aug 15, 2025",space:"5 kg",price:"$8/kg",contact:"+1-713-555-0101",desc:"Medicine, documents, small items ok.",descMM:"ဆေး၊ စာရွက်စာတမ်း၊ သေးငယ်သောပစ္စည်းများ ဆောင်ပေးနိုင်သည်။"},
  {id:2,type:"need",name:"Ma Aye Aye",route:"Bangkok → Yangon",date:"ASAP",items:"Medicine, clothing",contact:"+66-81-555-0202",desc:"Need medicine for elderly mother.",descMM:"မိခင်အဘိုးအဘွားအတွက် ဆေးဝါး လိုအပ်သည်။"},
  {id:3,type:"carry",name:"Ei Ei (KL→Yangon monthly)",route:"Kuala Lumpur → Mandalay",date:"Every month",space:"Up to 10 kg",price:"RM 15/kg",contact:"+60-12-555-0303",desc:"Regular traveler, documents & food ok.",descMM:"ပုံမှန်ခရီးသွား၊ စာရွက်စာတမ်းနှင့် အစားအစာ ဆောင်ပေးနိုင်သည်။"},
  {id:4,type:"carry",name:"Ko Nay Lin",route:"Tokyo → Yangon",date:"Sep 3, 2025",space:"8 kg",price:"$10/kg",contact:"+81-90-555-0404",desc:"Electronics, medicine, clothes. No liquids.",descMM:"အီလက်ထရောနစ်၊ ဆေး၊ အဝတ်အထည်။ အရည်မဆောင်ပါ။"},
  {id:5,type:"need",name:"Daw Khin",route:"USA → Yangon",date:"Before Sep",items:"Documents, baby items",contact:"+1-323-555-0202",desc:"Urgent: documents + baby formula.",descMM:"အရေးပေါ်: စာရွက်စာတမ်းနှင့် ကလေးနို့မှုန့်"},
];
const GOODS=[
  {id:1,title:"Toyota Camry 2018",titleMM:"တိုယိုတာ ကမ်ရီ ၂၀၁၈",cat:"🚗 Vehicles",price:"$12,500",loc:"Houston 🇺🇸",seller:"Ko Aung",img:"🚗",desc:"Clean title, 85k miles.",descMM:"မှတ်ပုံတင်သန့်၊ ၈၅,၀၀၀ မိုင်"},
  {id:2,title:"iPhone 14 Pro 256GB",titleMM:"အိုင်ဖုန်း ၁၄ ပရို",cat:"📱 Electronics",price:"$650",loc:"LA 🇺🇸",seller:"Ma Thida",img:"📱",desc:"Unlocked, excellent condition.",descMM:"ကိုမဆိုသုံးနိုင်၊ အခြေအနေကောင်းသည်"},
  {id:3,title:"Sushi Equipment Full Set",titleMM:"ဆူရှီ ကိရိယာ အစုံ",cat:"🔪 Equipment",price:"$3,200",loc:"Chicago 🇺🇸",seller:"U Kyaw",img:"🔪",desc:"Rice cooker, display case, full tools.",descMM:"ထမင်းပေါင်း၊ ပြသသောသေတ္တာ၊ ကိရိယာအစုံ"},
  {id:4,title:"Honda Jazz 2016",titleMM:"ဟွန်ဒါ ဂျက် ၂၀၁၆",cat:"🚗 Vehicles",price:"RM 28,000",loc:"KL 🇲🇾",seller:"Ko Myo",img:"🚙",desc:"Good condition, service record.",descMM:"အခြေအနေကောင်း၊ ပြုပြင်မှတ်တမ်းရှိ"},
  {id:5,title:"Gold Necklace 2 Baht",titleMM:"ရွှေလည်ဆွဲ ၂ ဘာတ်",cat:"💍 Jewelry",price:"฿28,000",loc:"Bangkok 🇹🇭",seller:"Ma Hnin",img:"💍",desc:"Myanmar gold, genuine.",descMM:"မြန်မာ ရွှေစစ်စစ်"},
  {id:6,title:"Burmese Cooking Pots Set",titleMM:"မြန်မာ ချက်ပြုတ်ရေး အိုးစုံ",cat:"🍳 Household",price:"$80",loc:"Atlanta 🇺🇸",seller:"Daw Khin",img:"🍳",desc:"Large set, great for restaurant.",descMM:"ကြီးသောအစုံ၊ စားသောက်ဆိုင်အတွက် သင့်တော်"},
  {id:7,title:"Samsung Galaxy S23",titleMM:"ဆမ်ဆောင်း ဂလက်ဆီ S23",cat:"📱 Electronics",price:"¥45,000",loc:"Tokyo 🇯🇵",seller:"Ko Nay",img:"📱",desc:"Like new, unlocked.",descMM:"အသစ်နှင့်တူ၊ ကိုမဆိုသုံးနိုင်"},
  {id:8,title:"Sewing Machine — Singer",titleMM:"ဆင်ဂျာ ချုပ်စက်",cat:"🪡 Equipment",price:"RM 350",loc:"Penang 🇲🇾",seller:"Ma Win",img:"🧵",desc:"Works perfectly, moving sale.",descMM:"ကောင်းစွာအလုပ်လုပ်သည်"},
];

const PILLARS=["jobs","hundi","rent","cargo","goods","biz"];
const COLORS={jobs:"#c0392b",hundi:"#7c3aed",rent:"#0891b2",cargo:"#d97706",goods:"#16a34a",biz:"#9d174d"};
const avCol=a=>a==="Available Now"?"#16a34a":a==="Available This Week"?"#d97706":"#6366f1";
const Tag=({bg="#f3f4f6",c="#374151",children})=><span style={{background:bg,color:c,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,display:"inline-block",margin:"2px"}}>{children}</span>;
const FbBtn=({label,style:s})=><button style={{width:"100%",background:"#1877f2",color:"#fff",border:"none",borderRadius:10,padding:"9px",fontWeight:700,cursor:"pointer",fontSize:13,marginTop:8,...s}}>{label}</button>;
const ViberBtn=({label})=><button style={{width:"100%",background:"#25d366",color:"#fff",border:"none",borderRadius:10,padding:"9px",fontWeight:700,cursor:"pointer",fontSize:13,marginTop:8}}>{label}</button>;

export default function App(){
  const [lang,setLang]=useState("en");
  const [tab,setTab]=useState("home");
  const [filter,setFilter]=useState("all");
  const [modal,setModal]=useState(null);
  const [sendAmt,setSendAmt]=useState("500");
  const [fromC,setFromC]=useState("🇺🇸 USA");
  const [goodsCat,setGoodsCat]=useState("All");
  const [profileOpen,setProfileOpen]=useState(false);

  // Auth (real Supabase sign-in once keys are set; demo sign-in until then)
  const [user,setUser]=useState(null);
  const [loginModal,setLoginModal]=useState(false);
  const [postType,setPostType]=useState(null); // null = closed, "" = choose type
  const [mineOpen,setMineOpen]=useState(false);
  const [version,setVersion]=useState(0);
  const [emailCountry,setEmailCountry]=useState("🇺🇸 USA");
  useEffect(()=>{
    store.getUser().then(setUser);
    const off=store.onAuthChange(u=>{setUser(u);if(u)setLoginModal(false);});
    const q=new URLSearchParams(window.location.search);
    if(q.get("login_error"))setLoginModal(true);
    import("country-flag-emoji-polyfill").then(m=>m.polyfillCountryFlagEmojis()).catch(()=>{});
    return off;
  },[]);
  const openPost=(type)=>{if(!user){setLoginModal(true);return;}setPostType(type||"");};
  const ctx={user,lang,openLogin:()=>setLoginModal(true),openPost,refresh:()=>setVersion(v=>v+1),version};

  // Email capture
  const [emailModal,setEmailModal]=useState(false);
  const [email,setEmail]=useState("");
  const [emailRole,setEmailRole]=useState("worker");
  const [emailDone,setEmailDone]=useState(false);


  const t=T[lang];
  const col=COLORS[tab]||"#c0392b";
  const tx=(en,mm)=>lang==="mm"?mm:en;

  const handleLogout=()=>{store.signOut();setProfileOpen(false);};
  const s3=S[lang];

  const pillarIdx=PILLARS.indexOf(tab);
  const FilterBtn=({val,label,active,color})=>(
    <button onClick={()=>setFilter(val)} style={{padding:"7px 16px",borderRadius:20,border:`2px solid ${active?color:"#ddd"}`,background:active?color:"#fff",color:active?"#fff":"#555",fontWeight:700,cursor:"pointer",fontSize:12}}>{label}</button>
  );
  const Card=({children,topColor})=>(
    <div style={{background:"#fff",borderRadius:16,padding:18,boxShadow:"0 4px 14px rgba(0,0,0,0.07)",borderTop:`4px solid ${topColor}`}}>{children}</div>
  );

  return(
    <AppCtx.Provider value={ctx}>
    <div style={{fontFamily:"'Twemoji Country Flags','Segoe UI',system-ui,sans-serif",minHeight:"100vh",background:THEME.page,color:"#1f2a20"}}>

      {/* HEADER */}
      <style>{`@media (max-width:760px){.mn-header{flex-wrap:wrap;height:auto!important;padding:8px 10px 4px!important;row-gap:6px}.mn-right{display:contents!important}.mn-pillars{order:3;width:100%;overflow-x:auto;justify-content:space-between}.mn-lang{margin-left:auto}}`}</style>
      <div className="mn-header" style={{background:"#ffffff",borderBottom:"1px solid #d9e7da",padding:"0 14px",height:58,display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",position:"sticky",top:0,zIndex:100}}>
        <div onClick={()=>setTab("home")} style={{color:THEME.greenDark,fontWeight:900,fontSize:17,cursor:"pointer",display:"flex",alignItems:"center",gap:7}}>
          🇲🇲 <span>{t.appName}</span>
          <span style={{fontSize:10,background:THEME.greenSoft,color:THEME.green,padding:"2px 7px",borderRadius:10}}>{t.beta}</span>
        </div>
        <div className="mn-right" style={{display:"flex",gap:3,alignItems:"center"}}>
          <div className="mn-lang" style={{display:"flex",background:"#eef4ee",borderRadius:20,padding:2,marginRight:4}}>
            {["en","mm"].map(l=><button key={l} onClick={()=>setLang(l)} style={{background:lang===l?THEME.green:"transparent",color:lang===l?"#fff":THEME.green,border:"none",borderRadius:18,padding:"4px 10px",fontWeight:800,cursor:"pointer",fontSize:12}}>{l==="en"?"EN":"မြန်မာ"}</button>)}
          </div>
          <div className="mn-pillars" style={{display:"flex",gap:3}}>
          {PILLARS.map((p,i)=>(
            <button key={p} onClick={()=>{setTab(p);setFilter("all");}} style={{background:tab===p?THEME.greenSoft:"transparent",color:THEME.greenText,border:"none",borderRadius:14,padding:"4px 8px",cursor:"pointer",fontWeight:700,fontSize:11,display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
              <span style={{fontSize:15}}>{t.pillarIcons[i]}</span>
              <span style={{fontSize:8,opacity:.85}}>{t.pillars[i].split("/")[0].trim()}</span>
            </button>
          ))}
          </div>
          {user?(
            <div style={{position:"relative"}}>
              <div onClick={()=>setProfileOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:6,background:"#eef4ee",borderRadius:22,padding:"4px 10px 4px 4px",cursor:"pointer"}}>
                {user.photo?<img src={user.photo} style={{width:26,height:26,borderRadius:"50%",border:"2px solid #fff"}} alt="av"/>:<div style={{width:26,height:26,borderRadius:"50%",background:THEME.green,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12}}>{(user.name||"?")[0]}</div>}
                <span style={{color:THEME.greenText,fontSize:11,fontWeight:700,maxWidth:70,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</span>
                <span style={{color:"#889",fontSize:9}}>▾</span>
              </div>
              {profileOpen&&(
                <div style={{position:"absolute",right:0,top:42,background:"#fff",borderRadius:14,boxShadow:"0 8px 30px rgba(0,0,0,0.18)",minWidth:190,zIndex:500,padding:8}}>
                  <div style={{padding:"10px 14px",borderBottom:"1px solid #f0f0f0",marginBottom:6}}>
                    <div style={{fontWeight:800,fontSize:13}}>{user.name}</div>
                    <div style={{fontSize:11,color:"#888",marginTop:2}}>{user.method}</div>
                  </div>
                  {[["➕",s3.postFree.replace("+ ",""),()=>{setProfileOpen(false);openPost();}],["📋",s3.myListings,()=>{setProfileOpen(false);setMineOpen(true);}],...(user.is_admin?[["🛡️",s3.admin,()=>{window.location.href="/admin";}]]:[])].map(([ic,lb,fn])=>(
                    <div key={lb} onClick={fn} style={{padding:"9px 14px",fontSize:13,color:"#333",cursor:"pointer",borderRadius:8,display:"flex",gap:8}}><span>{ic}</span><span>{lb}</span></div>
                  ))}
                  <div onClick={handleLogout} style={{padding:"9px 14px",fontSize:13,color:"#c0392b",cursor:"pointer",borderRadius:8,display:"flex",gap:8,borderTop:"1px solid #f0f0f0",marginTop:4}}><span>🚪</span><span>{t.logOut}</span></div>
                </div>
              )}
            </div>
          ):(
            <button onClick={()=>setLoginModal(true)} style={{background:THEME.red,color:"#fff",border:"none",borderRadius:20,padding:"6px 14px",fontWeight:800,cursor:"pointer",fontSize:12,marginLeft:4}}>{t.logIn}</button>
          )}
        </div>
      </div>

      {!LIVE&&<div style={{background:"#fff8e1",color:"#7a5b00",fontSize:11,textAlign:"center",padding:"5px 10px",borderBottom:"1px solid #f3d27a"}}>🧪 {s3.demoBanner}</div>}

      {/* HOME */}
      {tab==="home"&&<>
        <div style={{background:"linear-gradient(160deg,#e3f3e4 0%,#f1f8e9 55%,#fdf0ec 100%)",color:THEME.greenText,padding:"44px 20px 56px",textAlign:"center"}}>
          <div style={{fontSize:46,marginBottom:8}}>🇲🇲</div>
          <h1 style={{margin:"0 0 4px",fontSize:30,fontWeight:900,color:THEME.greenDark}}>{t.appName}</h1>
          <div style={{fontSize:16,opacity:.8,marginBottom:14}}>{t.appSub}</div>
          <div style={{fontSize:14,opacity:.9,maxWidth:560,margin:"0 auto 20px",lineHeight:1.8}}>{t.tagline}</div>
          <button onClick={()=>openPost()} style={{background:THEME.red,color:"#fff",border:"none",borderRadius:26,padding:"13px 28px",fontWeight:800,fontSize:15,cursor:"pointer",marginBottom:22,boxShadow:"0 6px 18px rgba(192,57,43,0.25)"}}>{s3.postYourBiz}</button>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
            {["🇺🇸 USA","🇹🇭 Thailand","🇲🇾 Malaysia","🇯🇵 Japan","🇸🇬 Singapore","🇲🇲 Myanmar"].map(c=>(
              <span key={c} style={{background:"#fff",color:THEME.greenText,border:"1px solid #d9e7da",borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:600}}>{c}</span>
            ))}
          </div>
        </div>

        <div style={{maxWidth:1000,margin:"-28px auto 0",padding:"0 16px 32px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:16}}>
            {PILLARS.map((p,i)=>(
              <div key={p} onClick={()=>{setTab(p);setFilter("all");}} style={{background:"#fff",borderRadius:16,padding:20,textAlign:"center",cursor:"pointer",boxShadow:"0 4px 16px rgba(0,0,0,0.08)",border:`2px solid ${COLORS[p]}18`}}>
                <div style={{fontSize:34,marginBottom:8}}>{t.pillarIcons[i]}</div>
                <div style={{fontWeight:800,fontSize:13,color:COLORS[p],lineHeight:1.3}}>{t.pillars[i]}</div>
                <div style={{fontSize:11,color:"#888",marginTop:4,lineHeight:1.4}}>{t.pillarDesc[i]}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#fff",borderRadius:18,padding:24,marginBottom:14,boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
            <div style={{fontWeight:900,fontSize:17,color:THEME.greenDark,marginBottom:14,textAlign:"center"}}>{t.whoTitle}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12}}>
              {t.who.map(x=>(
                <div key={x.t} style={{background:THEME.greenSoft,borderRadius:12,padding:14,display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{fontSize:24}}>{x.e}</div>
                  <div><div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{x.t}</div><div style={{fontSize:11,color:"#666",lineHeight:1.5}}>{x.d}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:THEME.redSoft,borderRadius:18,padding:26,color:"#7a1f14",textAlign:"center",border:"1px solid #f6d3cd"}}>
            <div style={{fontWeight:900,fontSize:18,marginBottom:8}}>{t.visionTitle}</div>
            <div style={{fontSize:14,opacity:.95,lineHeight:1.9,maxWidth:560,margin:"0 auto"}}>{t.vision}</div>
            <div style={{marginTop:14,fontSize:20,letterSpacing:4}}>💼 💸 🏠 ✈️ 🛍️</div>
          </div>
        </div>

        {/* EMAIL BANNER */}
        <div style={{background:"#fff8e1",padding:"32px 20px",textAlign:"center",borderTop:"1px solid #f3e2b0"}}>
          <div style={{fontSize:28,marginBottom:8}}>📬</div>
          <div style={{color:"#3e2a00",fontWeight:900,fontSize:20,marginBottom:6}}>{t.beFirst}</div>
          <div style={{color:"#6b5a2e",fontSize:14,marginBottom:20,lineHeight:1.7}}>{t.registerDesc}</div>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>setEmailModal(true)} style={{background:"#c0392b",color:"#fff",border:"none",borderRadius:24,padding:"13px 28px",fontWeight:800,fontSize:14,cursor:"pointer"}}>✅ {t.registerInterest}</button>
            <a href="https://www.facebook.com/profile.php?id=61595978411240" target="_blank" rel="noreferrer" style={{background:"#1877f2",color:"#fff",borderRadius:24,padding:"13px 28px",fontWeight:800,fontSize:14,cursor:"pointer",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:6}}>👥 {t.joinFb}</a>
          </div>
        </div>
      </>}

      {/* PILLAR HEADER */}
      {tab!=="home"&&(
        <div style={{background:`linear-gradient(135deg,${col}cc,${col})`,color:"#fff",padding:"20px 18px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontWeight:900,fontSize:20}}>{t.pillarIcons[pillarIdx]} {t.pillars[pillarIdx]}</div>
            <div style={{opacity:.85,fontSize:13,marginTop:2}}>{t.pillarDesc[pillarIdx]}</div>
          </div>
          <button onClick={()=>openPost(tab)} style={{background:"rgba(255,255,255,0.22)",color:"#fff",border:"2px solid rgba(255,255,255,0.45)",borderRadius:22,padding:"9px 20px",fontWeight:800,cursor:"pointer",fontSize:13}}>
            + {tab==="jobs"?t.postJob:tab==="hundi"?t.postAgent:tab==="rent"?t.postRental:tab==="cargo"?t.postCarry:tab==="biz"?s3.postFree.replace("+ ",""):t.postItem}
          </button>
        </div>
      )}

      {/* JOBS */}
      {tab==="jobs"&&<div style={{maxWidth:1000,margin:"0 auto",padding:"18px 16px"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
          <FilterBtn val="all" label={t.allPosts} active={filter==="all"} color="#c0392b"/>
          <FilterBtn val="offer" label={t.jobsAvail} active={filter==="offer"} color="#c0392b"/>
          <FilterBtn val="seek" label={t.seekWork} active={filter==="seek"} color="#c0392b"/>
        </div>
        <CommunityListings pillar="jobs" color={COLORS.jobs}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(285px,1fr))",gap:14}}>
          {JOBS.filter(j=>filter==="all"||j.type===filter).map(j=>(
            <Card key={j.id} topColor={j.type==="offer"?"#c0392b":"#16a34a"}>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                <Tag bg={j.type==="offer"?"#fde8e8":"#f0fdf4"} c={j.type==="offer"?"#c0392b":"#16a34a"}>{j.type==="offer"?t.jobAvail:t.seekingWork}</Tag>
                {j.urgent&&<Tag bg="#fef3c7" c="#92400e">{t.urgent}</Tag>}
                {j.avail&&<Tag bg="#ede9fe" c="#7c3aed">● {j.avail}</Tag>}
              </div>
              <div style={{fontWeight:800,fontSize:15,marginBottom:2}}>{tx(j.title,j.titleMM)}</div>
              <div style={{color:"#888",fontSize:12,marginBottom:4}}>📍 {j.location}</div>
              <div style={{color:"#c0392b",fontWeight:700,fontSize:14,marginBottom:8}}>💰 {j.pay}</div>
              <div style={{fontSize:12,color:"#555",marginBottom:8,lineHeight:1.5}}>{tx(j.desc,j.descMM)}</div>
              {j.skills&&<div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:8}}>{j.skills.map(s=><Tag key={s}>{s}</Tag>)}</div>}
              <FbBtn label={t.contactFb}/>
              <ReviewBar id={"s-jobs-"+j.id} title={tx(j.title,j.titleMM)}/>
            </Card>
          ))}
        </div>
      </div>}

      {/* HUNDI */}
      {tab==="hundi"&&<div style={{maxWidth:900,margin:"0 auto",padding:"18px 16px"}}>
        <div style={{background:"#fef3c7",borderRadius:12,padding:13,marginBottom:18,border:"1px solid #f59e0b",fontSize:12,color:"#92400e"}}>{t.hundiNotice}</div>
        <div style={{background:"#fff",borderRadius:16,padding:22,marginBottom:18,boxShadow:"0 4px 14px rgba(0,0,0,0.07)"}}>
          <div style={{fontWeight:800,fontSize:16,color:"#7c3aed",marginBottom:12}}>{t.rateCalc}</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end",marginBottom:14}}>
            <div><div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:3}}>{t.from}</div>
              <select value={fromC} onChange={e=>setFromC(e.target.value)} style={{padding:"8px 12px",borderRadius:10,border:"1px solid #ddd",fontSize:13}}>
                {["🇺🇸 USA","🇹🇭 Thailand","🇲🇾 Malaysia","🇯🇵 Japan","🇸🇬 Singapore"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:3}}>{t.amount}</div>
              <input type="number" value={sendAmt} onChange={e=>setSendAmt(e.target.value)} style={{padding:"8px 12px",borderRadius:10,border:"1px solid #ddd",fontSize:13,width:100}}/>
            </div>
            <div style={{paddingBottom:4,fontSize:16}}>→ 🇲🇲 Myanmar</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10}}>
            {[["USA","$",2100],["Thailand","฿",870],["Malaysia","RM",450],["Japan","¥",13.5],["Singapore","S$",1550]].map(([c,sym,rate])=>
              fromC.includes(c)&&(
                <div key={c} style={{background:"#faf5ff",borderRadius:12,padding:14,textAlign:"center",border:"1px solid #e9d5ff"}}>
                  <div style={{fontSize:11,color:"#888",marginBottom:4}}>{t.send} {sym}{(+sendAmt).toLocaleString()}</div>
                  <div style={{fontWeight:900,fontSize:22,color:"#7c3aed"}}>{(+sendAmt*rate).toLocaleString()}</div>
                  <div style={{fontSize:11,color:"#888"}}>{t.receive}</div>
                </div>
              )
            )}
          </div>
        </div>
        <CommunityListings pillar="hundi" color={COLORS.hundi}/>
        <div style={{fontWeight:800,fontSize:15,marginBottom:12}}>{t.communityAgents}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:14}}>
          {HUNDI.map(h=>(
            <Card key={h.id} topColor={h.verified?"#7c3aed":"#ddd"}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{fontWeight:800,fontSize:14}}>{h.agent}</div>
                <Tag bg={h.verified?"#ede9fe":"#f3f4f6"} c={h.verified?"#7c3aed":"#888"}>{h.verified?t.verified:t.pending}</Tag>
              </div>
              <div style={{fontSize:12,color:"#888",marginBottom:8}}>{h.from} → {h.to}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
                {[[t.rate,h.rate+" MMK"],[t.fee,h.fee],[t.dailyLimit,h.limit]].map(([l,v])=>(
                  <div key={l} style={{background:"#faf5ff",borderRadius:8,padding:"7px",textAlign:"center"}}>
                    <div style={{fontSize:9,color:"#888"}}>{l}</div>
                    <div style={{fontWeight:700,fontSize:11,color:"#5b21b6"}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:12,color:"#555",marginBottom:6,lineHeight:1.5}}>{tx(h.desc,h.descMM)}</div>
              <div style={{fontSize:11,color:"#888",marginBottom:8}}>⭐ {h.reviews} {t.reviews} · {h.phone}</div>
              <ViberBtn label={t.contactViber}/>
              <ReviewBar id={"s-hundi-"+h.id} title={h.agent}/>
            </Card>
          ))}
        </div>
      </div>}

      {/* RENT */}
      {tab==="rent"&&<div style={{maxWidth:1000,margin:"0 auto",padding:"18px 16px"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
          <FilterBtn val="all" label={t.allRooms} active={filter==="all"} color="#0891b2"/>
          <FilterBtn val="offer" label={t.roomsAvail} active={filter==="offer"} color="#0891b2"/>
          <FilterBtn val="seek" label={t.seekRoom} active={filter==="seek"} color="#0891b2"/>
        </div>
        <CommunityListings pillar="rent" color={COLORS.rent}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(285px,1fr))",gap:14}}>
          {RENTALS.filter(r=>filter==="all"||r.type===filter).map(r=>(
            <Card key={r.id} topColor={r.type==="offer"?"#0891b2":"#d97706"}>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                <Tag bg={r.type==="offer"?"#e0f2fe":"#fffbeb"} c={r.type==="offer"?"#0891b2":"#d97706"}>{r.type==="offer"?t.available:t.seeking}</Tag>
                {r.burmese&&<Tag bg="#fde8e8" c="#c0392b">{t.burmeseHouse}</Tag>}
              </div>
              <div style={{fontWeight:800,fontSize:15,marginBottom:2}}>{tx(r.title,r.titleMM)}</div>
              <div style={{color:"#888",fontSize:12,marginBottom:6}}>📍 {r.location}</div>
              {r.price&&<div style={{color:"#0891b2",fontWeight:800,fontSize:15,marginBottom:4}}>{r.price}</div>}
              {r.budget&&<div style={{color:"#d97706",fontWeight:700,fontSize:13,marginBottom:4}}>{t.budget}: {r.budget}</div>}
              {r.rooms&&<div style={{fontSize:12,color:"#555",marginBottom:4}}>🛏 {r.rooms}</div>}
              <div style={{fontSize:12,color:"#555",marginBottom:8,lineHeight:1.5}}>{tx(r.desc,r.descMM)}</div>
              <FbBtn label={t.contactFb}/>
              <ReviewBar id={"s-rent-"+r.id} title={tx(r.title,r.titleMM)}/>
            </Card>
          ))}
        </div>
      </div>}

      {/* CARGO */}
      {tab==="cargo"&&<div style={{maxWidth:1000,margin:"0 auto",padding:"18px 16px"}}>
        <div style={{background:"#fffbeb",borderRadius:12,padding:13,marginBottom:18,border:"1px solid #f59e0b",fontSize:12,color:"#92400e"}}>{t.cargoNotice}</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
          <FilterBtn val="all" label={t.allCargo} active={filter==="all"} color="#d97706"/>
          <FilterBtn val="carry" label={t.canCarry} active={filter==="carry"} color="#d97706"/>
          <FilterBtn val="need" label={t.needCarry} active={filter==="need"} color="#d97706"/>
        </div>
        <CommunityListings pillar="cargo" color={COLORS.cargo}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(285px,1fr))",gap:14}}>
          {CARGO.filter(c=>filter==="all"||c.type===filter).map(c=>(
            <Card key={c.id} topColor={c.type==="carry"?"#d97706":"#c0392b"}>
              <Tag bg={c.type==="carry"?"#fffbeb":"#fde8e8"} c={c.type==="carry"?"#d97706":"#c0392b"}>{c.type==="carry"?t.canCarryTag:t.needCarryTag}</Tag>
              <div style={{fontWeight:800,fontSize:14,margin:"8px 0 3px"}}>{c.name}</div>
              <div style={{color:"#555",fontWeight:700,fontSize:13,marginBottom:3}}>🛫 {c.route}</div>
              <div style={{color:"#888",fontSize:12,marginBottom:5}}>📅 {c.date}</div>
              {c.space&&<div style={{color:"#d97706",fontWeight:700,fontSize:12,marginBottom:4}}>📦 {c.space} · 💰 {c.price}</div>}
              {c.items&&<div style={{color:"#c0392b",fontWeight:600,fontSize:12,marginBottom:4}}>🎁 {c.items}</div>}
              <div style={{fontSize:12,color:"#555",marginBottom:8,lineHeight:1.5}}>{tx(c.desc,c.descMM)}</div>
              <ViberBtn label={t.contactViber}/>
              <ReviewBar id={"s-cargo-"+c.id} title={c.name}/>
            </Card>
          ))}
        </div>
      </div>}

      {/* GOODS */}
      {tab==="goods"&&<div style={{maxWidth:1000,margin:"0 auto",padding:"18px 16px"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
          {["All","🚗 Vehicles","📱 Electronics","🔪 Equipment","💍 Jewelry","🍳 Household"].map(c=>(
            <button key={c} onClick={()=>setGoodsCat(c)} style={{padding:"7px 14px",borderRadius:20,border:`2px solid ${goodsCat===c?"#16a34a":"#ddd"}`,background:goodsCat===c?"#16a34a":"#fff",color:goodsCat===c?"#fff":"#555",fontWeight:700,cursor:"pointer",fontSize:12}}>{c}</button>
          ))}
        </div>
        <CommunityListings pillar="goods" color={COLORS.goods}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
          {GOODS.filter(g=>goodsCat==="All"||g.cat===goodsCat).map(g=>(
            <div key={g.id} style={{background:"#fff",borderRadius:16,padding:16,boxShadow:"0 4px 14px rgba(0,0,0,0.07)"}}>
              <div style={{background:"#f0fdf4",borderRadius:12,height:80,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,marginBottom:10}}>{g.img}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <div style={{fontWeight:800,fontSize:13,flex:1}}>{tx(g.title,g.titleMM)}</div>
                <div style={{fontWeight:900,fontSize:15,color:"#16a34a",marginLeft:6}}>{g.price}</div>
              </div>
              <Tag bg="#f0fdf4" c="#16a34a">{g.cat}</Tag>
              <div style={{fontSize:11,color:"#555",margin:"6px 0 3px",lineHeight:1.5}}>{tx(g.desc,g.descMM)}</div>
              <div style={{fontSize:10,color:"#aaa",marginBottom:8}}>📍 {g.loc} · 👤 {g.seller}</div>
              <FbBtn label={t.msgSeller}/>
              <ReviewBar id={"s-goods-"+g.id} title={tx(g.title,g.titleMM)}/>
            </div>
          ))}
        </div>
      </div>}

      {/* BUSINESSES */}
      {tab==="biz"&&<div style={{maxWidth:1000,margin:"0 auto",padding:"18px 16px"}}>
        <CommunityListings pillar="biz" color={COLORS.biz}/>
      </div>}

      {/* FOOTER */}
      <footer style={{background:"#1a1a1a",color:"rgba(255,255,255,0.8)",padding:"36px 20px 20px",marginTop:8}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:28,marginBottom:28}}>
            <div>
              <div style={{fontWeight:900,fontSize:18,color:"#fff",marginBottom:6}}>🇲🇲 MyanNet</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.8,marginBottom:10}}>မြန်နက် · All-in-one services, anywhere, for the people of Myanmar</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.8}}>{lang==="mm"?"ကမ္ဘာတစ်ဝှမ်းရှိ မြန်မာ့လူ့အဖွဲ့အစည်းအတွက် ယုံကြည်ရသောပလက်ဖောင်း":"The trusted platform for Burmese/Myanmar communities worldwide."}</div>
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:12,color:"#fff",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{t.services}</div>
              {PILLARS.map((p,i)=>(
                <div key={p} onClick={()=>{setTab(p);setFilter("all");}} style={{color:"rgba(255,255,255,0.55)",fontSize:13,marginBottom:7,cursor:"pointer",display:"flex",gap:6}}>
                  <span>{t.pillarIcons[i]}</span><span>{t.pillars[i]}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:12,color:"#fff",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{t.countries}</div>
              {["🇺🇸 USA","🇹🇭 Thailand","🇲🇾 Malaysia","🇯🇵 Japan","🇸🇬 Singapore","🇲🇲 Myanmar"].map(c=>(
                <div key={c} style={{color:"rgba(255,255,255,0.55)",fontSize:13,marginBottom:7}}>{c}</div>
              ))}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:12,color:"#fff",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{t.contact}</div>
              {[{ic:"🌐",lb:"www.myannet.app",hr:"https://www.myannet.app"},{ic:"👥",lb:"MyanNet on Facebook",hr:"https://www.facebook.com/profile.php?id=61595978411240"},{ic:"📱",lb:"Viber Community",hr:"#"},{ic:"✉️",lb:"hello@myannet.app",hr:"mailto:hello@myannet.app"}].map(x=>(
                <a key={x.lb} href={x.hr} style={{color:"rgba(255,255,255,0.55)",fontSize:12,marginBottom:9,display:"flex",gap:7,textDecoration:"none"}}>
                  <span>{x.ic}</span><span>{x.lb}</span>
                </a>
              ))}
              <button onClick={()=>setEmailModal(true)} style={{marginTop:10,background:"#c0392b",color:"#fff",border:"none",borderRadius:20,padding:"8px 18px",fontWeight:700,cursor:"pointer",fontSize:12}}>📬 {t.registerInterest}</button>
            </div>
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>© 2026 MyanNet · www.myannet.app · All rights reserved</div>
            <div style={{display:"flex",gap:14}}>
              {[[t.privacy,"/privacy"],[t.terms,"/terms"]].map(([l,hr])=><a key={l} href={hr} style={{fontSize:11,color:"rgba(255,255,255,0.45)",textDecoration:"none"}}>{l}</a>)}
            </div>
          </div>
        </div>
      </footer>

      {/* LOGIN */}
      {loginModal&&<Login onClose={()=>setLoginModal(false)}/>}

      {/* EMAIL CAPTURE MODAL */}
      {emailModal&&(
        <div onClick={e=>e.target===e.currentTarget&&setEmailModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400}}>
          <div style={{background:"#fff",borderRadius:20,padding:28,width:"100%",maxWidth:400,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
            {emailDone?(
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:56,marginBottom:12}}>🎉</div>
                <div style={{fontWeight:900,fontSize:20,color:"#16a34a",marginBottom:8}}>{t.registered}</div>
                <div style={{fontSize:14,color:"#555",lineHeight:1.7}}>{t.thankyou}</div>
                <button onClick={()=>{setEmailModal(false);setEmailDone(false);setEmail("");}} style={{marginTop:20,background:"#c0392b",color:"#fff",border:"none",borderRadius:20,padding:"10px 28px",fontWeight:700,cursor:"pointer",fontSize:14}}>{t.close}</button>
              </div>
            ):<>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontWeight:900,fontSize:17,color:"#8B0000"}}>📬 {t.registerInterest}</div>
                <button onClick={()=>setEmailModal(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#aaa"}}>✕</button>
              </div>
              <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:4}}>{t.emailAddr} *</div>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{width:"100%",padding:"11px 13px",borderRadius:10,border:"1px solid #ddd",fontSize:14,marginBottom:14,boxSizing:"border-box"}}/>
              <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:8}}>{t.iAm}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                {[["worker",t.worker],["business",t.business],["agent",t.hundiAgent],["other",t.other]].map(([val,lb])=>(
                  <button key={val} onClick={()=>setEmailRole(val)} style={{padding:"9px",border:`2px solid ${emailRole===val?"#c0392b":"#ddd"}`,borderRadius:10,background:emailRole===val?"#fde8e8":"#fff",color:emailRole===val?"#c0392b":"#555",fontWeight:700,cursor:"pointer",fontSize:12,textAlign:"left"}}>{lb}</button>
                ))}
              </div>
              <div style={{fontSize:11,fontWeight:700,color:"#555",marginBottom:4}}>{t.country}</div>
              <select value={emailCountry} onChange={e=>setEmailCountry(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid #ddd",fontSize:13,marginBottom:16,boxSizing:"border-box"}}>
                {["🇺🇸 USA","🇹🇭 Thailand","🇲🇾 Malaysia","🇯🇵 Japan","🇸🇬 Singapore","🇲🇲 Myanmar","Other"].map(c=><option key={c}>{c}</option>)}
              </select>
              <button onClick={async()=>{if(!email.includes("@"))return;try{await store.registerInterest(email,emailRole,emailCountry);}catch{}setEmailDone(true);}} style={{width:"100%",background:email?"#c0392b":"#ccc",color:"#fff",border:"none",borderRadius:12,padding:"13px",fontWeight:800,cursor:email?"pointer":"default",fontSize:14}}>✅ {t.registerNow}</button>
              <div style={{fontSize:11,color:"#aaa",textAlign:"center",marginTop:10}}>{t.noSpam}</div>
            </>}
          </div>
        </div>
      )}

      {/* POST + MY LISTINGS */}
      {postType!==null&&user&&<PostFlow initialType={postType||undefined} onClose={()=>setPostType(null)}/>}
      {mineOpen&&user&&<MyListings onClose={()=>setMineOpen(false)}/>}
    </div>
    </AppCtx.Provider>
  );
}
