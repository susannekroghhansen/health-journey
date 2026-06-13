from PIL import Image, ImageDraw
import math

WINE = (110, 42, 71)      # #6E2A47
BLUSH = (250, 235, 235)   # #FAEBEB
WHITE = (255, 255, 255)

def heart_points(cx, cy, scale):
    pts = []
    t = 0.0
    while t < 2 * math.pi:
        x = 16 * math.sin(t) ** 3
        y = 13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t)
        pts.append((cx + x * scale, cy - y * scale))
        t += 0.02
    return pts

def rounded(size, radius, color):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, size-1, size-1], radius=radius, fill=color)
    return img, d

def make(size, maskable=False, fname=""):
    if maskable:
        # full-bleed wine, heart kept inside the safe zone
        img = Image.new("RGBA", (size, size), WINE)
        d = ImageDraw.Draw(img)
        d.polygon(heart_points(size/2, size*0.46, size/52), fill=WHITE)
    else:
        img, d = rounded(size, int(size*0.22), WINE)
        d.polygon(heart_points(size/2, size*0.46, size/46), fill=WHITE)
    img.save(fname)

make(192, fname="icons/icon-192.png")
make(512, fname="icons/icon-512.png")
make(512, maskable=True, fname="icons/maskable-512.png")
make(180, fname="icons/apple-touch-icon.png")
print("icons generated")
