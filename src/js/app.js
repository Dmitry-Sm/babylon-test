import $ from 'jquery'
import {createCamera, addLight, addShadows, createSphere, createBox, ImportMesh, particleSistem} from './mod'
import{initEngine} from './initEngine'
 

$(document).ready(()=>{
  BABYLON.Animation.AllowMatricesInterpolation = true;

  let [engine, scene] = initEngine()
  let heads = []
  let selectedHead = 1
  let headWidth = 12
  let range = 0

  let cameraPos = new BABYLON.Vector3(0, 2, -30)
  let mainCamera = createCamera(scene, cameraPos)

  let lightPos = new BABYLON.Vector3(-1, 7, -10)
  let pLight = addLight(scene, lightPos)
  let shadows = addShadows(pLight)

  // let spherePos = lightPos
  // let sphere0 = createSphere(scene, spherePos)


  let boxPos = new BABYLON.Vector3(0, 4, -7)
  let bx = createBox(scene, boxPos)

  shadows.getShadowMap().renderList.push(bx)





  const onLoadSuccess = (task) => {
    let head = task.loadedMeshes[0]
    head.position = BABYLON.Vector3.Zero()
    head.rotation.y -= 0.8
    head.receiveShadows = true
    // shadows.getShadowMap().renderList.push(task.loadedMeshes[0])

    // head.material.emissiveColor = BABYLON.Color3.Yellow();
    heads.push(task.loadedMeshes[0])

  }

  const onLoadError = (task) => {
    console.log("error while loading " + task.name);
  }

  /////////
  ////////
  engine.runRenderLoop(function () {
    if (scene) {
      for (let i = 0; i < heads.length; i++) {
        // heads[i].rotation.y += 0.004
        heads[i].position.x = (i - (range/100 * (heads.length - 1))) * headWidth
        heads[i].position.z = Math.abs(heads[i].position.x * 2)

        heads[i].rotation.y = - 0.8 - heads[i].position.x/40
      }
      scene.render();
    }
  })

  ImportMesh(scene, '3d.babylon', onLoadSuccess, onLoadError)
  ImportMesh(scene, '3d.babylon', onLoadSuccess, onLoadError)
  ImportMesh(scene, '3d.babylon', onLoadSuccess, onLoadError)

  // let ps = particleSistem(scene, emitter)
  



// r / 50 == r / 100 * 2



  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");
  output.innerHTML = slider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
      output.innerHTML = Math.ceil(this.value/100 * (heads.length - 1) * 10) / 10 + 1
      range = this.value
  }
})
