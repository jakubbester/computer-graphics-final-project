import { Group, Box3, Vector3 } from 'three';
import { Mesh, MeshBasicMaterial, BoxGeometry } from 'three';
// import { Face3, Geometry } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';
import qh from 'quickhull3d'
import SKYSCRAPER_MODEL from './skyscraper.gltf'; // import other buildling gltfs here. Make sure to follow the convention!
// import the building models
// TODO: only import the ones needed later! Use an array to specificy. Don't import all else slow. Just for testing 
import BUILDING1 from './building1.gltf';
import BUILDING2 from './building2.gltf';
// import BUILDING3 from './building3.gltf';
// import BUILDING4 from './building4.gltf';
// import BUILDING5 from './building5.gltf';
// import BUILDING6 from './building6.gltf';
// import BUILDING7 from './building7.gltf';
// import BUILDING8 from './building8.gltf';
// import BUILDING9 from './building9.gltf';
// import BUILDING10 from './building10.gltf';
// import BUILDING11 from './building11.gltf';
// import BUILDING12 from './building12.gltf';
// import BUILDING13 from './building13.gltf';
// import BUILDING14 from './building14.gltf';
// import BUILDING15 from './building15.gltf';
// import BUILDING16 from './building16.gltf';
// import BUILDING17 from './building17.gltf';
import BUILDING18 from './building18.gltf';
// import BUILDING19 from './building19.gltf';
import BUILDING20 from './building20.gltf';
// import BUILDING21 from './building21.gltf';
import BUILDING22 from './building22.gltf';
import BUILDING23 from './building23.gltf';
// import BUILDING24 from './building24.gltf';
// import BUILDING25 from './building25.gltf';
// import BUILDING26 from './building26.gltf';
import BUILDING27 from './building27.gltf';
// import BUILDING28 from './building28.gltf';
import BUILDING29 from './building29.gltf';
// import BUILDING30 from './building30.gltf';
// import BUILDING31 from './building31.gltf';
// import BUILDING32 from './building32.gltf';
// import BUILDING33 from './building33.gltf';
// import BUILDING34 from './building34.gltf';
// import BUILDING35 from './building35.gltf';
import BUILDING36 from './building36.gltf';
// import BUILDING37 from './building37.gltf';
// import BUILDING38 from './building38.gltf';
// import BUILDING39 from './building39.gltf';
// import BUILDING40 from './building40.gltf';
// import BUILDING41 from './building41.gltf';
// import BUILDING42 from './building42.gltf';
import BUILDING43 from './building43.gltf';
// import BUILDING44 from './building44.gltf';
// import BUILDING45 from './building45.gltf';
// import BUILDING46 from './building46.gltf';
// import BUILDING47 from './building47.gltf';
// import BUILDING48 from './building48.gltf';
// import BUILDING49 from './building49.gltf';
import BUILDING50 from './building50.gltf';
// import BUILDING51 from './building51.gltf';
// import BUILDING52 from './building52.gltf';
// import BUILDING53 from './building53.gltf';
// import BUILDING54 from './building54.gltf';
// import BUILDING55 from './building55.gltf';
// import BUILDING56 from './building56.gltf';
const BUILDINGS = [ // MUST BE RANKED IN THE ORDER OF USAGE!!!!!!!!!!!!!!!
  null, // Placeholder so array is 1-indexed
  BUILDING1,
  BUILDING2,
  BUILDING18,
  BUILDING23,
  BUILDING43,
  BUILDING50,
  BUILDING22,
  BUILDING29,
  BUILDING36,
  BUILDING27,
  BUILDING20,
  // BUILDING3,
  // BUILDING4,
  // BUILDING5,
  // BUILDING6,
  // BUILDING7,
  // BUILDING8,
  // BUILDING9,
  // BUILDING10,
  // BUILDING11,
  // BUILDING12,
  // BUILDING13,
  // BUILDING14,
  // BUILDING15,
  // BUILDING16,
  // BUILDING17,
  // BUILDING19,
  // BUILDING21,
  // BUILDING24,
  // BUILDING25,
  // BUILDING26,
  // BUILDING28,
  // BUILDING30,
  // BUILDING31,
  // BUILDING32,
  // BUILDING33,
  // BUILDING34,
  // BUILDING35,
  // BUILDING37,
  // BUILDING38,
  // BUILDING39,
  // BUILDING40,
  // BUILDING41,
  // BUILDING42,
  // BUILDING44,
  // BUILDING45,
  // BUILDING46,
  // BUILDING47,
  // BUILDING48,
  // BUILDING49,
  // BUILDING51,
  // BUILDING52,
  // BUILDING53,
  // BUILDING54,
  // BUILDING55,
  // BUILDING56,
];


