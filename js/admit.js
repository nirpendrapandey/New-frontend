
 //  ADMIT CARD 

const data = [

  {
    "title": "UPSC Civil Services Prelims Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://upsconline.nic.in/"
  },
  {
    "title": "RRB NTPC CBT 1 Admit Card 2026",
    "date": "Released: 03 May 2026",
    "link": "https://rrbcdg.gov.in/"
  },
  {
    "title": "SSC Selection Post Phase XIV Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://ssc.gov.in/"
  },
  {
    "title": "Indian Navy Agniveer SSR Admit Card 2026",
    "date": "Released: 01 May 2026",
    "link": "https://joinindiannavy.gov.in/"
  },
  {
    "title": "MPESB PAT (Pre Agriculture Test) Admit Card 2026",
    "date": "Released: 01 May 2026",
    "link": "https://esb.mp.gov.in/"
  },
  {
    "title": "NEET UG Admit Card 2026",
    "date": "Released: 26 Apr 2026",
    "link": "https://exams.nta.ac.in/NEET/"
  },
  {
    "title": "CUET UG City Intimation Slip 2026",
    "date": "Released: 29 Apr 2026",
    "link": "https://cuet.nta.nic.in/"
  },
  {
    "title": "CUET UG Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://cuet.nta.nic.in/"
  },
  {
    "title": "UP Police Constable Re-Exam Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://uppbpb.gov.in/"
  },
  {
    "title": "SSC CHSL Tier 1 Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://ssc.gov.in/"
  },
  {
    "title": "SBI Clerk Mains Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://sbi.co.in/web/careers"
  },
  {
    "title": "IBPS PO Interview Call Letter 2026",
    "date": "Available: May 2026",
    "link": "https://ibps.in/"
  },
  {
    "title": "BPSC TRE 3.0 Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://bpsc.bih.nic.in/"
  },
  {
    "title": "UPSC NDA & NA I Admit Card 2026",
    "date": "Released: Apr 2026",
    "link": "https://upsconline.nic.in/"
  },
  {
    "title": "UPSC CDS I Admit Card 2026",
    "date": "Released: Apr 2026",
    "link": "https://upsconline.nic.in/"
  },
  {
    "title": "SSC CPO SI Paper 1 Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://ssc.gov.in/"
  },
  {
    "title": "DSSSB Various Post Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://dsssb.delhi.gov.in/"
  },
  {
    "title": "Haryana Police Constable Physical Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://hssc.gov.in/"
  },
  {
    "title": "Rajasthan PTET Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://ptetvmou2026.com/"
  },
  {
    "title": "UKPSC PCS Prelims Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://psc.uk.gov.in/"
  },
  {
    "title": "CG Vyapam Hostel Superintendent Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://vyapam.cgstate.gov.in/"
  },
  {
    "title": "MPSC State Services Prelims Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://mpsc.gov.in/"
  },
  {
    "title": "OPSC ASO Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://opsc.gov.in/"
  },
  {
    "title": "Indian Coast Guard Navik GD Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://joinindiancoastguard.cdac.in/"
  },
  {
    "title": "RBI Assistant Mains Admit Card 2026",
    "date": "Available: May 2026",
    "link": "https://opportunities.rbi.org.in/"
  }


];

const box = document.getElementById("admitList");

if(box) {
  box.innerHTML = ""; // पुरानी लिस्ट क्लियर करने के लिए
  data.forEach(a => {
    box.innerHTML += `
      <div class="card">
        <h3>${a.title}</h3>
        <p>Status: <strong>${a.date}</strong></p>
        <a href="${a.link}" target="_blank" class="download-btn">Download Admit Card</a>
      </div>`;
  });
}
