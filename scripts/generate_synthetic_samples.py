"""
Synthetic Ledger Image & Ground Truth Generator for KhataLens
Generates 5 realistic synthetic handwritten ledger page images and corresponding
ground truth JSON files for evaluation, demo mode, and offline testing.
All data is strictly synthetic and labeled as such.
"""

import json
import os
import random
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "samples")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Define the 5 synthetic datasets
SAMPLES_DATA = [
    {
        "id": "sample1",
        "filename": "sample1_kirana_hindi_english.png",
        "truth_file": "sample1_truth.json",
        "title": "SHARMA KIRANA STORE - UDHAAR KHATA (Bahi Khata)",
        "date_header": "September 2026",
        "entries": [
            {"customer": "Ramesh Kumar", "amount": 850.0, "date": "2026-09-12", "type": "credit", "confidence": 0.97, "source_note": "Atta 10kg, Dal 2kg"},
            {"customer": "Suresh Gupta", "amount": 420.0, "date": "2026-09-14", "type": "credit", "confidence": 0.95, "source_note": "Chini 2kg, Chai Patti"},
            {"customer": "Amit Verma", "amount": 500.0, "date": "2026-09-15", "type": "payment", "confidence": 0.94, "source_note": "Jama kiya (cash returned)"},
            {"customer": "Pooja Sharma", "amount": 1250.0, "date": "2026-09-16", "type": "credit", "confidence": 0.96, "source_note": "Ghee 1kg, Masale packet"},
            {"customer": "Rajesh Singh", "amount": 630.0, "date": "2026-09-18", "type": "credit", "confidence": 0.92, "source_note": "Basmati Rice 5kg"}
        ]
    },
    {
        "id": "sample2",
        "filename": "sample2_daily_register.png",
        "truth_file": "sample2_truth.json",
        "title": "DAILY CREDIT & CASH REGISTER - GUPTA PROVISION",
        "date_header": "Date: 15/09/2026",
        "entries": [
            {"customer": "Anil Kumar (Dukan 4)", "amount": 1400.0, "date": "2026-09-15", "type": "credit", "confidence": 0.96, "source_note": "Refined Oil 1 Tin udhaar"},
            {"customer": "Sunil Auto Works", "amount": 750.0, "date": "2026-09-15", "type": "credit", "confidence": 0.94, "source_note": "Soap, detergent, broom"},
            {"customer": "Sunil Auto Works", "amount": 750.0, "date": "2026-09-16", "type": "payment", "confidence": 0.95, "source_note": "GPay payment received"},
            {"customer": "Deepak Medical", "amount": 320.0, "date": "2026-09-16", "type": "credit", "confidence": 0.91, "source_note": "Biscuits & cold drinks"},
            {"customer": "Kavita Rao", "amount": 890.0, "date": "2026-09-17", "type": "credit", "confidence": 0.93, "source_note": "Shampoo, oil, toothpaste"}
        ]
    },
    {
        "id": "sample3",
        "filename": "sample3_tailor_notes.png",
        "truth_file": "sample3_truth.json",
        "title": "NEW STAR TAILORS - STITCHING CREDIT REGISTER",
        "date_header": "Batch 09/26 - Fast Delivery",
        "entries": [
            {"customer": "Mohd. Imran", "amount": 650.0, "date": "2026-09-08", "type": "credit", "confidence": 0.95, "source_note": "2 Kurta Pyjama stitching"},
            {"customer": "Vijay Tailor Work", "amount": 400.0, "date": "2026-09-10", "type": "credit", "confidence": 0.78, "source_note": "Pant alteration - faint note"},
            {"customer": "Lakshmi Amma", "amount": 1100.0, "date": "2026-09-11", "type": "credit", "confidence": 0.96, "source_note": "3 Blouses with lining"},
            {"customer": "Arun Kumar", "amount": 500.0, "date": "2026-09-13", "type": "payment", "confidence": 0.92, "source_note": "Advance jama kiya"},
            {"customer": "Shabana Begum", "amount": 1850.0, "date": "2026-09-17", "type": "credit", "confidence": 0.94, "source_note": "Designer Anarkali suit work"}
        ]
    },
    {
        "id": "sample4",
        "filename": "sample4_medical_store.png",
        "truth_file": "sample4_truth.json",
        "title": "AROGYA MEDICAL & SURGICALS - KHATA BOOK",
        "date_header": "Credit Register - Sector 9",
        "entries": [
            {"customer": "Dr. Vinod Clinic", "amount": 3400.0, "date": "2026-09-05", "type": "credit", "confidence": 0.98, "source_note": "Syringes, Cotton, Betadine"},
            {"customer": "Meena Bai", "amount": 280.0, "date": "2026-09-08", "type": "credit", "confidence": 0.92, "source_note": "BP tablets regular course"},
            {"customer": "Dr. Vinod Clinic", "amount": 2000.0, "date": "2026-09-12", "type": "payment", "confidence": 0.96, "source_note": "Cheque clearance credited"},
            {"customer": "Gopal Das", "amount": 550.0, "date": "2026-09-14", "type": "credit", "confidence": 0.93, "source_note": "Vitamins & Pain relief spray"},
            {"customer": "Sunita Devi", "amount": 410.0, "date": "2026-09-19", "type": "credit", "confidence": 0.89, "source_note": "Child fever syrup & thermometer"}
        ]
    },
    {
        "id": "sample5",
        "filename": "sample5_complex_strikes.png",
        "truth_file": "sample5_truth.json",
        "title": "DINESH HARDWARE & PAINTS - MONTHLY KHATA",
        "date_header": "Ledger Page #42 - Sept 2026",
        "entries": [
            {"customer": "Harish Patel", "amount": 2200.0, "date": "2026-09-04", "type": "credit", "confidence": 0.96, "source_note": "Paint bucket 20L primer"},
            {"customer": "Babu Lal Mason", "amount": 950.0, "date": "2026-09-07", "type": "payment", "confidence": 0.93, "source_note": "Settled & struck - jama full"},
            {"customer": "Renu Verma", "amount": 470.0, "date": "2026-09-11", "type": "credit", "confidence": 0.82, "source_note": "Pipe fittings & M-Seal tap"},
            {"customer": "Manoj Singh", "amount": 1650.0, "date": "2026-09-15", "type": "credit", "confidence": 0.95, "source_note": "Cement 3 bags white sand"},
            {"customer": "Dinesh Chandra", "amount": 800.0, "date": "2026-09-18", "type": "credit", "confidence": 0.91, "source_note": "Drill bits and screw box"}
        ]
    }
]