export function createConvexPolyhedronFromGeometry(geometry, parent = null) { // a helper function that creates a cannon.js convex polyhedron for a better-fit collider
  let convexVertices = geometry.vertices;
  const options = { skipTriangulation: true };
  let convexFaces = qh(convexVertices, options); // using QuickHull to create a quick convex hull given the list of vertices without triangulation
  let cannonVertices = convexVertices.map((v) => new CANNON.Vec3(v[0], v[1], v[2])); // convert to required datatype.

  // this part is to visualize, debugging only // the convex hull looks good!
  /*const convexGeometry = new Geometry();
  convexGeometry.vertices = convexVertices.map((v) => new Vector3(v[0], v[1], v[2]));
  convexFaces.forEach((face) => {
    // Assuming the face is a triangle
    convexGeometry.faces.push(new Face3(face[0], face[1], face[2]));
  });
  convexGeometry.computeFaceNormals();
  convexGeometry.computeVertexNormals();
  const material = new MeshBasicMaterial({ color: 0xffff00, wireframe: false });
  const mesh = new Mesh(convexGeometry, material);
  parent.add(mesh);*/

  // CRINGE TOOK ME 7 HOURS ON SYNTAX BUG: {cannonVertices, convexFaces} is actually interpreted as {cannonVertices: cannonVertices, convexFaces: convexFaces}. 
  // So, the property names in the object you pass to the constructor don't match the expected vertices and faces properties.
  return new CANNON.ConvexPolyhedron( {vertices: cannonVertices, faces: convexFaces} ); // constructs the convex polyhedron
}

export function extractVerticesAndFacesFromBufferGeometry(bufferGeometry) { // given a loader buffer geometry, outputs the vertices and faces of the mesh following the convention
  // Extract the vertices first, basically the same as geometry.attributes.position.
  const vertices = []; 
  const positionAttribute = bufferGeometry.getAttribute('position');
  for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = [
      positionAttribute.getX(i),
      positionAttribute.getY(i),
      positionAttribute.getZ(i)
    ];
    vertices.push(vertex);
  }
  // Extract the faces next. If the geometry has no index, then a face defined by three consequent vertices, otherwise, by three consequent indices of vertices in index.
  const faces = []; // stores the indices of every face, an array of arrays.
  if (bufferGeometry.index != null) {  // has index
    const indexAttribute = bufferGeometry.getIndex();
    for (let i = 0; i < indexAttribute.count; i += 3) {
      const face = [
        indexAttribute.getX(i),
        indexAttribute.getX(i+1),
        indexAttribute.getX(i+2),
      ];
      faces.push(face);
    }
  }
  else { // no index
    for (let i = 0; i < positionAttribute.count; i += 3) {
      const face = [
        i,
        i+1,
        i+2
      ];
      faces.push(face);
    }
  }
  return { vertices, faces };
}

