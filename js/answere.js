


const data = [

  {
    "title": "UPSC NDA 1 Answer Key 2026",
    "date": "Available: May 2026",
    "link": "https://upsc.gov.in/"
  },
  {
    "title": "UPSC CDS 1 Answer Key 2026",
    "date": "Available: May 2026",
    "link": "https://upsc.gov.in/"
  },
  {
    "title": "UP Police Constable Re-Exam Answer Key 2026",
    "date": "Available: May 2026",
    "link": "https://uppbpb.gov.in/"
  },
  {
    "title": "BPSC TRE 3.0 Answer Key 2026",
    "date": "Available: May 2026",
    "link": "https://bpsc.bih.nic.in/"
  },
  {
    "title": "MPESB Constable Final Answer Key 2026",
    "date": "Available: May 2026",
    "link": "https://esb.mp.gov.in/"
  },
  {
    "title": "SBI Clerk Mains Answer Key 2026",
    "date": "Available: May 2026",
    "link": "https://sbi.co.in/web/careers"
  },
  {
    "title": "DSSSB Various Post Answer Key 2026",
    "date": "Available: May 2026",
    "link": "https://dsssb.delhi.gov.in/"
  },
  {
    "title": "Haryana Police Constable Answer Key 2026",
    "date": "Available: May 2026",
    "link": "https://hssc.gov.in/"
  },
  {
    "title": "Rajasthan PTET Answer Key 2026",
    "date": "Available: May 2026",
    "link": "https://ptetvmou2026.com/"
  },
  {
    "title": "UKPSC RO/ARO Final Answer Key 2026",
    "date": "Available: May 2026",
    "link": "https://psc.uk.gov.in/"
  },
  {
    "title": "MPSC State Services Answer Key 2026",
    "date": "Available: May 2026",
    "link": "https://mpsc.gov.in/"
  },
  {
    "title": "OPSC ASO Answer Key 2026",
    "date": "Available: May 2026",
    "link": "https://opsc.gov.in/"
  },
  {
    "title": "Indian Coast Guard Navik GD Answer Key 2026",
    "date": "Available: May 2026",
    "link": "https://joinindiancoastguard.cdac.in/"
  },
  {
    "title": "UPSSSC VDO Re-Exam Answer Key 2026",
    "date": "Available: May 2026",
    "link": "https://upsssc.gov.in/"
  },
  {
    "title": "RBI Assistant Mains Answer Key 2026",
    "date": "Available: May 2026",
    "link": "https://opportunities.rbi.org.in/"
  },
  {
    "title": "CG Vyapam Patwari Answer Key 2026",
    "date": "Available: May 2026",
    "link": "https://vyapam.cgstate.gov.in/"
  },
  {
    "title": "SSC CHSL Tier 2 Answer Key 2026",
    "date": "Released: 20 Apr 2026",
    "link": "https://ssc.gov.in/"
  },
  {
    "title": "UPSSSC ANM Final Answer Key 2026",
    "date": "Released: 16 Apr 2026",
    "link": "https://upsssc.gov.in/"
  },
  {
    "title": "CUET PG Final Answer Key 2026",
    "date": "Released: Apr 2026",
    "link": "https://cuet.nta.nic.in/"
  },
  {
    "title": "JEE Main Session 2 Answer Key 2026",
    "date": "Released: Apr 2026",
    "link": "https://jeemain.nta.ac.in/"
  },
  {
    "title": "SSC GD Constable Answer Key 2026",
    "date": "Available: Apr 2026",
    "link": "https://ssc.gov.in/"
  },
  {
    "title": "IBPS SO Mains Answer Key 2026",
    "date": "Available: Apr 2026",
    "link": "https://ibps.in/"
  },
  {
    "title": "RRB NTPC CBT 1 Answer Key 2026",
    "date": "Released: 06 Apr 2026",
    "link": "https://rrbcdg.gov.in/"
  },
  {
    "title": "RRB Group D Answer Key 2026",
    "date": "Released: 17 Feb 2026",
    "link": "https://rrbcdg.gov.in/"
  },
  {
    "title": "SSC CGL Tier 2 Answer Key 2026",
    "date": "Released: 30 Jan 2026",
    "link": "https://ssc.gov.in/"
  }
]


const box = document.getElementById("answerList");
if(box) {
  box.innerHTML = ""; // Clear existing
  data.forEach(a => {
    box.innerHTML += `
     <div class="card">
       <h3>${a.title}</h3>
       <p>Date: ${a.date}</p>
       <a href="${a.link}" target="_blank">Download Now</a>
     </div>`;
  });
}
