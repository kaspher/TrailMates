export const TRAIL_COLORS = [
  "#D92B2B",
  "#1E8449",
  "#2E86C1",
  "#E67E22",
  "#8E44AD",
  "#16A085",
  "#C0392B",
  "#2C3E50",
  "#D35400",
  "#7D3C98",
  "#A04000",
  "#1B4F72",
];

class ColorManager {
  constructor() {
    this.usedColors = new Map();
    this.availableColors = [...TRAIL_COLORS];
    this.baseHues = [0, 30, 60, 120, 180, 210, 240, 270, 300, 330];
    this.currentHueIndex = 0;
    this.currentLightness = 45;
  }

  generateNewColor() {
    const hue = this.baseHues[this.currentHueIndex];
    this.currentHueIndex = (this.currentHueIndex + 1) % this.baseHues.length;

    if (this.currentHueIndex === 0) {
      this.currentLightness = Math.max(25, this.currentLightness - 5);
    }

    return `hsl(${hue}, 85%, ${this.currentLightness}%)`;
  }

  getColor(trailId) {
    if (this.usedColors.has(trailId)) {
      return this.usedColors.get(trailId);
    }

    let color;
    if (this.availableColors.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * this.availableColors.length
      );
      color = this.availableColors.splice(randomIndex, 1)[0];
    } else {
      color = this.generateNewColor();
    }

    this.usedColors.set(trailId, color);
    return color;
  }

  releaseColor(trailId) {
    const color = this.usedColors.get(trailId);
    if (color) {
      this.usedColors.delete(trailId);
      if (
        TRAIL_COLORS.includes(color) &&
        !this.availableColors.includes(color)
      ) {
        this.availableColors.push(color);
      }
    }
  }

  reset() {
    this.usedColors.clear();
    this.availableColors = [...TRAIL_COLORS];
    this.currentHueIndex = 0;
    this.currentLightness = 45;
  }

  getVisibleTrailsColors(visibleTrailIds) {
    for (const [trailId] of this.usedColors) {
      if (!visibleTrailIds.includes(trailId)) {
        this.releaseColor(trailId);
      }
    }

    return visibleTrailIds.reduce((colors, trailId) => {
      colors[trailId] = this.getColor(trailId);
      return colors;
    }, {});
  }
}

export const colorManager = new ColorManager();
