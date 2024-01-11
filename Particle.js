import * as THREE from "three";
import { CONFIG } from "./config";

export const EPSILON = 5;
export const ABSORPTION = 0.8;

export const initParticle = ({ x, y, z, mass, radius, color }) => {
  const particle = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 4, 4),
    new THREE.MeshBasicMaterial({ color: color, wireframe: false })
  );

  particle.position.set(x, y, z);

  const particleObject = {
    object: particle,
    mass: mass,
    radius: radius,
    acceleration: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
  };
  return particleObject;
};

export const createParticles = (scene, { number, mass, color, x, y, z }) => {
  const BOX_DIMENSION = {
    x: CONFIG.BOX_DIMENSION_X,
    y: CONFIG.BOX_DIMENSION_Y,
    z: CONFIG.BOX_DIMENSION_Z,
  };
  const particles = [];
  for (let i = 0; i < number; i++) {
    const particle = initParticle({
      x: x ?? Math.random() * BOX_DIMENSION.x - BOX_DIMENSION.x / 2,
      y: y ?? Math.random() * BOX_DIMENSION.y - BOX_DIMENSION.y / 2,
      z: z ?? Math.random() * BOX_DIMENSION.z - BOX_DIMENSION.z / 2,
      mass: mass,
      radius: mass / 2,
      color: color,
    });
    particles.push(particle);
    scene.add(particle.object);
  }
  return particles;
};

export const updateParticle = (particle) => {
  const BOX_DIMENSION = {
    x: CONFIG.BOX_DIMENSION_X,
    y: CONFIG.BOX_DIMENSION_Y,
    z: CONFIG.BOX_DIMENSION_Z,
  };
  // DIVIDE ACCELERATION BY MASS
  particle.acceleration.divideScalar(particle.mass);
  if (
    CONFIG.EARTH_GRAVITY &&
    particle.object.position.y >= -BOX_DIMENSION.y / 2 + particle.radius + 0.01
  ) {
    particle.acceleration.y -= particle.mass * 9.81 * 10 ** -2;
  }
  if (
    particle.object.position.x > BOX_DIMENSION.x / 2 ||
    particle.object.position.x < -BOX_DIMENSION.x / 2
  ) {
    particle.object.position.x =
      particle.object.position.x > 0
        ? BOX_DIMENSION.x / 2
        : -BOX_DIMENSION.x / 2;
    // REBOUND FORMULA (BUMP)
    particle.velocity.x *= -ABSORPTION;
    particle.acceleration.x *= -ABSORPTION;
  }
  if (
    particle.object.position.y > BOX_DIMENSION.y / 2 ||
    particle.object.position.y < -BOX_DIMENSION.y / 2
  ) {
    particle.object.position.y =
      particle.object.position.y > 0
        ? BOX_DIMENSION.y / 2
        : -BOX_DIMENSION.y / 2;
    particle.velocity.y *= -ABSORPTION;
    particle.acceleration.y *= -ABSORPTION;
  }
  if (
    particle.object.position.z > BOX_DIMENSION.z / 2 ||
    particle.object.position.z < -BOX_DIMENSION.z / 2
  ) {
    particle.object.position.z =
      particle.object.position.z > 0
        ? BOX_DIMENSION.z / 2
        : -BOX_DIMENSION.z / 2;
    particle.velocity.z *= -ABSORPTION;
    particle.acceleration.z *= -ABSORPTION;
  }

  particle.velocity.add(particle.acceleration);
  particle.object.position.add(particle.velocity);
  particle.acceleration.multiplyScalar(0);
  particle.velocity.multiplyScalar(CONFIG.FRICTION);
};

export const particleRules = (group1, group2, g) => {
  group1.forEach((particle1) => {
    group2.forEach((particle2) => {
      if (particle1 === particle2) return;
      const distance =
        particle1.object.position.distanceTo(particle2.object.position) +
        EPSILON;
      if (distance - EPSILON > CONFIG.MAX_DISTANCE) return;
      const force = g * ((particle1.mass * particle2.mass) / distance ** 2);
      const direction = new THREE.Vector3()
        .subVectors(particle2.object.position, particle1.object.position)
        .normalize();

      const forceVector = direction.multiplyScalar(force);
      particle1.acceleration.add(forceVector);
    });
  });
};

export const updateParticles = (particles) => {
  const allParticles = particles.reduce((acc, array) => {
    return acc.concat(array.group);
  }, []);
  allParticles.forEach((particle) => {
    updateParticle(particle);
  });
};