export function mergeVerticesAndFaces(submeshes) { // given a list of meshes, merge all their vertices and faces together as if they are one big mesh. For convex hulling.
  let mergedVertices = [];
  let mergedFaces = [];
  let vertexOffset = 0;

  for (const submesh of submeshes) {
    const info = extractVerticesAndFacesFromBufferGeometry(submesh.geometry); // extract the verts and faces from the current mesh

    // Add vertices
    mergedVertices.push(...info.vertices);

    // Add faces and update indices
    const updatedFaces = info.faces.map(face => {
      return face.map(index => index + vertexOffset);
    });
    mergedFaces.push(...updatedFaces);

    vertexOffset += info.vertices.length;
  }

  return { vertices: mergedVertices, faces: mergedFaces }; // one big list.
}

class Building extends Group {
  constructor(parent, name, modelUrl = null, dims = null, startingPos, mass, material, breakThreshold = 100,
    linearDamping, angularDamping, fixedRotation, collisionFilterGroup = 0b01000, collisionFilterMask = -1) { // dims is a vec3
    // Call parent Group() constructor
    super();

    // Init state, variable specific to this object. (TODO: tune them later)
    this.state = {
      colliderOffset: new Vector3(0, 0, 0), // manually tuning the offset needed for mesh visualization to match the physical collider
      breakThreshold: breakThreshold, // Set the force threshold for breaking the building // Treat this as buildling's HP
      fracturedPieces: [], // Store fractured pieces' physics bodies and objects
    }

    this.name = name;
    this.parentObj = parent;
    this.health = this.state.breakThreshold;

    if (modelUrl) { // if a model is supplied
      // Load object
      const loader = new GLTFLoader();
      loader.load(modelUrl, (gltf) => {
        // Cache each fractured piece in the file, following the convention
        let mainBuilding = this.traverseAndDefinePieces(gltf.scene.children, startingPos, mass, material, linearDamping, angularDamping, fixedRotation, collisionFilterGroup, collisionFilterMask);
        // Add the main piece (0th 'earliest' piece, following the convention) to the scene.
        // const dimensions = this.calculateModelDimensions(gltf.scene.children[0]); // just a bounding box dim, not as accurate but prob faster. Put dim back if too slow.
        this.initPhysics(parent, null, startingPos, mass, material, linearDamping, angularDamping, fixedRotation, collisionFilterGroup, collisionFilterMask);
        this.originalObj = mainBuilding; // need to put it before the add, otherwise the address points to other stuff since:
        this.add(mainBuilding); // changes the hierarchy of the first child by moving it under the custom script; visualizes it
        this.fractured = false; // starts off intact

        // Add a collision event listener to the building's MAIN physics body
        this.body.addEventListener("collide", this.handleCollision.bind(this));
      });
    } else {
      this.initPhysics(parent, dims, startingPos, mass, material, linearDamping, angularDamping, fixedRotation, collisionFilterGroup, collisionFilterMask);

      // visualizing the custom shape
      const geometry = new BoxGeometry(dims.x, dims.y, dims.z);
      const material = new MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.5,
      });
      this.mesh = new Mesh(geometry, material);
      this.mesh.position.copy(this.body.position);
      parent.add(this.mesh); // Add mesh to Building instance // "this.add" is better for encapsulation, but could have coord offset
    }

    // Add self to parent's update list
    parent.addToUpdateList(this);
  }
  
  calculateModelDimensions(model) { // get the bounding box of the moel
    const box = new Box3().setFromObject(model);
    const size = new Vector3();
    box.getSize(size);
    return size;
  }

  // SIMPLIFICATION: When given a gltf scene, the initial children objects ALL represent the buildling parts.
  // within each object, we account for their collectivity by finding all the meshes in it and visualize/physicalize them as one
  // O(n). Much faster and easier.
  // Input: gltf.scene.children, a list of objects.
  // CONVENTION: if there are >1 children, then first child will ALWAYS be the full mesh, and the rest will be the fractured parts.
  // Otherwise, if there is only 1 child, then that child is the full mesh. (no fractured part). TODO: this part is not implemented yet, no need I think?
  traverseAndDefinePieces(childObjs, startingPos, mass, material, linearDamping, angularDamping, fixedRotation, collisionFilterGroup, collisionFilterMask) {
    // Define the main piece (keeps track of all the meshes in the OG building)
    this.mainmeshes = [];
    let mainBuilding = null;

    // Define the fractured pieces via caching
    for (let i = 0; i < childObjs.length; i++) {
      let childObj = childObjs[i]; // current piece.
      if (!childObj.name.includes("cell")) { // the one main piece, following the convention
        mainBuilding = childObj;
        childObj.traverse((child) => { 
          if (child.isMesh) {
            this.mainmeshes.push(child);
          }
        });
      }
      else {
        const submeshes = []; // meshes within this piece
        childObj.traverse((child) => { // childObj is also included in the traversal. MAYBE???
          if (child.isMesh) {
            submeshes.push(child);
          }
        });
        this.state.fracturedPieces.push(
          {childObj, submeshes, startingPos, mass: 0, material, linearDamping, angularDamping, fixedRotation, collisionFilterGroup, collisionFilterMask} ); // temporary cache
      }
    }

    return mainBuilding;
  }

  initPhysics(parent, dimensions, startingPos, mass, material, linearDamping, angularDamping, fixedRotation, collisionFilterGroup, collisionFilterMask) {
    if (dimensions != null) this.shape = new CANNON.Box(new CANNON.Vec3(dimensions.x / 2, dimensions.y / 2, dimensions.z / 2)); // generating a box collider
    else {
      const info = mergeVerticesAndFaces(this.mainmeshes);
      this.shape = createConvexPolyhedronFromGeometry(info); // generating a convex-hulled, shape-specific collider
    }

    this.body = new CANNON.Body({ // parameter definitions defined at the bottom of this script
      mass: 0, // mass input parameter. Set it to 0 because a building shouldn't be moving anyway.
      shape: this.shape,
      material: material,
      position: startingPos.position,
      quaternion: startingPos.rotation,
      linearDamping: linearDamping,
      angularDamping: angularDamping,
      fixedRotation: fixedRotation,
      collisionFilterGroup: collisionFilterGroup,
      collisionFilterMask: collisionFilterMask,
    });
    this.body.updateMassProperties(); // Need to call this after setting up the parameters.
    parent.bodyIDToString[this.body.id] = "Building";
    // For calculating indiv part mass % based on volume.
    this.mainMass = mass;
    this.mainVolume = this.shape.volume();
    this.totalVolume = 0;

    // Add body to the world (physics world)
    parent.state.world.addBody(this.body);

    // Update Three.js object position to match Cannon.js body position (Two different systems)
    this.position.copy(this.body.position);
    this.position.add(this.state.colliderOffset);
    this.quaternion.copy(this.body.quaternion);
  }

  calculateShapeAndVolume(submeshes) { // Given a set of submeshes, create a convex polyhedron shape and return its shape and volume
    const info = mergeVerticesAndFaces(submeshes);
    const shape = createConvexPolyhedronFromGeometry(info); // object is of type "BufferedGeometry" // generating a convex-hulled, shape-specific collider
    let volume = shape.volume();
    this.totalVolume += volume;
    return { shape, volume };
  }

  initPhysicsForFracturedPiece(parent, object, shape, volume, index, startingPos, additionalMass, material, linearDamping, angularDamping, fixedRotation, collisionFilterGroup, collisionFilterMask) {
    /*// Calculate the dimensions of the object
    const box = new Box3().setFromObject(object);
    const size = new Vector3();
    box.getSize(size);
    // Create a Cannon.js body for the object
    const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));*/ // we use a more precise shape definition now.
    let avgVolume = (this.mainVolume + this.totalVolume) / 2.0;
    let volumeRatio = volume / avgVolume;
    let newMass = volumeRatio * this.mainMass + additionalMass; // weighted by volume, part of main mesh so portion of the mass, plus additional mass for tuning

    const body = new CANNON.Body({
      mass: newMass, // the weighted mass.
      shape: shape,
      material: material,
      position: new Vector3().copy(object.position).add(startingPos.position), // object.position.add(startingPos), either one works
      quaternion: new CANNON.Quaternion().copy(object.quaternion).mult(startingPos.rotation),
      linearDamping: linearDamping,
      angularDamping: angularDamping,
      fixedRotation: fixedRotation,
      collisionFilterGroup: collisionFilterGroup,
      collisionFilterMask: collisionFilterMask,
    });
    body.updateMassProperties();
    parent.bodyIDToString[body.id] = "BuildingPiece";

    // Add the Cannon.js body to the world
    parent.state.world.addBody(body); // Need to call this after setting up the parameters.

    // Set the body to sleep initially, so it doesn't simulate until a collision happens
    // body.sleep();

    // Store the Cannon.js body and the Three.js object for future updates.
    this.state.fracturedPieces[index] = { body, object };
  }

  handleCollision(event) { // the function executed when a collision happens between something and the main physical buildling.
    let waterParticleBody = null;
    if (this.parent.bodyIDToString[event.contact.bi.id] == "WaterParticle") waterParticleBody = event.contact.bi;
    else if (this.parent.bodyIDToString[event.contact.bj.id] == "WaterParticle") waterParticleBody = event.contact.bj;

    if (waterParticleBody != null) { // damage the player (touching seafloor) 
      this.loseHealth(1);
    }

    // console.log(this.health);
    if (this.health <= 0) {
      this.fractured = true;
    }

    // force method, archived for now since we are using water particle hp deduction system.
    /*// Get the impact velocity along the normal
    const impactVelocityAlongNormal = event.contact.getImpactVelocityAlongNormal();
  
    // Calculate the impact force along the normal by multiplying the impact velocity along the normal by the mass of the colliding body
    // assumes the collision is perfectly elastic. In reality, might need to take into account the coefficient of restitution 
    const impactForce = Math.abs(impactVelocityAlongNormal * event.contact.bj.mass);
  
    // If the impact force is above the threshold, break the building
    if (impactForce > this.state.breakThreshold) {
      // console.log("Collision happened");
      this.fractured = true;
    }*/
  }

  breakBuilding(parent) {
    // Wake up and enable simulation for the fractured pieces
    // for (const piece of this.state.fracturedPieces) {
    //  piece.body.wakeUp();
    // }

    // Spawn the fractured pieces
    let shapeAndVolumeCache = [];
    for (let i = 0; i < this.state.fracturedPieces.length; i++) {
      // Calculate and the shape and cumulative volume info for each piece
      let info = this.state.fracturedPieces[i];
      shapeAndVolumeCache[i] = this.calculateShapeAndVolume(info.submeshes);
    }
    for (let i = 0; i < this.state.fracturedPieces.length; i++) {
      // Initialize physics for the fractured piece
      let info = this.state.fracturedPieces[i];
      this.initPhysicsForFracturedPiece(parent, info.childObj, shapeAndVolumeCache[i].shape, shapeAndVolumeCache[i].volume, i, info.startingPos, info.mass, info.material, 
        info.linearDamping, info.angularDamping, info.fixedRotation, info.collisionFilterGroup, info.collisionFilterMask);
      // Initialize visuals
      parent.add(info.childObj); // why parent.add instead of this.add?
      // Overwrite has happened
      let piece = this.state.fracturedPieces[i];
      piece.object.position.copy(piece.body.position);
      piece.object.quaternion.copy(piece.body.quaternion);
    }
  }

  update() {
    if (this.fractured) {
      if (!this.originalDeleted) {
        // Remove the original (unshattered) building. Putting it here because need to wait till previous update is finished else physical update might error
        this.parentObj.state.world.removeBody(this.body); 
        this.remove(this.originalObj);
        // Spawn the new shattered pieces
        this.breakBuilding(this.parentObj);
        this.originalDeleted = true;
      }
      else { // updated fractured pieces visual to match physical
        for (const piece of this.state.fracturedPieces) {
          piece.object.position.copy(piece.body.position);
          piece.object.quaternion.copy(piece.body.quaternion);
        }
      }

    }

    // Update Three.js object position to match Cannon.js body position (Two different systems)
    if (this.body) { // exists only if main body is there
      this.position.copy(this.body.position);
      this.position.add(this.state.colliderOffset);
      this.quaternion.copy(this.body.quaternion);
    }

    if (this.mesh) { // doesn't exist, unless in visualization mode creation.
      this.mesh.position.copy(this.body.position);
      this.mesh.position.add(this.state.colliderOffset);
      this.mesh.quaternion.copy(this.body.quaternion);
    }
  }

  loseHealth(amt = 1, loseHpCooldown = 1) { // building loses health... called for example by collision event between building and water
    if (!this.lastLoseHealthAt) {
        this.health -= amt;
        this.lastLoseHealthAt = this.parentObj.gameTimer.timeElapsedInSeconds();
    }
    else if (this.parentObj.gameTimer.timeElapsedInSeconds() - this.lastLoseHealthAt >= loseHpCooldown) {
        this.health -= amt;
        this.lastLoseHealthAt = this.parentObj.gameTimer.timeElapsedInSeconds();
    }
  }
}


