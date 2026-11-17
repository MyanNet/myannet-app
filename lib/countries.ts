// Every country, without typing a long list by hand: names come from the browser (Intl.DisplayNames),
// in English or Burmese. Places where many Myanmar/Burmese people live and work are shown first.
export const POPULAR = ["MM","TH","MY","SG","JP","KR","TW","US","AU","AE","SA","QA","IN","CN","GB","CA","NZ","IL","KW","MO","HK"];
const ALL = "AD AE AF AG AI AL AM AO AR AT AU AW AZ BA BB BD BE BF BG BH BI BJ BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CL CM CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FM FR GA GB GD GE GH GM GN GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MH MK ML MM MN MO MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NR NZ OM PA PE PG PH PK PL PR PS PT PW PY QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VN VU WS YE ZA ZM ZW".split(" ");

export const flag = (code: string) => String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)));

const enNames = (() => { try { return new Intl.DisplayNames(["en"], { type: "region" }); } catch { return null; } })();
export const nameOf = (code: string, lang: string = "en") => {
  try { if (lang === "mm") return new Intl.DisplayNames(["my"], { type: "region" }).of(code) || code; } catch {}
  const n = enNames?.of(code) || code;
  return code === "US" ? "USA" : n;
};

// Options for a <select>: value is the English name (stored in the database), label has the flag.
export function countryOptions(lang: string = "en") {
  const opt = (c: string) => ({ value: nameOf(c), label: `${flag(c)} ${nameOf(c, lang)}` });
  const rest = ALL.filter((c) => !POPULAR.includes(c)).map(opt).sort((a, b) => a.label.slice(5).localeCompare(b.label.slice(5)));
  return { popular: POPULAR.map(opt), all: rest };
}
