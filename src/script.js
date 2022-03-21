import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import * as dat from "lil-gui";
import {
  BufferAttribute,
  BufferGeometry,
  Points,
  PointsMaterial,
  SphereBufferGeometry,
  Color,
  BoxBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  AdditiveBlending,
} from "three";

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
// loading particular texture
const particleTexture = textureLoader.load("/textures/particles/5.png");

/**
 * PARTICLES
 */
//// GEOMETRY
// // geometry from which we're going to use vertices for particles
// const particleGeometry = new SphereBufferGeometry(1, 32, 32);
// //// MATERIAL
// // ver.1
// const particlesMaterial = new PointsMaterial({
//   size: 0.02,
//   sizeAttenuation: true,
// });
// // ver.2
// // const particlesMaterial = new PointsMaterial();
// // particlesMaterial.size = 0.02;
// // particlesMaterial.sizeAttenuation = true;

// //// POINTS
// const particles = new Points(particleGeometry, particlesMaterial);
// scene.add(particles);

//// RANDOM POINTS
// an empty buffer geometry
const randPtGeometry = new BufferGeometry();
// total # of points
// const count = 1024;
const count = 4096;
// Float32Array holding point coordinates that would be added as position attribute to our empty geometry
let vertices = new Float32Array(count * 3);
// Float32Array holding random color values to be applied to each point
let colors = new Float32Array(count * 3);

// looping and adding count * 3 vertex points to our Float32Array; *3 for x,y,z coordinates
for (let i = 0; i < count * 3; i++) {
  vertices[i] = (Math.random() - 0.5) * 10;
  // colors[i] = Math.round(Math.random() * 255);
  colors[i] = Math.random();
}
// setting Float32Array as a position attribute, each vertex covering 3 values
randPtGeometry.setAttribute("position", new BufferAttribute(vertices, 3));
// setting random color attributes
randPtGeometry.setAttribute("color", new BufferAttribute(colors, 3));
// setting material for points, it's size and perspective effect
// ver.1
// const randPtMaterial = new PointsMaterial({
//   // size: 0.02,
//   size: 0.1,
//   sizeAttenuation: true,
//   color: 0xff3355,
// });
// ver.2
const randPtMaterial = new PointsMaterial();
// size of the material
randPtMaterial.size = 0.1;
// perspective
randPtMaterial.sizeAttenuation = true;
// color for each material
// randPtMaterial.color = new Color("#ff3377");
// material
// first enable transparency
randPtMaterial.transparent = true;

// use alphamap instead of map to make background black pixels transparent later
randPtMaterial.alphaMap = particleTexture;
// note that we can still see those dark edges
// that's because particles are drawn in the same order as they're created and WEBGL doesn't know which one is on the front

// using alphaTest to skip the unnecessary black px's
// randPtMaterial.alphaTest = 0.001;
// using depthTest to skip the unnecessary black px's
// randPtMaterial.depthTest = false;
// using depthWrite to skip the unnecessary black px's
randPtMaterial.depthWrite = false;
randPtMaterial.blending = AdditiveBlending;
// for random color effect to take effect
randPtMaterial.vertexColors = true;

// test cube for particles px testing
// const cube = new Mesh(new BoxBufferGeometry(), new MeshBasicMaterial());
// scene.add(cube);

// creating mesh for points and adding to the scene
const randPts = new Points(randPtGeometry, randPtMaterial);
scene.add(randPts);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update particles
  // randPts.rotation.y = elapsedTime * 0.2;
  // randPts.position.y = -elapsedTime * 0.02;
  randPts.rotation.x = -Math.cos(elapsedTime * 0.2);
  randPts.rotation.y = Math.sin(elapsedTime * 0.2);
  // for (let i = 0; i < count; i++) {
  //   // for chunking array into many 3 coordinate parts
  //   // we can use i3 to access x, i3 + 1 to access y, i3 + 2 to access z
  //   const i3 = i * 3;
  //   // getting all the x values for all the points to be used to offset y position for wave effect
  //   const x = randPtGeometry.attributes.position.array[i3];
  //   // all y values
  //   randPtGeometry.attributes.position.array[i3 + 1] = Math.sin(
  //     elapsedTime + x
  //   );
  // }
  // for update to take place
  // randPtGeometry.attributes.position.needsUpdate = true;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// particles can be used for creating dust, rain, snow, etc.
// each particle is composed of a plane (2 triangles) always facing the camera
// creation process is like Mesh's - geometry + material + Points (instead of Mesh)

// to create a particle first define a geometry (ex. spherebuffergeometry) from which vertices would be used
// next define a material using PointsMaterial defining size of the particles and
// sizeAttenuation boolean to define if the furthest particles should be smaller
// then create a mesh using Points instead of Mesh

// we can create our own geometries as well with BufferGeometry and adding position attribute

// Ways to hide black px's hiding other particles behind \\
// way.1 - setting alphaTest value > 0
// the alphaTest is a val between 0-1 that enables WebGL to know when to render px according to that px's transparency
// by def the val is 0 meaning that it'll be rendered anyway; make it 0.001 using .alphaTest for the given material
// way.2 - setting depthTest to false
// with depthTest WebGL tests if what's being drawn is closer than what's already drawn
// that's called depth testing and can be deactivated with setting .depthTest to false
// note: deactivating depth testing might create some bugs if you have other objs in your scene, or particles with different colors
// way.3 - setting depthWrite to false
// the depth of what we draw is stored in what's called a depth buffer.
// Instead of not testing if the particle is closer than what's in this depth buffer, we can tell the WebGL not to write the particles
// in that depth buffer with setting depthWrite to false
// there might be some small bugs in specific situations in this case
// in all of the above solutions there is no an ideal one, and each technique can be used in particular situations
// way.4 - setting blending to THREE.AdditiveBlending
// by def WebGL draws pxs on top of the other
// with blending we tell WebGL to add the color of the px to the color of the px already drawn
// for that change .blending prop value to THREE.AdditiveBlending
// the more pxs that match on top of each other the brighter will be the px in front
// it affects the performance

// to set random colors for each point use first create empty Float32Array, loop and add random values to it from 0-1 and set color attribute:
// randPtGeometry.setAttribute("color", new BufferAttribute(colors, 3));
// finall for effect to take place set .vertexColors prop for the given geometry material to true

// ANIMATING
// Points inherit from Object3D so we can rotate, move, scale them
// for animation purposes we can rotate paints in tick function

// to have the control over each particle we can use particlesGeometry.attributes.position.array and change parameters 3 by 3 as it's 1D array
// for change to take effect we should use particlesGeometry.attributes.position.needsUpdate = true; in tick function
// Note: always avoid updating whole attribute on each frame, as it's bad for performance
// the better approach would be to use custom shaders
