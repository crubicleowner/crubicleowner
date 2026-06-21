from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
FRAMES = Path(__file__).resolve().parent / "frames"
OUT = ROOT / "assets" / "profile-cover.gif"


def main() -> None:
    paths = sorted(FRAMES.glob("frame-*.png"))
    if not paths:
        raise SystemExit(f"No frames found in {FRAMES}")

    frames = []
    for path in paths:
        image = Image.open(path).convert("RGBA")
        palette = image.convert("P", palette=Image.Palette.ADAPTIVE, colors=96)
        frames.append(palette)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        OUT,
        save_all=True,
        append_images=frames[1:],
        duration=100,
        loop=0,
        optimize=True,
        disposal=2,
    )
    print(OUT)


if __name__ == "__main__":
    main()
