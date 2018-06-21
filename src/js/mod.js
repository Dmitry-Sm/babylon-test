import {
    FreeCamera,
    Vector3,
    HemisphericLight,
    Mesh
} from 'babylonjs'


const check = (scene) => {

    //   // This creates and positions a free camera (non-mesh)
    //   var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    //   // This targets the camera to scene origin
    //   camera.setTarget(BABYLON.Vector3.Zero());

    //   // This attaches the camera to the canvas
    //   // camera.attachControl(canvas, true);

    const initLight = () => {
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        let i = 0
        var timerId = setInterval(function () {
            i += 0.04
            if (i > 10000)
                i = 0

            light.intensity = 0.6 + Math.sin(i) / 6;
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
        var timerId = setInterval(function () {
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

    //   const initControle = () => {
    //     var onPointerDown = function (evt) {
    //       if (evt.button !== 0) {
    //           return;
    //       }

    //       // check if we are under a mesh
    //       var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
    //       if (pickInfo.hit) {
    //           currentMesh = pickInfo.pickedMesh;
    //           startingPoint = getGroundPosition(evt);

    //           if (startingPoint) { // we need to disconnect camera from canvas
    //               setTimeout(function () {
    //                   camera.detachControl(canvas);
    //               }, 0);
    //           }
    //       }
    //   }

    //   var onPointerUp = function () {
    //       if (startingPoint) {
    //           camera.attachControl(canvas, true);
    //           startingPoint = null;
    //           return;
    //       }
    //   }

    //   var onPointerMove = function (evt) {
    //       if (!startingPoint) {
    //           return;
    //       }

    //       var current = getGroundPosition(evt);

    //       if (!current) {
    //           return;
    //       }

    //       var diff = current.subtract(startingPoint);
    //       currentMesh.position.addInPlace(diff);

    //       startingPoint = current;

    //   }

    //   canvas.addEventListener("pointerdown", onPointerDown, false);
    //   canvas.addEventListener("pointerup", onPointerUp, false);
    //   canvas.addEventListener("pointermove", onPointerMove, false);
    //   }

}


const createCamera = (scene, position) => {
    let v0 = BABYLON.Vector3.Zero()
    let pos = new BABYLON.Vector3(0, 0, -30)
    let radius = 30
    // let camera = new BABYLON.FreeCamera("camera1", position, scene);
    // camera.setTarget(v0)

    var camera = new BABYLON.ArcRotateCamera("Camera",  -Math.PI/2, Math.PI/2, radius, v0, scene)
    // var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI * 1.25, Math.PI/2, radius, v0, scene)

    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 260;
    camera.wheelDeltaPercentage = 0.05;

    camera.attachControl(document.getElementById("render-canvas"), false)
    return camera
}


const addLight = (scene, position) => {
    var light = new BABYLON.PointLight("light1", position, scene);
    light.intensity = 1.2;
    light.range = 120

    return light
}


const addGodRay = (scene, position, scale, camera, engine) => {
	var godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1, camera, null, 120, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, engine, false);

	godrays.mesh.material.diffuseTexture = new BABYLON.Texture('assets/textures/sun2.png', scene, true, false, BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
	godrays.mesh.material.diffuseTexture.hasAlpha = true;
	godrays.mesh.position =  position
	godrays.mesh.scaling = scale

    return godrays
}


const addShadows = (light) => {
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
	shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.useKernelBlur = true;
    shadowGenerator.blurKernel = 64;
    

    shadowGenerator.setDarkness(0.3);
    return shadowGenerator
}


const createBox = (scene, position, size = {width: 4, height: 1, depth: 1}) => {
    // box.receiveShadows = true
    
    var box = BABYLON.MeshBuilder.CreateBox('sphere1', size, scene);
    box.position = position

    return box
}


const createRibbon = (scene) => {
	var exponentialPath = function (p) {
		var path = [];
		for (var i = -1; i < 1; i++) {
			path.push(new BABYLON.Vector3(i, 0, p/20));
		}
		return path;
    }
    
	var arrayOfPaths = [];
	for (var p = 0; p < 20; p++) {
		arrayOfPaths[p] = exponentialPath(p);
    }
    
    var ribbon = BABYLON.Mesh.CreateRibbon("ribbon", arrayOfPaths, false, false, 0, scene, true, BABYLON.Mesh.DOUBLESIDE);

    return ribbon
}


const createSphere = (scene, position) => {
    let segments = 16,
        diametr = 2
    var sphere = BABYLON.Mesh.CreateSphere('sphere', segments, diametr, scene);
    sphere.position = position
}


const ImportMesh = (scene, fileName, onSuccess, onError, onProgress) => {
    let assetsManager = new BABYLON.AssetsManager(scene);

    let meshTask = assetsManager.addMeshTask(fileName, '', './assets/3d/', fileName)
    
    meshTask.onSuccess = onSuccess
    assetsManager.onTaskError = onError
    assetsManager.useDefaultLoadingScreen = false;


    assetsManager.load();
    return meshTask
}


const particleSistem = (scene) => {
    var particleSystem = new BABYLON.GPUParticleSystem("particles", 25000, scene);

    //Texture of each particle
    let txtr = new BABYLON.Texture("assets/textures/flare.png", scene);
    txtr.uScale = 0.1;
    txtr.vScale = 16;
    particleSystem.particleTexture = txtr

    // Where the particles come from
    // particleSystem.emitter = emitter.position
    particleSystem.emitter = new BABYLON.Vector3(0, 0, -10)
    particleSystem.minEmitBox = new BABYLON.Vector3(30, -20, 10); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(-30, -20, 10); // To...

    // Colors of all particles
    // particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    // particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    // particleSystem.colorDead = new BABYLON.Color4(0.1, 0, 0, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.4;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.1;
    particleSystem.maxLifeTime = 2;

    // Emission rate
    particleSystem.emitRate = 24500;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, 40, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(0, 5, 25);
    particleSystem.direction2 = new BABYLON.Vector3(0, 5, 25);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = 0;

    // Speed
    particleSystem.minEmitPower = 1.8;
    particleSystem.maxEmitPower = 2;
    particleSystem.updateSpeed = 0.004;

    // Start the particle system
    particleSystem.start();

    return particleSystem
}


const solidParticleSistem = (scene, material) => {
    var sps = new BABYLON.SolidParticleSystem("sps", scene);
    var model = createRibbon(scene)
    model.material = material
    sps.addShape(model, 100);
    sps.buildMesh();
    var particles = sps.mesh
    particles.material = material
    

    var particleHeight = 4;

    // sps.computeParticleTexture = false

    var areaSize = 2.0;
    
    var initParticle = function(particle) {
        
        particle.position.x = 40 * areaSize * (Math.random() - 0.5);
        particle.position.y = -10;
        particle.position.z = 0;
            
        particle.pivot.y = 10;
        particle.rotation.x = Math.random() * Math.PI * 2;
        particle.material = material

        // particle.rotation.x = 6.28 * Math.random();

        // particle.rotation.x = 6.28 * Math.random();
        // particle.rotation.y = 6.28 * Math.random();
        // particle.rotation.z = 6.28 * Math.random();

        // particle.scale.x = particleWidth;
        // particle.scale.y = particleWidth;
        particle.scale.z = particleHeight;
        // particle.velocity = 10000;
        
        // particle.scaling.scaleInPlace(particleSize);

        // if (particle.idx >= half) {
        //     var p0 = sps.particles[particle.idx - half];
        //     particle.pivot.x = 1.5 * particleSize;
        //     particle.pivot.y = particle.pivot.x;
        //     particle.position.copyFrom(p0.position);
        //     particle.scaling.scaleInPlace(particleSize * 0.1);
        //     particle.translateFromPivot = true;
        // }
    }

    var updateParticle = function(particle) {
        // particle.velocity--;
        particle.rotation.x -= 0.014;

        if (particle.velocity < 0) {
          particle.alive = false;
          SPS.recycleParticle(particle);    // call to your own recycle function
        }

    }
    model.dispose()

    sps.updateParticle = initParticle;
    sps.setParticles();
    // sps.computeParticleColor = false

    sps.updateParticle = updateParticle;

    return sps
}


const addFog = (scene) => {
    let particleSystem
    var fogTexture = new BABYLON.Texture("./assets/textures/smoke.png", scene);

    if (particleSystem) {
        particleSystem.dispose();
    }

    if (BABYLON.GPUParticleSystem.IsSupported) {
        // particleSystem = new BABYLON.GPUParticleSystem("particles", { capacity: 10000 }, scene);
        // particleSystem.activeParticleCount = 5000;
        // particleSystem.manualEmitCount = particleSystem.activeParticleCount;
        // particleSystem.minEmitBox = new BABYLON.Vector3(-50, 2, -50); // Starting all from
        // particleSystem.maxEmitBox = new BABYLON.Vector3(50, 2, 50); // To..

        particleSystem = new BABYLON.ParticleSystem("particles", 800 , scene);
        particleSystem.manualEmitCount = particleSystem.getCapacity();
        particleSystem.minEmitBox = new BABYLON.Vector3(-25, 2, -25); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(25, 2, 25); // To...
    }

    particleSystem.particleTexture = fogTexture.clone();
    particleSystem.emitter = new BABYLON.Vector3(0, -5, 0)
    particleSystem.minEmitBox = new BABYLON.Vector3(40, 30, 40)
    particleSystem.maxEmitBox = new BABYLON.Vector3(-40, -20, 0)

    particleSystem.color1 = new BABYLON.Color4(0.8, 0.8, 0.8, 0.1);
    particleSystem.color2 = new BABYLON.Color4(.95, .95, .95, 0.25);
    // particleSystem.colorDead = new BABYLON.Color4(0.9, 0.9, 0.9, 0.1);
    particleSystem.minSize = 5;
    particleSystem.maxSize = 15;
    particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;
    particleSystem.emitRate = 200;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
    particleSystem.direction1 = new BABYLON.Vector3(0, 0.2, 0);
    particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0);
    particleSystem.minAngularSpeed = -2;
    particleSystem.maxAngularSpeed = 2;
    particleSystem.minEmitPower = .5;
    particleSystem.maxEmitPower = 1;
    particleSystem.updateSpeed = 0.005;

    particleSystem.start();
}


const createShaderMaterial = (scene, camera) => {

    BABYLON.Effect.ShadersStore["customVertexShader"]=                "precision highp float;\r\n"+

    "// Attributes\r\n"+
    "attribute vec3 position;\r\n"+
    "attribute vec3 normal;\r\n"+
    "attribute vec2 uv;\r\n"+

    "// Uniforms\r\n"+
    "uniform mat4 worldViewProjection;\r\n"+
    "uniform float time;\r\n"+

    "// Varying\r\n"+
    "varying vec4 vPosition;\r\n"+
    "varying vec3 vNormal;\r\n"+
    "varying vec2 vUV;\r\n"+

    "void main() {\r\n"+
    "    vec3 v = position;\r\n"+
    "    vec3 pos = position;\r\n"+
    "    v.y = sin( atan( position.y, position.z) * 1.) * 100. + 82.;\r\n"+
    "    v.z = cos( atan( position.y, position.z) * 1.) * 100. + 25.;\r\n"+
    // "    v.y = sin( pos.z * 1. + time * 2.) * 1.;\r\n"+

    "    vec4 p = vec4( v, 1. );\r\n"+

    "    gl_Position = worldViewProjection * p;\r\n"+

    // "    vPosition = p;\r\n"+
    // "    vNormal = normal;\r\n"+
    // "    vUV = uv;\r\n"+

    "}\r\n";

    BABYLON.Effect.ShadersStore["customFragmentShader"]=                "precision highp float;\r\n"+

    "uniform mat4 worldView;\r\n"+
    "uniform mat4 world;\r\n"+
    
    "varying vec4 vPosition;\r\n"+
    "varying vec3 vNormal;\r\n"+
    "varying vec2 vUV;\r\n"+
    "uniform float time;\r\n"+

    "uniform vec3 cameraPosition;\r\n"+
    "uniform sampler2D textureSampler;\r\n"+
    "uniform sampler2D refSampler;\r\n"+

    "void main(void) {\r\n"+
    "    vec3 vLightPosition = vec3(0,8,-20);\r\n"+
    

    "    vec3 vPositionW = vec3(0, 10.,-20);\r\n"+
    "    vec3 vNormalW = normalize(vec3(world * vec4(vNormal, 0.0)));\r\n"+
    "    vec3 viewDirectionW = normalize(cameraPosition - vPositionW);\r\n"+

    "    vec3 e = normalize( vec3( worldView * vPosition ) );\r\n"+
    "    vec3 n = normalize( worldView * vec4(vNormal, 0.0) ).xyz;\r\n"+
    "    // Light\r\n"+
    "    vec3 lightVectorW = normalize(vPositionW);\r\n"+
    "    vec3 color = texture2D(textureSampler, vUV).rgb;\r\n"+

    "    // Specular\r\n"+
    "    vec3 angleW = normalize(viewDirectionW + lightVectorW);\r\n"+
    "    float specComp = max(0., dot(vNormalW, angleW));\r\n"+
    "    specComp = pow(specComp, max(1., 64.)) * 2.;\r\n"+

    "    vec3 r = reflect( e, n );\r\n"+
    "    float m = 2. * sqrt(\r\n"+
    "        pow( r.x, 2. ) +\r\n"+
    "        pow( r.y, 2. ) +\r\n"+
    "        pow( r.z + 1., 2. )\r\n"+
    "    );\r\n"+
    "    vec2 vN = r.xy / m + .5;\r\n"+

    "    vec3 base = texture2D( refSampler, vN).rgb;\r\n"+

    // "    gl_FragColor = vec4( base, 1. );\r\n"+
    "    gl_FragColor = vec4( base + vec3(specComp), 1. );\r\n"+
    "}\r\n";

    // Compile
    var shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, {
        vertex: "custom",
        fragment: "custom",
    },
        {
            attributes: ["position", "normal", "uv"],
            uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
        });

    var refTexture = new BABYLON.Texture("./assets/textures/pan.png", scene);
    refTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
    refTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;

    var mainTexture = new BABYLON.Texture("./assets/textures/amiga.jpg", scene);

    shaderMaterial.setTexture("textureSampler", mainTexture);
    shaderMaterial.setTexture("refSampler", refTexture);
    shaderMaterial.setFloat("time", 0.1);
    shaderMaterial.setVector3("cameraPosition", camera.position);
    shaderMaterial.backFaceCulling = false;

    return shaderMaterial
}


export {
    createCamera,
    addLight,
    addGodRay,
    addShadows,
    createSphere,
    createBox,
    createRibbon,
    ImportMesh,
    particleSistem,
    solidParticleSistem,
    addFog,
    createShaderMaterial
}