import $ from 'jquery'
import {check} from './mod'
import{initEngine} from './initEngine'
 

$(document).ready(()=>{
  let str = `window location ${window.location}`
  console.log(str)


  let scene = initEngine()
  check(scene)
});