// Children classes below are variations of parent class.
// Default parameters are used for artistic visualization of building looks and placements
// Want to use an actual polished modelUrl model in official release.

// param: parent, modelUrl = null, dims = null, startingPos, mass, material, linearDamping, angularDamping, fixedRotation, collisionFilterGroup, collisionFilterMask, name
// model url - path to the gltf file. Use useModel to decide whether to use model or not.
// dims - vector3 object stating the size dim of the shape (obselete in the presence of a model url, used for quick visualization to help modeling)
// startingPos - Cannon.Vec3 object stating the starting position of the shape
// mass - mass of the object (how heavy). 0 = static and immovable, large and heavy structures typically have high mass value
// friction - how much object slides. For buildings, generally a value between 0.6 to 1.0
// restitution - how much object bounces on contact. For buildings, generally a value between 0.0 to 0.2
// linearDamping - the rate at which the object loses linear velocity due to "air" resistance. For buildings, generally a value between 0.9 to 1.0
// angularDamping - the rate at which the object loses angular velocity. For buildings, generally a value between 0.9 to 1.0
// fixedRotation - should the building rotate due to external forces? Yes or No
// collisionFilterGroup - assigns an object to a specific group, usually done with bits (i.e. each bit mask is a diff group) // TODO: should probably add this property to other objects
// collisionFilterMask - a property that defines which groups an object should collide with, bitwise OR of the groups. -1 means NONE by default.

class Skyscraper extends Building { // An example of how to make a building type
  constructor(parent, useModel, startingPos, buildingMaterial, dimensions = (new Vector3(2, 10, 2)).multiplyScalar(2), mass = 100,
    linearDamping = 0.5, angularDamping = 0.5, fixedRotation = false) {

    super(parent, "skyscraper", useModel ? SKYSCRAPER_MODEL : null, dimensions, startingPos, mass, buildingMaterial, 100,
      linearDamping, angularDamping, fixedRotation);
  }
}

class BuildingI extends Building {
  constructor(parent, useModel, startingPos, buildingMaterial, i, health, mass = 100, dimensions = (new Vector3(2, 10, 2)).multiplyScalar(2), 
    linearDamping = 0.5, angularDamping = 0.5, fixedRotation = false) {

    super(parent, "building" + i, useModel ? BUILDINGS[i] : null, dimensions, startingPos, mass, buildingMaterial, health,
      linearDamping, angularDamping, fixedRotation);
  }
}

export { Skyscraper, BuildingI }; // using named exports, don't forget to update index.js as well.
