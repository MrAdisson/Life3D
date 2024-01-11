import { LifeEngine } from "./LifeEngine";
import { logger } from "./logger";
import * as THREE from "three";

export const CONFIG = {
  WIREFRAME_MODE: false,
  GRID_VISIBLE: false,
  GRID_COLOR: "rgb(099, 099, 099)",
  AXES_HELPER: true,
  ENABLE_DAMPING: true,
  // TRANSFORM_CONTROLS_ENABLED: true,
  // TRANSFORM_CONTROLS_MODE: "translate",
  // SNAP_TO_GRID: true,
  // LIGHTS_LIGHT_HELPERS_VISIBLE: true,
  // LIGHTS_SKY_LIGHT_INTENSITY: 0.5,
  // LIGHTS_SKY_LIGHT_COLOR: "rgb(255, 255, 255)",
  // LIGHTS_SKY_LIGHT_GROUND: "#333333",
  BOX_VISIBLE: true,
  BOX_DIMENSION_X: 1000,
  BOX_DIMENSION_Y: 1000,
  BOX_DIMENSION_Z: 1000,
  BOX_COLOR: "lime",
  TIME_UNIT: 1,
  FRICTION: 0.998,
  ATTRACTION_FORCE: 1,
  EARTH_GRAVITY: false,
  MAX_DISTANCE: 1000,
};

export const getConfigCallbacks = () => {
  const life = LifeEngine.getInstance();
  return {
    WIREFRAME_MODE: () => {
      life?.scene?.children?.forEach((obj) => {
        if (!obj?.material) return;
        if (obj?.type?.includes("Light")) return;
        if (obj?.type?.includes("Helper")) return;
        // DONT INCLUDE CONTAINER :
        if (obj?.name === "ThrlenderContainerBox") return;
        obj.material.wireframe = CONFIG.WIREFRAME_MODE;
      });
      logger.log(
        "WIREFRAME_MODE : " + CONFIG.WIREFRAME_MODE,
        "SETTINGS",
        "grey"
      );
    },
    GRID_VISIBLE: () => {
      life.gridHelper.visible = CONFIG.GRID_VISIBLE;
      logger.log("GRID_VISIBLE : " + CONFIG.GRID_VISIBLE, "SETTINGS", "grey");
    },

    LIGHTS_SKY_LIGHT_INTENSITY: () => {
      life.skyLight.intensity = CONFIG.LIGHTS_SKY_LIGHT_INTENSITY;
      logger.log(
        "LIGHTS_SKY_LIGHT_INTENSITY : " + CONFIG.LIGHTS_SKY_LIGHT_INTENSITY,
        "SETTINGS",
        "grey"
      );
    },
    LIGHTS_SKY_LIGHT_COLOR: () => {
      logger.log(
        "LIGHTS_SKY_LIGHT_COLOR : " + CONFIG.LIGHTS_SKY_LIGHT_COLOR,
        "SETTINGS",
        "grey"
      );
      life.skyLight.color.set(CONFIG.LIGHTS_SKY_LIGHT_COLOR);
    },
    LIGHTS_SKY_LIGHT_GROUND: () => {
      logger.log(
        "LIGHTS_SKY_LIGHT_GROUND : " + CONFIG.LIGHTS_SKY_LIGHT_GROUND,
        "SETTINGS",
        "grey"
      );
      life.skyLight.groundColor.set(CONFIG.LIGHTS_SKY_LIGHT_GROUND);
    },
    BOX_DIMENSION_X: () => {
      logger.log(
        "BOX_DIMENSION_X : " + CONFIG.BOX_DIMENSION_X,
        "SETTINGS",
        "grey"
      );

      life.scene.children.forEach((obj) => {
        if (obj.name !== "ThrlenderContainerBox") return;
        // DISPOSE GEOMETRY
        obj.geometry.dispose();
        obj.geometry = new THREE.BoxGeometry(
          CONFIG.BOX_DIMENSION_X,
          CONFIG.BOX_DIMENSION_Y,
          CONFIG.BOX_DIMENSION_Z,
          3,
          3,
          3
        );
      });
    },
    BOX_DIMENSION_Y: () => {
      logger.log(
        "BOX_DIMENSION_Y : " + CONFIG.BOX_DIMENSION_Y,
        "SETTINGS",
        "grey"
      );

      life.scene.children.forEach((obj) => {
        if (obj.name !== "ThrlenderContainerBox") return;
        // DISPOSE GEOMETRY
        obj.geometry.dispose();
        obj.geometry = new THREE.BoxGeometry(
          CONFIG.BOX_DIMENSION_X,
          CONFIG.BOX_DIMENSION_Y,
          CONFIG.BOX_DIMENSION_Z,
          3,
          3,
          3
        );
      });
    },
    BOX_DIMENSION_Z: () => {
      logger.log(
        "BOX_DIMENSION_Z : " + CONFIG.BOX_DIMENSION_Z,
        "SETTINGS",
        "grey"
      );

      life.scene.children.forEach((obj) => {
        if (obj.name !== "ThrlenderContainerBox") return;
        // DISPOSE GEOMETRY
        obj.geometry.dispose();
        obj.geometry = new THREE.BoxGeometry(
          CONFIG.BOX_DIMENSION_X,
          CONFIG.BOX_DIMENSION_Y,
          CONFIG.BOX_DIMENSION_Z,
          3,
          3,
          3
        );
      });
    },
    BOX_COLOR: () => {
      logger.log("BOX_COLOR : " + CONFIG.BOX_COLOR, "SETTINGS", "grey");
      life.scene.children.forEach((obj) => {
        if (obj.name !== "ThrlenderContainerBox") return;
        obj.material.color.set(CONFIG.BOX_COLOR);
      });
    },
    BOX_VISIBLE: () => {
      logger.log("BOX_VISIBLE : " + CONFIG.BOX_VISIBLE, "SETTINGS", "grey");
      life.scene.children.forEach((obj) => {
        if (obj.name !== "ThrlenderContainerBox") return;
        obj.visible = CONFIG.BOX_VISIBLE;
      });
    },
    TIME_UNIT: () => {
      logger.log("TIME_UNIT : " + CONFIG.TIME_UNIT, "SETTINGS", "grey");
    },
  };
};
