import $ from 'jquery'
import {createCamera, addLight, addGodRay, addShadows, createSphere, createBox, ImportMesh, particleSistem, addFog, createShaderMaterial} from './mod'
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

  let lightPos = new BABYLON.Vector3(-5, 6, -20)
  let rayPos = new BABYLON.Vector3(0, 10, 20)
  let lightScale = new BABYLON.Vector3(50, 80, 50)
  let light = addLight(scene, lightPos)
  
  // addGodRay(scene, rayPos, lightScale, mainCamera, engine)
  // let shadows = addShadows(light)

  let spherePos = lightPos
  let sphere0 = createSphere(scene, spherePos)


  let boxPos = new BABYLON.Vector3(0, 5, -10)

  let material = createShaderMaterial()



  // let bx = createBox(scene, boxPos)

  // var amigaMaterial = new BABYLON.ShaderMaterial("amiga", scene, {
  //   vertexElement: "vertexShaderCode",
  //   fragmentElement: "fragmentShaderCode",
  // },
  // {
  //     attributes: ["position", "uv"],
  //     uniforms: ["worldViewProjection"]
  // });
  // amigaMaterial.setTexture("textureSampler", new BABYLON.Texture("./assets/textures/pan.png", scene));

  // bx.material = material;

  // shadows.getShadowMap().renderList.push(bx)

    // // // Fog
    // scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    // scene.fogDensity = 0.02
    // scene.fogStart = 1;
    // scene.fogEnd = 100;
    // scene.fogColor = new BABYLON.Color3(0, 0, 0.01);



  const onLoadSuccess = (task) => {
    let head = task.loadedMeshes[0]
    head.position = BABYLON.Vector3.Zero()
    head.rotation.y -= 0.8
    head.receiveShadows = true

    task.loadedMeshes[0].addLODLevel(120, createBox(scene, boxPos));
    // shadows.getShadowMap().renderList.push(task.loadedMeshes[0])
    task.loadedMeshes[0].material = material;

    // head.material.emissiveColor = BABYLON.Color3.Yellow();
    heads.push(task.loadedMeshes[0])

  }

  const onLoadError = (task) => {
    console.log("error while loading " + task.name);
  }


  var time = 0;

  /////////
  ////////
  engine.runRenderLoop(function () {
    if (scene) {
      material.setFloat("time", time);
      time += 0.04;

      material.setVector3("cameraPosition", scene.activeCamera.position);

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

  // let ps = particleSistem(scene)
  // let fog = addFog(scene)



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
