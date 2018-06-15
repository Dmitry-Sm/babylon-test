import {FreeCamera, Vector3, HemisphericLight, Mesh} from 'babylonjs'


const check = (scene) => {
 
  // This creates and positions a free camera (non-mesh)
  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  // camera.attachControl(canvas, true);

  const initLight = () => {
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    let i = 0
    var timerId = setInterval(function() {
      i += 0.04
      if (i > 10000)
        i = 0
  
        light.intensity = 0.6 + Math.sin (i)/6;
    }, 20);
  }
  initLight()

  const createSphere = () => {
    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 0.4, scene);
    sphere.position.y = 2;
    sphere.position.z = -6;
    let i = 0
    let v = sphere.position
    var timerId = setInterval(function() {
      i += 0.001
      if (i > 10000)
        i = 0
        // sphere.position.x = i
    }, 50);

    //let ballPh = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, { mass: 1 }, scene)
    //sphere.physicsImpostor = ballPh
    
  }

  createSphere()


  // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
  var ground = BABYLON.Mesh.CreateGround("ground1", 8, 12, 2, scene);
  

  



  const initControle = () => {
    var onPointerDown = function (evt) {
      if (evt.button !== 0) {
          return;
      }

      // check if we are under a mesh
      var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
      if (pickInfo.hit) {
          currentMesh = pickInfo.pickedMesh;
          startingPoint = getGroundPosition(evt);

          if (startingPoint) { // we need to disconnect camera from canvas
              setTimeout(function () {
                  camera.detachControl(canvas);
              }, 0);
          }
      }
  }

  var onPointerUp = function () {
      if (startingPoint) {
          camera.attachControl(canvas, true);
          startingPoint = null;
          return;
      }
  }

  var onPointerMove = function (evt) {
      if (!startingPoint) {
          return;
      }

      var current = getGroundPosition(evt);

      if (!current) {
          return;
      }

      var diff = current.subtract(startingPoint);
      currentMesh.position.addInPlace(diff);

      startingPoint = current;

  }

  canvas.addEventListener("pointerdown", onPointerDown, false);
  canvas.addEventListener("pointerup", onPointerUp, false);
  canvas.addEventListener("pointermove", onPointerMove, false);
  }

}

export {check}