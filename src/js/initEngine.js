import {Engine, Scene, CannonJSPlugin} from 'babylonjs'

import * as OIMO from '../../node_modules/babylonjs/Oimo'

const initEngine = () => {
  
  var canvas = document.getElementById("render-canvas");
  var engine = new Engine(canvas, true);
  
  var scene = new Scene(engine); 
  console.log(OIMO);
  

  

  engine.runRenderLoop(function () {
    if (scene) {
      scene.render();
    }
  })

  return scene
}

export {initEngine}