def draw_ledger_image(sample_info, output_path):
    """Draws a high-fidelity synthetic lined ledger page."""
    width, height = 1000, 1300
    image = Image.new("RGB", (width, height), color=(253, 250, 242)) # Aged ledger paper
    draw = ImageDraw.Draw(image)

    # Margin line (Red vertical ruling)
    margin_x = 120
    draw.line([(margin_x, 40), (margin_x, height - 40)], fill=(235, 110, 110), width=3)
    draw.line([(margin_x + 4, 40), (margin_x + 4, height - 40)], fill=(245, 160, 160), width=1)

    # Header horizontal ruling (Double line)
    draw.line([(40, 160), (width - 40, 160)], fill=(200, 70, 70), width=2)
    draw.line([(40, 166), (width - 40, 166)], fill=(200, 70, 70), width=1)

    # Blue horizontal ruling lines (notebook style)
    row_height = 80
    start_y = 240
    lines_y = []
    for y in range(start_y, height - 80, row_height):
        draw.line([(40, y), (width - 40, y)], fill=(180, 205, 235), width=1)
        lines_y.append(y)

    # Vertical column dividers
    col_date = margin_x
    col_name = margin_x + 150
    col_note = margin_x + 460
    col_amt = margin_x + 710
    draw.line([(col_name, 166), (col_name, height - 80)], fill=(210, 225, 245), width=1)
    draw.line([(col_note, 166), (col_note, height - 80)], fill=(210, 225, 245), width=1)
    draw.line([(col_amt, 166), (col_amt, height - 80)], fill=(210, 225, 245), width=1)

    # Attempt to load fonts or default
    try:
        font_title = ImageFont.truetype("arial.ttf", 26)
        font_header = ImageFont.truetype("arial.ttf", 18)
        font_body = ImageFont.truetype("arial.ttf", 20)
        font_handwriting = ImageFont.truetype("comic.ttf", 21) # Casual script look
        font_badge = ImageFont.truetype("arial.ttf", 14)
    except IOError:
        font_title = ImageFont.load_default()
        font_header = font_title
        font_body = font_title
        font_handwriting = font_title
        font_badge = font_title

    # Header stamps & titles
    draw.text((margin_x + 20, 60), sample_info["title"], fill=(30, 41, 59), font=font_title)
    draw.text((margin_x + 20, 105), sample_info["date_header"], fill=(71, 85, 105), font=font_header)

    # Synthetic marker watermark
    draw.rectangle([(width - 340, 50), (width - 40, 95)], fill=(254, 242, 242), outline=(239, 68, 68))
    draw.text((width - 325, 65), "SYNTHETIC TEST DATA", fill=(185, 28, 28), font=font_badge)

    # Column Titles
    table_header_y = 195
    draw.text((margin_x + 15, table_header_y), "DATE / दिनांक", fill=(71, 85, 105), font=font_header)
    draw.text((col_name + 15, table_header_y), "CUSTOMER / ग्राहक", fill=(71, 85, 105), font=font_header)
    draw.text((col_note + 15, table_header_y), "PARTICULARS / विवरण", fill=(71, 85, 105), font=font_header)
    draw.text((col_amt + 15, table_header_y), "AMOUNT (₹) / रकम", fill=(71, 85, 105), font=font_header)

    # Ink color variations (simulating real blue and black ballpoint / gel pen)
    pen_colors = [(24, 43, 73), (18, 30, 49), (29, 78, 216), (22, 101, 52)]

    for idx, entry in enumerate(sample_info["entries"]):
        if idx >= len(lines_y):
            break
        y_pos = lines_y[idx] + 25
        pen_color = random.choice(pen_colors) if entry["type"] == "credit" else (22, 101, 52) # Greenish for payment

        # Date
        draw.text((margin_x + 15, y_pos), entry["date"][5:], fill=pen_color, font=font_handwriting)

        # Customer
        draw.text((col_name + 15, y_pos), entry["customer"], fill=pen_color, font=font_handwriting)

        # Notes / items
        draw.text((col_note + 15, y_pos), entry["source_note"], fill=pen_color, font=font_handwriting)

        # Amount with sign (+ or Jama/Udhaar)
        amt_str = f"₹{int(entry['amount'])}"
        if entry["type"] == "payment":
            amt_str = f"(-) {amt_str} [JAMA]"
        else:
            amt_str = f"(+) {amt_str} [BAKI]"
        draw.text((col_amt + 15, y_pos), amt_str, fill=pen_color, font=font_handwriting)

        # Strikethrough for paid/settled entry in sample 5
        if sample_info["id"] == "sample5" and entry["type"] == "payment":
            strike_y = y_pos + 12
            draw.line([(margin_x + 5, strike_y), (width - 50, strike_y)], fill=(185, 28, 28), width=3)
            draw.text((col_amt + 15, y_pos - 15), "SETTLED", fill=(185, 28, 28), font=font_badge)

    image.save(output_path, format="PNG", quality=95)
    print(f"Generated synthetic ledger image: {output_path}")


def main():
    print("Generating 5 synthetic handwritten ledger datasets for KhataLens...")
    for sample in SAMPLES_DATA:
        img_path = os.path.join(OUTPUT_DIR, sample["filename"])
        truth_path = os.path.join(OUTPUT_DIR, sample["truth_file"])

        # 1. Generate image
        draw_ledger_image(sample, img_path)

        # 2. Generate ground truth JSON
        with open(truth_path, "w", encoding="utf-8") as f:
            json.dump(sample["entries"], f, indent=2, ensure_ascii=False)
        print(f"Generated ground truth JSON: {truth_path}")

    print("All 5 synthetic samples and ground-truth records successfully generated!")


if __name__ == "__main__":
    main()
