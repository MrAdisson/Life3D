import GUI from "lil-gui";
import * as THREE from "three";
import { LifeEngine } from "./LifeEngine";
import { CONFIG } from "./config";

const gui = new GUI();

const init = () => {
  const life = LifeEngine.getInstance();
  gui.add(life, "pause").listen();
  const box = gui.addFolder("Box");
  box.add(CONFIG, "BOX_VISIBLE").listen();
  box.add(CONFIG, "BOX_DIMENSION_X", 1, 1000, 1).listen();
  box.add(CONFIG, "BOX_DIMENSION_Y", 1, 1000, 1).listen();
  box.add(CONFIG, "BOX_DIMENSION_Z", 1, 1000, 1).listen();
  box.addColor(CONFIG, "BOX_COLOR").listen();

  const world = gui.addFolder("World");
  world.add(CONFIG, "FRICTION", 0, 1, 0.001).listen();
  world.add(CONFIG, "ATTRACTION_FORCE", -1, 1, 0.1).listen();
  world.add(CONFIG, "MAX_DISTANCE", 0, 10000, 0.1).listen();

  gui.add(CONFIG, "WIREFRAME_MODE").listen();
  gui.add(CONFIG, "GRID_VISIBLE").listen();
  gui.add(CONFIG, "EARTH_GRAVITY").listen();
};

const addSelectedObject = (selectedObject) => {};

export const LilGUI = {
  init,
  addSelectedObject,
  removeSelectedObject: () => {
    gui.folders?.map((folder) => {
      folder._title === "Selected Object" && folder.destroy();
    });
  },
};
