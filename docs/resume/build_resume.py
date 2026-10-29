# ==========================================
# Builds public/resume.pdf  (one page, ATS-friendly, clickable links)
#
# HOW TO UPDATE THE RESUME
#   1. Edit the texts below (phone, new project, new skill ...).
#   2. Run:   python docs/resume/build_resume.py
#      (needs:  pip install reportlab)
#   3. The new file is written to public/resume.pdf  -> the "Download Resume" button uses it.
# ==========================================

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

OUT = "public/resume.pdf"

# ---------- CONTENT (edit here) ----------
NAME = "Lamia Kajal"
TITLE = "Full Stack Developer"
LOCATION = "Dhaka, Bangladesh"
PHONE = ""  # e.g. "+880 1XXX-XXXXXX"  (leave empty to hide)
EMAIL = "lamiakajal@gmail.com"
LINKS = [
    ("lamiakajal.com", "https://lamiakajal.com"),
    ("github.com/lamiakajal", "https://github.com/lamiakajal"),
    ("linkedin.com/in/lamiakajal", "https://www.linkedin.com/in/lamiakajal"),
]

SUMMARY = (
    "Full Stack Developer who builds fast, responsive and well-designed web applications with Next.js, "
    "TypeScript, React, Node.js and MongoDB. Completed Programming Hero's AI-Driven Full Stack Web Engineering "
    "course and has built and deployed multiple projects, including a full-stack price-tracking app with "
    "authentication and a personal portfolio with an admin blog. Cares about clean, readable code, polished "
    "animation and performance, and uses AI-assisted development to ship faster without lowering quality. "
    "Open to work and collaboration."
)

SKILLS = [
    ("Frontend", "HTML5, CSS3, JavaScript (ES6+), TypeScript, React, Next.js (App Router), Tailwind CSS, responsive design, UI animation"),
    ("Backend & Data", "Node.js, API routes / REST, MongoDB (Atlas), Mongoose, authentication with BetterAuth (email, GitHub and Google login)"),
    ("Tools & Workflow", "Git, GitHub, Vercel deployment, VS Code, AI-assisted development"),
]

# (title, [(link label, url), ...], tech line, [bullets])
PROJECTS = [
    ("Personal Portfolio & Blog",
     [("Live", "https://lamiakajal.com"), ("GitHub", "https://github.com/lamiakajal/lamia-portfolio")],
     "Next.js, TypeScript, Tailwind CSS v4, MongoDB, BetterAuth, Cloudinary, Resend",
     ["Designed and built a multi-page, fully responsive portfolio with dark/light themes, scroll-triggered and looping animations, a case-study page for every project, and a working contact form.",
      "Added a full-stack blog: GitHub/Google/email login, admin-only post editor with image upload, safe Markdown rendering and social sharing."]),
    ("BazarDor",
     [("Live", "https://bazar-dor-lamiakajal.vercel.app"), ("GitHub", "https://github.com/lamiakajal/bazar-dor")],
     "Next.js, TypeScript, Tailwind CSS, BetterAuth, MongoDB Atlas",
     ["Commodity price tracker for Dhaka markets with a Bengali-first interface (Bengali numerals and dates), price-change indicators and a live risers/fallers ticker.",
      "Protected product pages with middleware and email, Google and GitHub sign-in; sorting by parsed numeric price for accurate ordering."]),
    ("FitLog: Workout Library & Daily Lift Tracker",
     [("Live", "https://fit-log-lamiakajal.vercel.app"), ("GitHub", "https://github.com/lamiakajal/fit-log")],
     "Next.js, TypeScript, Tailwind CSS, React Context API, localStorage",
     ["Fitness app with searchable exercise library, muscle-group filters, bookmarks and a daily plan capped at five workouts to prevent overtraining.",
      "Live totals for duration and calories, completion checklist and state that persists across sessions."]),
    ("AXIT and Lucid: SaaS Landing Pages",
     [("AXIT", "https://axit-lamiakajal.vercel.app/"), ("Lucid", "https://lucid-lamiakajal.vercel.app"), ("GitHub", "https://github.com/lamiakajal/axit-landing-page")],
     "Next.js (App Router), React, Tailwind CSS, IntersectionObserver",
     ["Two production-ready, fully responsive landing pages (mobile to ultra-wide) with navbar drawer, pricing, testimonials and contact sections.",
      "Scroll animations that replay in both directions built with native browser APIs and hardware-accelerated CSS, with no animation library."]),
    ("DevStack",
     [("Live", "https://dev-stack-peach-chi.vercel.app"), ("GitHub", "https://github.com/lamiakajal/DevStack")],
     "React, TypeScript, Vite, Tailwind CSS, React Toastify",
     ["Interactive app to explore, compare and assemble a development stack from frontend, backend, database and tooling options.",
      "Live \"Your Stack\" sidebar with duplicate prevention, single and bulk removal, toast feedback and JSON-driven data."]),
]

