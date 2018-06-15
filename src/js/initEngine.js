import {Engine, Scene, SceneLoader} from 'babylonjs'
import {createCamera, addLight, createSphere} from './mod'

const initEngine = () => {
  
  var canvas = document.getElementById("render-canvas");
  let scenePath = './assets/3d/3d.babylon'
  var engine = new Engine(canvas, true);
  
  var scene = new Scene(engine);   

  engine.runRenderLoop(function () {
    if (scene) {
      scene.render();
    }
  })

  window.addEventListener("resize", function () {
    engine.resize();
  });

  // here the doc for Load function: http://doc.babylonjs.com/api/classes/babylon.sceneloader#load
//   BABYLON.SceneLoader.Load("", scenePath, engine, function (scene) {

//     //as this .babylon example hasn't camera in it, we have to create one
//     var camera = new BABYLON.ArcRotateCamera("Camera", 212, 211, 241, BABYLON.Vector3.Zero(), scene);
//     camera.attachControl(canvas, false);

//     scene.clearColor = new BABYLON.Color3(1, 1, 1);
//     scene.ambientColor = new BABYLON.Color3.White;
// });



  return [engine, scene]
}



export {initEngine}