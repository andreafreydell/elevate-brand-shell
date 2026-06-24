from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT_PATH = OUTPUT_DIR / "gea-supercycle-3pl-quick-guide.pdf"


def register_fonts() -> None:
    windows_fonts = Path("C:/Windows/Fonts")
    pdfmetrics.registerFont(TTFont("GEASerif", str(windows_fonts / "georgia.ttf")))
    pdfmetrics.registerFont(TTFont("GEASerifBold", str(windows_fonts / "georgiab.ttf")))


def build_styles():
    styles = getSampleStyleSheet()

    bg = colors.HexColor("#F0E8DE")
    foreground = colors.HexColor("#6A574B")
    ink = colors.HexColor("#44372F")
    card = colors.HexColor("#DCCFC2")
    secondary = colors.HexColor("#D4C7B8")
    muted_fg = colors.HexColor("#7E6F63")
    border = colors.HexColor("#A89888")
    hero = colors.HexColor("#5E4B42")
    hero_text = colors.HexColor("#E9DECF")
    dusty_teal = colors.HexColor("#6E8F8B")
    tag_red = colors.HexColor("#C54A3D")

    styles.add(
        ParagraphStyle(
            name="GEA_Label",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=10,
            textColor=muted_fg,
            alignment=TA_LEFT,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="GEA_Title",
            parent=styles["Title"],
            fontName="GEASerifBold",
            fontSize=24,
            leading=28,
            textColor=ink,
            alignment=TA_LEFT,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="GEA_Subtitle",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=15,
            textColor=muted_fg,
            alignment=TA_LEFT,
            spaceAfter=12,
        )
    )
    styles.add(
        ParagraphStyle(
            name="GEA_Chip",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=10,
            textColor=hero_text,
            alignment=TA_CENTER,
        )
    )
    styles.add(
        ParagraphStyle(
            name="GEA_Section",
            parent=styles["Heading2"],
            fontName="GEASerifBold",
            fontSize=15,
            leading=18,
            textColor=foreground,
            alignment=TA_LEFT,
            spaceAfter=9,
        )
    )
    styles.add(
        ParagraphStyle(
            name="GEA_StepNum",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=12,
            textColor=hero_text,
            alignment=TA_CENTER,
        )
    )
    styles.add(
        ParagraphStyle(
            name="GEA_StepTitle",
            parent=styles["Normal"],
            fontName="GEASerifBold",
            fontSize=11.5,
            leading=13,
            textColor=ink,
            alignment=TA_LEFT,
            spaceAfter=2,
        )
    )
    styles.add(
        ParagraphStyle(
            name="GEA_StepBody",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9.2,
            leading=12,
            textColor=ink,
            alignment=TA_LEFT,
        )
    )
    styles.add(
        ParagraphStyle(
            name="GEA_RememberTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=10,
            textColor=tag_red,
            alignment=TA_LEFT,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="GEA_RememberBody",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9,
            leading=12.5,
            textColor=ink,
            alignment=TA_LEFT,
        )
    )

    return styles, {
        "background": bg,
        "foreground": foreground,
        "ink": ink,
        "card": card,
        "secondary": secondary,
        "muted_fg": muted_fg,
        "border": border,
        "hero": hero,
        "hero_text": hero_text,
        "dusty_teal": dusty_teal,
        "tag_red": tag_red,
    }


def make_chip(text: str, styles, palette):
    table = Table([[Paragraph(text, styles["GEA_Chip"])]], colWidths=[1.78 * inch], rowHeights=[0.34 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), palette["hero"]),
                ("BOX", (0, 0), (-1, -1), 1, palette["hero"]),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def make_step(number: int, title: str, body: str, styles, palette):
    num = Table([[Paragraph(f"{number:02d}", styles["GEA_StepNum"])]], colWidths=[0.5 * inch], rowHeights=[0.5 * inch])
    num.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), palette["hero"]),
                ("BOX", (0, 0), (-1, -1), 1, palette["hero"]),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )

    text = [
        Paragraph(title, styles["GEA_StepTitle"]),
        Paragraph(body, styles["GEA_StepBody"]),
    ]

    content = Table([[num, text]], colWidths=[0.6 * inch, 5.75 * inch])
    content.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), palette["card"]),
                ("BOX", (0, 0), (-1, -1), 1, palette["border"]),
                ("INNERPADDING", (0, 0), (-1, -1), 0),
                ("LEFTPADDING", (1, 0), (1, 0), 12),
                ("RIGHTPADDING", (1, 0), (1, 0), 14),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return KeepTogether([content, Spacer(1, 0.08 * inch)])


def make_pointer(number: int, title: str, body: str, styles, palette):
    badge = Table([[Paragraph(f"{number}", styles["GEA_StepNum"])]], colWidths=[0.42 * inch], rowHeights=[0.42 * inch])
    badge.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), palette["dusty_teal"]),
                ("BOX", (0, 0), (-1, -1), 1, palette["dusty_teal"]),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )
    text = [
        Paragraph(title, styles["GEA_StepTitle"]),
        Paragraph(body, styles["GEA_StepBody"]),
    ]
    card = Table([[badge, text]], colWidths=[0.52 * inch, 5.83 * inch])
    card.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), palette["secondary"]),
                ("BOX", (0, 0), (-1, -1), 1, palette["border"]),
                ("LEFTPADDING", (1, 0), (1, 0), 12),
                ("RIGHTPADDING", (1, 0), (1, 0), 14),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return KeepTogether([card, Spacer(1, 0.07 * inch)])


