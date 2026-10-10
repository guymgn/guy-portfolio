from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import Flowable, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "AI-Asset-Governance-Research-Brief.pdf"
PUBLIC = ROOT / "public" / "AI-Asset-Governance-Research-Brief.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

FONT_DIR = ROOT / "public" / "fonts"
pdfmetrics.registerFont(TTFont("DM", str(FONT_DIR / "DMSans-Variable.ttf")))

BG = HexColor("#0d0d0d")
PANEL = HexColor("#35393C")
TEXT = HexColor("#e8e7e2")
MUTED = HexColor("#a7aaa7")
ACCENT = HexColor("#A4D8FF")
LINE = HexColor("#596167")


class Rule(Flowable):
    def __init__(self, width, color=LINE, height=1):
        super().__init__()
        self.width = width
        self.height = height
        self.color = color

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(self.height)
        self.canv.line(0, 0, self.width, 0)


def page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BG)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setFont("DM", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(20 * mm, 13 * mm, "AI ASSET GOVERNANCE  /  RESEARCH & PRODUCT BRIEF")
    canvas.drawRightString(A4[0] - 20 * mm, 13 * mm, f"{doc.page}")
    canvas.restoreState()


styles = {
    "eyebrow": ParagraphStyle("eyebrow", fontName="DM", fontSize=8.5, leading=11, textColor=ACCENT, tracking=1.2, spaceAfter=9),
    "title": ParagraphStyle("title", fontName="DM", fontSize=30, leading=33, textColor=TEXT, spaceAfter=13),
    "dek": ParagraphStyle("dek", fontName="DM", fontSize=13, leading=19, textColor=MUTED, spaceAfter=22),
    "h2": ParagraphStyle("h2", fontName="DM", fontSize=18, leading=22, textColor=TEXT, spaceBefore=12, spaceAfter=10),
    "h3": ParagraphStyle("h3", fontName="DM", fontSize=11, leading=14, textColor=ACCENT, spaceAfter=5),
    "body": ParagraphStyle("body", fontName="DM", fontSize=10.2, leading=15, textColor=MUTED, spaceAfter=8),
    "card": ParagraphStyle("card", fontName="DM", fontSize=9.4, leading=14, textColor=MUTED),
    "quote": ParagraphStyle("quote", fontName="DM", fontSize=15, leading=21, textColor=TEXT, leftIndent=12, borderColor=ACCENT, borderWidth=2, borderPadding=10, spaceBefore=8, spaceAfter=18),
}


def P(text, style="body"):
    return Paragraph(text, styles[style])


def cards(items, widths=None):
    cells = []
    for label, title, body in items:
        cells.append(P(
            f'<font color="#A4D8FF">{label.upper()}</font><br/>'
            f'<font color="#e8e7e2"><b>{title}</b></font><br/>'
            f'{body}',
            "card",
        ))
    table = Table([cells], colWidths=widths or [51 * mm] * len(cells), hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PANEL),
        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 11),
        ("RIGHTPADDING", (0, 0), (-1, -1), 11),
        ("TOPPADDING", (0, 0), (-1, -1), 11),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
    ]))
    return table


