"""
Helper to create sample probe face images for immediate hackathon demo testing.
"""

import os
from PIL import Image, ImageDraw

SAMPLE_DIR = os.path.join(os.path.dirname(__file__))

def create_sample_portraits():
    os.makedirs(SAMPLE_DIR, exist_ok=True)

    samples = [
        ("alex_rivers.jpg", "#2B6CB0", "#ED8936"),
        ("sarah_chen.jpg", "#2C5282", "#F6AD55"),
        ("marcus_vance.jpg", "#1A365D", "#D69E2E"),
    ]

    for filename, bg_color, skin_color in samples:
        filepath = os.path.join(SAMPLE_DIR, filename)
        if os.path.exists(filepath):
            continue

        img = Image.new("RGB", (400, 400), color=bg_color)
        draw = ImageDraw.Draw(img)

        # Head / face oval
        draw.ellipse([110, 80, 290, 290], fill=skin_color, outline="#2D3748", width=3)
        # Neck
        draw.rectangle([170, 270, 230, 340], fill=skin_color)
        # Shoulders / torso
        draw.ellipse([60, 320, 340, 520], fill="#4A5568", outline="#2D3748", width=2)
        # Left Eye
        draw.ellipse([150, 150, 175, 170], fill="#FFFFFF", outline="#1A202C", width=2)
        draw.ellipse([160, 156, 170, 166], fill="#1A202C")
        # Right Eye
        draw.ellipse([225, 150, 250, 170], fill="#FFFFFF", outline="#1A202C", width=2)
        draw.ellipse([230, 156, 240, 166], fill="#1A202C")
        # Nose
        draw.polygon([(200, 175), (192, 205), (208, 205)], fill="#DD6B20")
        # Smile
        draw.arc([165, 205, 235, 245], start=20, end=160, fill="#742A2A", width=4)
        # Hair
        draw.ellipse([110, 50, 290, 130], fill="#1A202C")

        img.save(filepath, "JPEG")

if __name__ == "__main__":
    create_sample_portraits()