def on_page(canvas, doc):
    palette = doc.palette
    width, height = letter

    canvas.saveState()
    canvas.setFillColor(palette["background"])
    canvas.rect(0, 0, width, height, fill=1, stroke=0)

    canvas.setFillColor(palette["hero"])
    canvas.rect(0.72 * inch, height - 0.92 * inch, 2.05 * inch, 0.26 * inch, fill=1, stroke=0)

    canvas.setStrokeColor(palette["border"])
    canvas.setLineWidth(1)
    canvas.line(0.72 * inch, 0.72 * inch, width - 0.72 * inch, 0.72 * inch)

    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(palette["muted_fg"])
    canvas.drawString(0.72 * inch, 0.5 * inch, "GEA / SUPERCYCLE / DAILY OPERATIONS")
    canvas.drawRightString(width - 0.72 * inch, 0.5 * inch, f"PAGE {doc.page}")
    canvas.restoreState()


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    register_fonts()
    styles, palette = build_styles()

    doc = SimpleDocTemplate(
        str(OUTPUT_PATH),
        pagesize=letter,
        leftMargin=0.72 * inch,
        rightMargin=0.72 * inch,
        topMargin=0.82 * inch,
        bottomMargin=0.82 * inch,
    )
    doc.palette = palette

    steps = [
        ("Check today's shipments", "Open Supercycle Reservations and filter for rentals that need to ship today."),
        ("Open the rental record", "Check the customer, product, assigned item, serial number, and linked Shopify order."),
        ("Pull the exact serial", "Pick the exact physical jewelry piece shown in Supercycle, not just the product name."),
        ("Create the shipping label", "Open the linked Shopify order and create the shipping label there or in your shipping tool."),
        ("Fulfill in Shopify", "Mark the shipment fulfilled in Shopify so Supercycle updates the rental as out with the customer."),
        ("Track live rentals in Supercycle", "Use Supercycle as the source of truth for what is preparing, shipped, returning, received, or restocking."),
        ("Check the returns queue", "Open Supercycle Returns every day and review which packages are coming back."),
        ("Mark items received", "When a return arrives, open the return in Supercycle and mark the item as received."),
        ("Inspect and note condition", "Check the jewelry, log wear or damage, and decide whether the piece is ready or needs repair."),
        ("Restock or hold for repair", "Once cleaned and approved, mark the item ready in Supercycle so it can be rented again."),
    ]

    pointers = [
        ("Match the serial every time", "Always confirm the exact item and serial in Supercycle before packing anything."),
        ("Fulfill in Shopify, not only in Supercycle", "Shipping and fulfillment should be completed in Shopify so both systems stay in sync."),
        ("Watch Reservations and Returns daily", "Most rental issues happen when one of these two queues is not checked on time."),
        ("Receive and inspect returns quickly", "The faster returns are received, inspected, and restocked, the more accurate availability stays."),
        ("Log condition notes right away", "If a piece has damage, missing packaging, or unusual wear, record it immediately for the next team member."),
    ]

    story = [
        Paragraph("SUPERCYCLE BACKOFFICE", styles["GEA_Label"]),
        Paragraph("Daily Workflow For The 3PL Team", styles["GEA_Title"]),
        Paragraph(
            "Customers place orders through the GEA frontend. Shopify handles the order and payment. "
            "Supercycle tells the team exactly what to ship, receive, inspect, and restock. "
            "Membership plans are billing only, so the team ships jewelry selections, not the plan itself.",
            styles["GEA_Subtitle"],
        ),
        Table(
            [[make_chip("GEA FRONTEND", styles, palette), make_chip("SHOPIFY ORDER", styles, palette), make_chip("SUPERCYCLE OPS", styles, palette)]],
            colWidths=[2.03 * inch, 2.03 * inch, 2.03 * inch],
            style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), palette["background"]), ("VALIGN", (0, 0), (-1, -1), "MIDDLE")]),
        ),
        Spacer(1, 0.2 * inch),
        Paragraph("10-Step Daily Use Guide", styles["GEA_Section"]),
    ]

    for idx, (title, body) in enumerate(steps[:6], start=1):
        story.append(make_step(idx, title, body, styles, palette))

    story.extend([PageBreak(), Paragraph("10-Step Daily Use Guide", styles["GEA_Section"])])

    for idx, (title, body) in enumerate(steps[6:], start=7):
        story.append(make_step(idx, title, body, styles, palette))

    story.extend(
        [
            Spacer(1, 0.08 * inch),
            Paragraph("5 Pointers That Keep Operations Smooth", styles["GEA_Section"]),
        ]
    )

    for idx, (title, body) in enumerate(pointers, start=1):
        story.append(make_pointer(idx, title, body, styles, palette))

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(OUTPUT_PATH)


if __name__ == "__main__":
    main()
