import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
// import { DEBUG } from "./debug/debug";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { CONFIG } from "./config";
import { createParticles, particleRules, updateParticles } from "./Particle";

// THE GOAL IS TO SIMULATE PARTICLES IN A 3D SPACE

const GRAVITATIONAL_CONSTANT = 6.67408 * Math.pow(10, -11);
export class LifeEngine {
  constructor() {
    if (!LifeEngine.instance) {
      LifeEngine.instance = this;
      this.pause = false;
    }
  }
  static getInstance() {
    return LifeEngine.instance;
  }

  init() {
    if (!this.scene) {
      // INIT SCENE
      this.initScene();
      // INIT CAMERA
      this.initCamera();
      // INIT RENDERER
      this.initRenderer();
      // INIT CONTROLS
      this.initControls();
      // INIT GRID
      this.initGrid();
      // INIT SKY LIGHT:
      this.initDefaultSkylight();
      //    INIT AXES HELPER
      //   this.initAxesHelper();
      //   INIT CONTAINERBOX:
      this.initContainerBox();

      this.initLifeSimulation();
      this.selectedObject = null;
      // ADD SCENE TO DOM

      document.body.appendChild(this.renderer.domElement);
    }
  }

  initScene() {
    this.scene = new THREE.Scene();
  }
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.set(0, 40, 40);
    this.camera.name = "ThrlenderCamera";
    this.scene.add(this.camera);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
  }
  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = CONFIG.ENABLE_DAMPING;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
  }
  initDefaultSkylight() {
    this.skyLight = new THREE.HemisphereLight(
      CONFIG.LIGHTS_SKY_LIGHT_COLOR,
      CONFIG.LIGHTS_SKY_LIGHT_GROUND,
      CONFIG.LIGHTS_SKY_LIGHT_INTENSITY
    );
    this.skyLight.position.set(0, 20, 0);
    this.skyLight.name = "ThrlenderSkyLight";
    // ADD HELPER TO LIGHTS:
    // const lightHelper = new THREE.PointLightHelper(this.skyLight, 1);
    // lightHelper.name = "ThrlenderSkyLightHelper";
    // this.scene.add(lightHelper);
    this.scene.add(this.skyLight);
  }

  initContainerBox() {
    const BOX_DIMENSION = {
      x: CONFIG.BOX_DIMENSION_X,
      y: CONFIG.BOX_DIMENSION_Y,
      z: CONFIG.BOX_DIMENSION_Z,
    };
    const geometry = new THREE.BoxGeometry(
      BOX_DIMENSION.x,
      BOX_DIMENSION.y,
      BOX_DIMENSION.z,
      3,
      3,
      3
    );
    const material = new THREE.MeshBasicMaterial({
      color: "lime",
      wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.name = "ThrlenderContainerBox";
    this.scene.add(cube);
  }
  initGrid() {
    this.gridHelper = new THREE.GridHelper(
      100,
      10,
      CONFIG.GRID_COLOR,
      CONFIG.GRID_COLOR
    );
    this.gridHelper.visible = CONFIG.GRID_VISIBLE;
    this.gridHelper.name = "ThrlenderGridHelper";
    this.scene.add(this.gridHelper);
  }

  initTransformControls() {
    this.transformControls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );
    this.transformControls.name = "ThrlenderTransformControls";
    // DEFAULT SNAP TO GRID
    if (CONFIG.SNAP_TO_GRID) {
      this.transformControls.setTranslationSnap(1);
      this.transformControls.setRotationSnap((15 * Math.PI) / 180);
      this.transformControls.setScaleSnap(0.25);
    }
    this.scene.add(this.transformControls);
  }

  initAxesHelper() {
    this.axesHelper = new THREE.AxesHelper(100);
    this.axesHelper.visible = CONFIG.AXES_HELPER;
    this.axesHelper.name = "ThrlenderAxesHelper";
    this.scene.add(this.axesHelper);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    this.controls.update();
    if (this.pause) return;
    this.particles.forEach((particleGroupe) => {
      particleGroupe.rules.forEach((rule) => {
        rule();
      });
    });
    updateParticles(this.particles);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  initLifeSimulation = () => {
    this.particles = [];
    const group1 = createParticles(this.scene, {
      number: 100,
      mass: 2,
      color: 0xffffff,
    });
    const group2 = createParticles(this.scene, {
      number: 1,
      mass: 60,
      color: "yellow",
      //   x: 0,
      //   y: 0,
      //   z: 0,
    });
    const group3 = createParticles(this.scene, {
      number: 20,
      mass: 8,
      color: "cyan",
    });
    // water:

    this.particles.push({
      group: group1,
      name: "asteroids",
      rules: [
        () => {
          particleRules(group1, group1, CONFIG.ATTRACTION_FORCE);
        },
        () => {
          particleRules(group1, group2, CONFIG.ATTRACTION_FORCE);
        },
        () => {
          particleRules(group1, group3, CONFIG.ATTRACTION_FORCE);
        },
      ],
    });
    this.particles.push({
      group: group2,
      name: "sun",
      rules: [
        () => {
          particleRules(group2, group2, CONFIG.ATTRACTION_FORCE);
        },
        () => {
          particleRules(group2, group1, CONFIG.ATTRACTION_FORCE);
        },
        () => {
          particleRules(group2, group3, CONFIG.ATTRACTION_FORCE);
        },
      ],
    });
    this.particles.push({
      group: group3,
      name: "planets",
      rules: [
        () => {
          particleRules(group3, group3, CONFIG.ATTRACTION_FORCE);
        },
        () => {
          particleRules(group3, group1, CONFIG.ATTRACTION_FORCE);
        },
        () => {
          particleRules(group3, group2, CONFIG.ATTRACTION_FORCE);
        },
      ],
    });
  };
  //   setSelectedObject(object) {
  //     // ATTACH TRANSFORM CONTROLS TO OBJECT:
  //     this.selectedObject = object;
  //     this.selectedObject && this.transformControls.attach(object);
  //   }
  //   removeSelectedObject() {
  //     this.transformControls.detach();
  //     this.scene.remove(this.selectedObject);
  //     this.selectedObject.material.dispose();
  //     this.selectedObject.geometry.dispose();
  //     // DEBUG.removeSelectedObject();
  //     this.selectedObject = null;
  //   }

  pauseSimulation() {
    this.pause = true;
  }
  resumeSimulation() {
    this.pause = false;
  }
}