story = [
    Spacer(1, 8 * mm),
    P("ANONYMIZED PRODUCT DESIGN EXPLORATION", "eyebrow"),
    P("Research & Product Brief", "title"),
    P("How a security team might trace and govern risky AI models across a software supply chain.", "dek"),
    Rule(170 * mm),
    P("Context", "h2"),
    P("AI models may be embedded inside packages or container images. A single detected model can therefore appear across several repositories, artifacts, projects and environments. Actions affect the containing software artifacts, so the operator needs to understand reach before deciding what to govern."),
    P("Research objective", "h2"),
    P("Understand the technical structure around a detected model, identify the information required for a safe decision, and define how the interaction should change as the potential impact grows."),
    P("Research approach", "h2"),
    cards([
        ("01", "Domain review", "Mapped the relationship between projects, repositories, artifacts and embedded models."),
        ("02", "Workflow mapping", "Followed the investigation from detection through context gathering and governance."),
        ("03", "Scenario analysis", "Compared a localized finding with a model appearing across multiple environments."),
    ]),
    Spacer(1, 10 * mm),
    P("Research boundary", "h2"),
    P("This was a concept exploration. The findings below are design hypotheses derived from domain research and scenario mapping. They were not validated through customer interviews or production usage."),
    PageBreak(),
    Spacer(1, 8 * mm),
    P("SYNTHESIS", "eyebrow"),
    P("The investigation reverses the system hierarchy", "title"),
    P("The software is organized from organization context down to the model. The investigation begins with the model and moves outward to every place that contains it.", "dek"),
    cards([
        ("System structure", "Project > Repository > Artifact > Model", "This hierarchy explains ownership and where an action can be applied."),
        ("Investigation path", "Model > Artifacts > Repositories > Projects", "This path explains reach and the potential blast radius of a decision."),
    ], [78 * mm, 78 * mm]),
    Spacer(1, 10 * mm),
    P("What the research suggested", "h2"),
    cards([
        ("Scope", "A model is not the action target", "Governance applies to the software artifacts that contain the model."),
        ("State", "Parents need an aggregate status", "Conflicting child states should appear as Mixed at the parent level."),
        ("Risk", "One workflow cannot fit every scope", "Broader actions need more context, impact analysis and confirmation."),
    ]),
    Spacer(1, 10 * mm),
    P("Design principles", "h2"),
    P("<b>Scope awareness.</b> Show what will be affected before the action is taken.<br/><b>Progressive risk.</b> Increase context and safeguards as reach grows.<br/><b>Governance in context.</b> Keep the organizational hierarchy visible throughout the decision."),
    P("Detect > Understand > Govern", "quote"),
    PageBreak(),
    Spacer(1, 8 * mm),
    P("PRODUCT DEFINITION", "eyebrow"),
    P("Governance should scale with scope and risk", "title"),
    P("The proposed workspace keeps organizational reach, environment, governance state and technical context visible in one investigation.", "dek"),
    P("Core requirements", "h2"),
    cards([
        ("Investigate", "Trace every occurrence", "Expand projects and repositories to see each containing artifact and its environment."),
        ("Understand", "Keep model context available", "Use a collapsible details panel for security, origin, ownership, usage and technical metadata."),
        ("Govern", "Match friction to reach", "Use lightweight confirmation for one artifact and impact analysis for broad actions."),
    ]),
    Spacer(1, 6 * mm),
    P("System rules", "h2"),
    cards([
        ("Aggregation", "Conflicting child states become Mixed", "A parent communicates that its descendants do not share one governance state."),
        ("Propagation", "Higher-level actions cascade", "A project-level action affects the repositories and containing artifacts below it."),
    ], [78 * mm, 78 * mm]),
    Spacer(1, 6 * mm),
    P("Questions to validate", "h2"),
    P("1. Does the proposed hierarchy match how security teams investigate model risk?<br/>2. Which metadata is required before an operator feels confident taking action?<br/>3. When should a broad action require approval from another role?<br/>4. What audit history and rollback controls are required after governance changes?"),
    P("Possible success signals", "h2"),
    P("Time to understand total reach, errors in selecting the intended scope, abandoned governance actions, time from detection to resolution, and operator confidence before confirmation."),
]

doc = SimpleDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    rightMargin=20 * mm,
    leftMargin=20 * mm,
    topMargin=18 * mm,
    bottomMargin=22 * mm,
    title="AI Asset Governance Research & Product Brief",
    author="Guy Magen",
)
doc.build(story, onFirstPage=page, onLaterPages=page)
PUBLIC.write_bytes(OUTPUT.read_bytes())
print(OUTPUT)