EDUCATION = [
    ("Bachelor of Business Administration (Honours), ongoing", "Govt. Shaheed Suhrawardy College"),
    ("Higher Secondary Certificate (HSC)", "Rokeya Ahsan College"),
    ("Secondary School Certificate (SSC)", "Bamoil Ideal High School and College"),
]
TRAINING = [
    ("AI-Driven Full Stack Web Engineering (completed)", "Programming Hero"),
    ("Full Stack & Web Development, Course 309 (certificate, 2025)", "Codemanbd"),
    ("Additional certificates: UI/UX Design, Graphic and UI Design, WordPress & eCommerce", "Shikhbe Shobai, Codemanbd"),
    ("Music & Fine Arts", "Bulbul Academy of Fine Arts (BAFA)"),
]

# ---------- STYLE ----------
INK = colors.HexColor("#1f1830")
MUTED = colors.HexColor("#4b4560")
ACCENT = colors.HexColor("#be185d")
base = ParagraphStyle("base", fontName="Helvetica", fontSize=8.7, leading=11.6, textColor=INK, alignment=TA_LEFT)
S = {
    "name": ParagraphStyle("name", parent=base, fontName="Helvetica-Bold", fontSize=23, leading=26, textColor=INK),
    "title": ParagraphStyle("title", parent=base, fontName="Helvetica-Bold", fontSize=11.5, leading=14, textColor=ACCENT),
    "contact": ParagraphStyle("contact", parent=base, fontSize=8.6, textColor=MUTED, leading=11.5),
    "h": ParagraphStyle("h", parent=base, fontName="Helvetica-Bold", fontSize=9.4, leading=12, textColor=ACCENT, spaceBefore=6.5),
    "b": base,
    "bullet": ParagraphStyle("bullet", parent=base, leftIndent=10, bulletIndent=0, spaceBefore=0.4),
    "ptitle": ParagraphStyle("ptitle", parent=base, fontName="Helvetica-Bold", fontSize=9.2, leading=12),
    "plinks": ParagraphStyle("plinks", parent=base, alignment=TA_RIGHT, fontSize=8.3, textColor=ACCENT),
    "tech": ParagraphStyle("tech", parent=base, fontName="Helvetica-Oblique", textColor=MUTED, fontSize=8.3, leading=10.8),
    "right": ParagraphStyle("right", parent=base, alignment=TA_RIGHT, textColor=MUTED),
    "key": ParagraphStyle("key", parent=base, fontName="Helvetica-Bold"),
}
link = lambda label, url: f'<a href="{url}" color="#be185d">{label}</a>'

def heading(text):
    return [Paragraph(text, S["h"]), HRFlowable(width="100%", thickness=0.7, color=ACCENT, spaceBefore=1, spaceAfter=3)]

def two_col(rows, left_style="b"):
    t = Table([[Paragraph(l, S[left_style]), Paragraph(r, S["right"])] for l, r in rows], colWidths=[None, 62 * mm])
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                           ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0.5),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 0.5)]))
    return t

story = [Paragraph(NAME, S["name"]), Paragraph(TITLE, S["title"]), Spacer(1, 2)]
contact = [LOCATION] + ([PHONE] if PHONE else []) + [link(EMAIL, f"mailto:{EMAIL}")] + [link(l, u) for l, u in LINKS]
story.append(Paragraph("  |  ".join(contact), S["contact"]))

story += heading("PROFESSIONAL SUMMARY") + [Paragraph(SUMMARY, S["b"])]

story += heading("TECHNICAL SKILLS")
sk = Table([[Paragraph(k, S["key"]), Paragraph(v, S["b"])] for k, v in SKILLS], colWidths=[30 * mm, None])
sk.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                        ("TOPPADDING", (0, 0), (-1, -1), 0.8), ("BOTTOMPADDING", (0, 0), (-1, -1), 0.8)]))
story.append(sk)

story += heading("PROJECTS")
for title, links, tech, bullets in PROJECTS:
    head = Table([[Paragraph(title, S["ptitle"]),
                   Paragraph("  |  ".join(link(l, u) for l, u in links), S["plinks"])]], colWidths=[None, 70 * mm])
    head.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "BOTTOM"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                              ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 2.2),
                              ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    story += [head, Paragraph(tech, S["tech"])]
    story += [Paragraph(b, S["bullet"], bulletText="\u2022") for b in bullets]

story += heading("EDUCATION") + [two_col([(f"<b>{a}</b>", b) for a, b in EDUCATION])]
story += heading("TRAINING, CERTIFICATION & ACTIVITIES") + [two_col([(f"<b>{a}</b>", b) for a, b in TRAINING])]

doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=15 * mm, rightMargin=15 * mm, topMargin=13 * mm, bottomMargin=11 * mm,
                        title=f"{NAME} - {TITLE} Resume", author=NAME, subject="Resume")
doc.build(story)
print("Resume written to", OUT)
