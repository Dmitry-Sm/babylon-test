precision mediump float;

#extension GL_OES_standard_derivatives : enable


// Varying
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
varying vec2 surfacePosition;

// Uniforms
uniform float time;
uniform vec2 resolution;
uniform mat4 world;
uniform vec3 cameraPosition;
uniform sampler2D textureSampler;


float ltime;



float noise(vec2 p)
{
  return sin(p.x*30.) * sin(p.y*(3. + sin(ltime/80.))) + .2; 
}

mat2 rotate(float angle)
{
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float fbm(vec2 p)
{
  p *= 1.1;
  float f = 0.;
  float amp = .5;
  for( int i = 0; i < 3; i++) {
    mat2 modify = rotate(ltime/50. * float(i*i));
    f += amp*noise(p);
    p = modify * p;
    p *= 2.;
    amp /= 2.2;
  }
  return f;
}


vec3 hsv2rgb(vec3 c)
{
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float pattern(vec2 p, out vec2 q, out vec2 r) 
{
  q = vec2( fbm(p + vec2(1.)),
	    fbm(rotate(.1*ltime)*p + vec2(3.)));
  r = vec2( fbm(rotate(.2)*q + vec2(0.)),
	    fbm(q + vec2(0.)));
  return fbm(p + 1.*r);
}

float pattern(vec2 uv) {
	return sin(3. * time  + 10. * length(uv));
}


void main(void) {
  vec2 p = 0.5 + vUV.xy * 0.4;


  float ctime = time/5. + fbm(p/8.)*40.;
  float ftime = fract(ctime/6.);

  ltime = floor(ctime/6.) + (1.-cos(ftime*3.1415)/2.);
  ltime = ltime*6.;



  vec2 q, r;
  float f = pattern(p, q, r);



  vec3 vLightPosition = vec3(0,20, -10);
  
  // World values
  vec3 vPositionW = vec3(world * vec4(vPosition, 1.0));
  vec3 vNormalW = normalize(vec3(world * vec4(vNormal, 0.0)));
  vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
  
  // Light
  vec3 lightVectorW = normalize(vLightPosition - vPositionW);
  vec3 color = texture2D(textureSampler, vUV).rgb;
  
  // vec2 uv = rotate(time / 5.) *
  //   ((2. * gl_FragCoord.xy - resolution.xy) 
  //   / resolution.y / 2.);
  
  // float l = length(uv);
  
  // float inv = 1. / l;
  // vec2 uvp = mod(
  //   uv * inv - vec2(inv * 2. + sin(time) / 2., 0.) + 1.,
  //   vec2(2.)) - 1.;

  // vec3 image = vec3(
  //   pattern(uvp * 2.) * l / 2.,
  //   pattern(uvp * 2.) * l / 2.,
  //   pattern(uvp * 2.) * l / 2.);
        
  
  vec3 col = hsv2rgb(vec3(
      q.x/10. + ltime/10. + .4,
      abs(r.y)*3. + .1,
      r.x + f
  ));
  float vig = 1. - pow(4.*(p.x - .5)*(p.x - .5), 10.);
  vig *= 1. - pow(4.*(p.y - .5)*(p.y - .5), 10.);

  vec3 c =  vec3(
    0.299 * col.r + 0.587 * col.g + 0.114 * col.b,
    0.299 * col.r + 0.587 * col.g + 0.114 * col.b,
    0.299 * col.r + 0.587 * col.g + 0.114 * col.b
  );


  gl_FragColor = vec4(col*vig, 1.);
}