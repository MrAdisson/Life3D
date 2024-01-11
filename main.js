import { LifeEngine } from "./LifeEngine";
import { CONFIG, getConfigCallbacks } from "./config";
import { LilGUI } from "./gui";
import "./style.css";

const TICK_RATE = 1;
// Scene
const engine = new LifeEngine();
LilGUI.init();
engine.init();

let previousConfig = { ...CONFIG };

const updateConfig = function () {
  Object.keys(CONFIG).map((key) => {
    if (CONFIG[key] !== previousConfig[key]) {
      getConfigCallbacks()?.[key]?.() && getConfigCallbacks()[key]();
    }
  });
  previousConfig = { ...CONFIG };
};

// THREE CLOCK

const animate = function () {
  engine.update();
  updateConfig();
  previousConfig = { ...CONFIG };
  engine.render();
  requestAnimationFrame(animate);
};

// RESIZE EVENT
window.addEventListener("resize", () => {
  engine.resize();
});

animate();
