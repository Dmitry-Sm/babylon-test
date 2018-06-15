import $ from 'jquery'
import {createCamera, addLight, addShadow, createSphere, ImportMesh} from './mod'
import{initEngine} from './initEngine'
 

$(document).ready(()=>{
  let str = `window location ${window.location}`
  console.log(str)


  let [engine, scene] = initEngine()

  BABYLON.Animation.AllowMatricesInterpolation = true;

  let radius = 30
  let mainCamera = createCamera(scene, radius)

  let lightPos = new BABYLON.Vector3(-30, 20, -30)
  let pLight = addLight(scene, lightPos)
  addShadow(pLight)

  let spherePos = new BABYLON.Vector3(0, 0, 0)
  let sphere = createSphere(scene, spherePos)

  ImportMesh(scene)
});


