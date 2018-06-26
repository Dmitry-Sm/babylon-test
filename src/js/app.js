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



  var refTexture = new BABYLON.Texture("./assets/textures/ref.jpg", scene);
  refTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
  refTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

  var mainTexture = new BABYLON.Texture("./assets/textures/pan.png", scene);
  let material = createShaderMaterial(scene, mainCamera, 'basic', mainTexture, refTexture, false)

  mainTexture = new BABYLON.Texture("./assets/textures/pan.png", scene);
  let materialPhong = createShaderMaterial(scene, mainCamera, 'phong', mainTexture, refTexture, false)

  let boxPos = {x: 0, y: 0, z: -10}
  let boxSize = {width: 1, height: 1, depth: 1}
  // let bx = createBox(scene, boxPos, boxSize)
  // bx.material = material;




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






  const onLoadError = (task) => {
    console.log("error while loading " + task.name);
  }


  refTexture = new BABYLON.Texture("./assets/textures/flare.png", scene);
  refTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
  refTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

  mainTexture = new BABYLON.Texture("./assets/textures/line2.png", scene);

  let spsMaterial = createShaderMaterial(scene, mainCamera, 'circleRotate', mainTexture, refTexture, true)
  let sps = solidParticleSistem(scene, spsMaterial, createRibbon(scene), mainCamera, engine)

  var time = 0;


  console.log(engine);
  console.log(scene);

  let fpsLable = document.getElementById('fps')

  /////////
  ////////
  engine.runRenderLoop(function () {
    fpsLable.innerHTML = Math.ceil(engine.getFps())
    // bx.position = new V3(scene.pointerX, scene.pointerY, 0)

    if (scene) {
      material.setFloat("time", time);
      sps.setParticles()
      time += 0.04;

      material.setVector3("cameraPosition", mainCamera.position);

      for (let i = 0; i < heads.length; i++) {
        // heads[i].rotation.y += 0.004
        heads[i].position.x = (i - (range/100 * (heads.length - 1))) * headWidth
        heads[i].position.z = Math.abs(heads[i].position.x * 2)

        heads[i].rotation.y = - 0.8 - heads[i].position.x/40
      }
      scene.render();
    }
  })

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
})
