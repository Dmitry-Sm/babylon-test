precision mediump float;


// Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;

// Varying
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;

void main(void) {
    // vec4 outPosition = worldViewProjection * vec4(position, 1.0);
    vec3 p = position;

    // if (pow(pow(p.x  - mousePosition.x * 26., 2.) + pow(p.y  - mousePosition.y * 26., 2.), 0.5) < 10.) {
    //     p.z = 0.;
    // }


    gl_Position = worldViewProjection * vec4( p, 1. );

    
    vUV = uv;
    vPosition = position;
    vNormal = normal;
}