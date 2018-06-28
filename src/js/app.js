import $ from 'jquery'

import {
  createCamera, 
  addLight, 
  addGodRay, 
  addShadows, 
  createSphere, 
  createBox, 
  createRibbon,
  ImportMesh
} from './mod'

import {
  particleSistem, 
  solidParticleSistem, 
  addFog
} from './particleSistems'

import {
  createShaderMaterial
} from './materials'

import{initEngine} from './initEngine'
 


$(document).ready(()=>{
  let V3 = BABYLON.Vector3

  BABYLON.Animation.AllowMatricesInterpolation = true;

  let [engine, scene] = initEngine()
  let heads = []
  let selectedHead = 1
  let headWidth = 12
  let range = 0

<<<<<<< HEAD
  scene.enablePhysics(new V3(0,-9.81, 0), new BABYLON.OimoJSPlugin());
=======
  let cameraPos = new V3(0, 2, -30)
  let mainCamera = createCamera(scene, cameraPos)

  let lightPos = new V3(-5, 6, -20)
  let rayPos = new V3(0, 10, 20)
  let light = addLight(scene, lightPos)
  
  
  // let lightScale = new V3(50, 80, 50)
  // addGodRay(scene, rayPos, lightScale, mainCamera, engine)
  // let shadows = addShadows(light)
  // shadows.getShadowMap().renderList.push(bx)
  // box.receiveShadows = true

  let spherePos = lightPos
  let sphere0 = createSphere(scene, spherePos)



  var refTexture = new BABYLON.Texture("./assets/textures/pan.png", scene);
  refTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
  refTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

  var mainTexture = new BABYLON.Texture("./assets/textures/pan.png", scene);

  let material = createShaderMaterial(scene, mainCamera, 'basic', mainTexture, refTexture)
  let materialPhong = createShaderMaterial(scene, mainCamera, 'phong', mainTexture, refTexture)

  let boxPos = {x: 0, y: 0, z: -10}
  let boxSize = {width: 1, height: 1, depth: 1}
  let bx = createBox(scene, boxPos, boxSize)
  bx.material = material;




  const onLoadSuccess = (task) => {
    let head = task.loadedMeshes[0]
    head.position = V3.Zero()
    // head.rotation.y -= 0.8
    head.material = materialPhong
    head.receiveShadows = true
    let size = {width: 200, height: 400, depth: 150}

    head.addLODLevel(150, createBox(scene, head.rotation, size))


    heads.push(task.loadedMeshes[0])
  }
>>>>>>> parent of 59c878a... sh texture

  let cameraPos = new V3(0, 2, -30)
  let camera = createCamera(scene, cameraPos)
  camera.alpha -= 0.6
  camera.beta -= 0.6

  var materialPlane = new BABYLON.StandardMaterial("solid", scene);
  // materialPlane.diffuseTexture = new BABYLON.Texture('./assets/textures/pan.png', scene);
	// materialPlane.emissiveTexture = new BABYLON.Texture(sURL, scene);
	// materialPlane.emissiveTexture = new BABYLON.Texture('./assets/textures/pan.png', scene);
	materialPlane.useAlphaFromDiffuseTexture
	materialPlane.specularColor = new BABYLON.Color3(1, 0, 0);
	materialPlane.backFaceCulling = true;//Allways show the front and the back of an element
	// materialPlane.emissiveTexture.level = 0.1;  // powerfulness 


  let lightPos = new V3(-5, 8, -10)
  let light = addLight(scene, lightPos)
  let shadows = addShadows(light)

  let ground = createBox(scene, new V3(0, -0.4, 0), {width: 20, height: 0.4, depth: 20})
  ground.material = materialPlane
  ground.receiveShadows = true
	ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.2 }, scene);


  let bx = createBox(scene, new V3(0, 2, 0), {width: 2, height: 1, depth: 2})
  shadows.addShadowCaster(bx);
  // bx.receiveShadows = true
	bx.physicsImpostor = new BABYLON.PhysicsImpostor(bx, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 2, restitution: 0.2 }, scene);
  

<<<<<<< HEAD
  let body = createBox(scene, new V3(0, 5, 0), {width: 3, height: 1, depth: 1})
  shadows.addShadowCaster(body);
	body.physicsImpostor = new BABYLON.PhysicsImpostor(body, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 2, restitution: 0.2 }, scene);
	

  
	var distanceJoint = new BABYLON.DistanceJoint({ maxDistance: 6, distance: 2});
  bx.physicsImpostor.addJoint(body.physicsImpostor, distanceJoint);
  body.physicsImpostor.addJoint(bx.physicsImpostor, distanceJoint);
  
  
  // let lightScale = new V3(50, 80, 50)

=======
  refTexture = new BABYLON.Texture("./assets/textures/pan.png", scene);
  refTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
  refTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

  mainTexture = new BABYLON.Texture("./assets/textures/pan.png", scene);

  let spsMaterial = createShaderMaterial(scene, mainCamera, 'circleRotate', mainTexture, refTexture, light)
  let sps = solidParticleSistem(scene, spsMaterial, createRibbon(scene), mainCamera, engine)
>>>>>>> parent of 59c878a... sh texture




  let fpsLable = document.getElementById('fps')
  let time = 0

  /////////
  ////////
  engine.runRenderLoop(function () {
    fpsLable.innerHTML = Math.ceil(engine.getFps())
<<<<<<< HEAD
    // bx.position = new V3(scene.pointerX, scene.pointerY, 0)
    time += 0.01
=======
    bx.position = new V3(scene.pointerX, scene.pointerY, 0)

>>>>>>> parent of 59c878a... sh texture
    if (scene) {
      material.setFloat("time", time);
      materialPhong.setFloat("time", time);
      sps.setParticles()
      time += 0.04;

      material.setVector3("cameraPosition", mainCamera.position);

      for (let i = 0; i < heads.length; i++) {
        // heads[i].rotation.y += 0.004
        heads[i].position.x = (i - (range/100 * (heads.length - 1))) * headWidth
        heads[i].position.z = Math.abs(heads[i].position.x * 2)
      }
      scene.render();
    }
  })
<<<<<<< HEAD
=======

  for (let i = 0; i < 3; i++) {
    ImportMesh(scene, '3d.babylon', onLoadSuccess, onLoadError)
  }
  

  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");
  output.innerHTML = slider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
      output.innerHTML = Math.ceil(this.value/100 * (heads.length - 1) * 10) / 10 + 1
      range = this.value
  }
>>>>>>> parent of 59c878a... sh texture
})
