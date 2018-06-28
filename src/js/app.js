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



  var refTexture = new BABYLON.Texture("./assets/textures/pan.png", scene);
  refTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
  refTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

  var mainTexture = new BABYLON.Texture("./assets/textures/pan.png", scene);

  let material = createShaderMaterial(scene, mainCamera, 'basic', mainTexture, refTexture)
  let materialPhong = createShaderMaterial(scene, mainCamera, 'phong', mainTexture, refTexture)


  let background_material = createShaderMaterial(scene, mainCamera, 'exp')

  let boxPos = {x: 0, y: 0, z: 10}
  let boxSize = {width: 20, height: 10, depth: 1}
  let bx = createBox(scene, boxPos, boxSize)
  bx.material = background_material;






  // refTexture = new BABYLON.Texture("./assets/textures/pan.png", scene);
  // refTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
  // refTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

  // mainTexture = new BABYLON.Texture("./assets/textures/pan.png", scene);

  // let spsMaterial = createShaderMaterial(scene, mainCamera, 'circleRotate', mainTexture, refTexture, light)
  // let sps = solidParticleSistem(scene, spsMaterial, createRibbon(scene), mainCamera, engine)




  let fpsLable = document.getElementById('fps')
  let time = 0

  /////////
  ////////
  engine.runRenderLoop(function () {
    fpsLable.innerHTML = Math.ceil(engine.getFps())

    if (scene) {
      background_material.setFloat("time", time)
      // material.setFloat("time", time);
      // materialPhong.setFloat("time", time);
      // sps.setParticles()
      time += 0.01;

      // material.setVector3("cameraPosition", mainCamera.position);

      for (let i = 0; i < heads.length; i++) {
        // heads[i].rotation.y += 0.004
        heads[i].position.x = (i - (range/100 * (heads.length - 1))) * headWidth
        heads[i].position.z = Math.abs(heads[i].position.x * 2) - 2.6
      }
      scene.render();
    }
  })






  const onLoadSuccess = (task) => {
    let head = task.loadedMeshes[0]
    head.position = V3.Zero()
    // head.rotation.y -= 0.8
    head.material = materialPhong
    head.receiveShadows = true
    head.position.y = -6.6
    // head.position.z = -2.2
    let size = {width: 2, height: 1, depth: 4}


    head.addLODLevel(80, createBox(scene, head.rotation, size))


    heads.push(task.loadedMeshes[0])
  }

  const onLoadError = (task) => {
    console.log("error while loading " + task.name);
  }

  for (let i = 0; i < 1; i++) {
    ImportMesh(scene, 'head2.babylon', onLoadSuccess, onLoadError)
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
