const data = [

  {
    "title": "JEE Main Session 2 Result 2026",
    "date": "Declared: 24 Apr 2026",
    "link": "https://jeemain.nta.ac.in/"
  },
  {
    "title": "MP Board 10th & 12th Result 2026",
    "date": "Declared: 24 Apr 2026",
    "link": "https://mpresults.nic.in/"
  },
  {
    "title": "UP Board 10th Result 2026",
    "date": "Declared: 20 Apr 2026",
    "link": "https://upresults.nic.in/"
  },
  {
    "title": "UP Board 12th Result 2026",
    "date": "Declared: 20 Apr 2026",
    "link": "https://upresults.nic.in/"
  },
  {
    "title": "UPSC CSE Final Result 2026",
    "date": "Declared: 16 Apr 2026",
    "link": "https://upsc.gov.in/"
  },
  {
    "title": "IBPS PO Final Result 2026",
    "date": "Declared: 01 Apr 2026",
    "link": "https://ibps.in/"
  },
  {
    "title": "IBPS Clerk Final Result 2026",
    "date": "Declared: 01 Apr 2026",
    "link": "https://ibps.in/"
  },
  {
    "title": "Bihar Board 10th Result 2026",
    "date": "Declared: 31 Mar 2026",
    "link": "https://results.biharboardonline.com/"
  },
  {
    "title": "Bihar Board 12th Result 2026",
    "date": "Declared: 23 Mar 2026",
    "link": "https://results.biharboardonline.com/"
  },
  {
    "title": "SBI PO Final Result 2026",
    "date": "Declared: 19 Mar 2026",
    "link": "https://sbi.co.in/web/careers"
  },
  {
    "title": "SSC CGL Tier 2 Result 2026",
    "date": "Declared: 04 Mar 2026",
    "link": "https://ssc.gov.in/"
  },
  {
    "title": "CTET Result 2026",
    "date": "Declared: 15 Feb 2026",
    "link": "https://ctet.nic.in/"
  },
  {
    "title": "SSC GD Constable Final Result 2026",
    "date": "Latest Available",
    "link": "https://ssc.gov.in/"
  },
  {
    "title": "RRB Group D Final Result 2026",
    "date": "Latest Available",
    "link": "https://rrbcdg.gov.in/"
  },
  {
    "title": "RRB NTPC CBT 1 Result 2026",
    "date": "Latest Available",
    "link": "https://rrbcdg.gov.in/"
  },
  {
    "title": "SBI Clerk Mains Result 2026",
    "date": "Latest Available",
    "link": "https://sbi.co.in/web/careers"
  },
  {
    "title": "NEET UG Result 2026",
    "date": "Latest Available",
    "link": "https://exams.nta.ac.in/NEET/"
  },
  {
    "title": "UGC NET Final Result 2026",
    "date": "Latest Available",
    "link": "https://ugcnet.nta.nic.in/"
  },
  {
    "title": "India Post GDS Merit List 2026",
    "date": "Latest Available",
    "link": "https://indiapostgdsonline.gov.in/"
  },
  {
    "title": "UP Police Constable Final Result 2026",
    "date": "Latest Available",
    "link": "https://uppbpb.gov.in/"
  },
  {
    "title": "BPSC TRE 3.0 Result 2026",
    "date": "Latest Available",
    "link": "https://bpsc.bih.nic.in/"
  },
  {
    "title": "DSSSB Various Post Result 2026",
    "date": "Latest Available",
    "link": "https://dsssb.delhi.gov.in/"
  },
  {
    "title": "UKPSC PCS Prelims Result 2026",
    "date": "Latest Available",
    "link": "https://psc.uk.gov.in/"
  },
  {
    "title": "MPSC State Services Final Result 2026",
    "date": "Latest Available",
    "link": "https://mpsc.gov.in/"
  },
  {
    "title": "CG Vyapam Patwari Result 2026",
    "date": "Latest Available",
    "link": "https://vyapam.cgstate.gov.in/"
  }
]



const box = document.getElementById("resultList");

box.innerHTML = "";

data.forEach(r => {
 box.innerHTML += `
  <div class="card">
    <h3>${r.title}</h3>
    <p>${r.date}</p>
    <a href="${r.link}" target="_blank">Check Result</a>
  </div>`;
});
