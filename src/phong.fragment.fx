<<<<<<< HEAD
<<<<<<< HEAD
#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
=======
>>>>>>> parent of 59c878a... sh texture
precision mediump float;
#endif

=======
precision mediump float;

>>>>>>> parent of 59c878a... sh texture
// Varying
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUV;

uniform float time;
uniform vec2 mouse;

// Uniforms
uniform mat4 world;

// Refs
uniform vec3 cameraPosition;
uniform sampler2D textureSampler;


mat3 translate(vec2 v) {
	return mat3(
		1., 0., 0.,
		0., 1., 0,
		-v.x, -v.y, 1.
	);
}

mat3 rotate(float a) {
	return mat3(
		cos(a), -sin(a), .0,
		-sin(a), cos(a), 0.,
		0., 0., 1.
	);	
}

float sinp(float a) { return 0.5 + 0.5 * sin(a); }


vec2 hash(vec2 p)
{
    mat2 m = mat2(  1.85, 47.77,
                    99.41, 188.48
                );

    return fract(sin(m*p) * 46738.29);
}

float voronoi(vec2 p)
{
    vec2 g = floor(p);
    vec2 f = fract(p);

    float distanceToClosestFeaturePoint = 1.0;
    for(int y = -1; y <= 1; y++)
    {
        for(int x = -1; x <= 1; x++)
        {
            vec2 latticePoint = vec2(x, y);
            float currentDistance = distance(latticePoint + hash(g+latticePoint), f);
            distanceToClosestFeaturePoint = min(distanceToClosestFeaturePoint, currentDistance);
        }
    }

    return distanceToClosestFeaturePoint*1.6;
}

void main(void) {
<<<<<<< HEAD
<<<<<<< HEAD
    vec2 resolution = vec2(800., 600.);
    vec3 vLightPosition = vec3(0, 20, -400);

=======
=======
>>>>>>> parent of 59c878a... sh texture
    vec3 vLightPosition = vec3(0,20, -20);
    
>>>>>>> parent of 59c878a... sh texture
    // World values
    vec3 vPositionW = vec3(world * vec4(vPosition, 1.0));
    vec3 vNormalW = normalize(vec3(world * vec4(vNormal, 0.0)));
    vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
    
    vec3 lightVectorW = normalize(vLightPosition - vPositionW);
<<<<<<< HEAD
=======
    vec3 color = texture2D(textureSampler, vUV).rgb;

    // diffuse
>>>>>>> parent of 59c878a... sh texture
    float ndl = max(0., dot(vNormalW, lightVectorW));




	vec3 st = vec3(gl_FragCoord.xy / resolution, 1.0);
	vec2 aspect = vec2(resolution.x / resolution.y, 1.0);
	st.xy *= 2.0;
	st.xy -= 1.0;
	st.xy *= aspect;
	st = translate(mouse * 2.0 - 1.) * st;

    // Specular
    vec3 angleW = normalize(viewDirectionW + lightVectorW);
    float specComp = max(0., dot(vNormalW, angleW));
    specComp = pow(specComp, max(1., 64.)) * 2.;
	
	vec3 col = vec3(1,1,1);
	
	// float t = time;
	
	// for (int i = 0; i < 6; i++) {
	// 	t += (sin(time + (2. + 10. * mouse.x) * length(st) + atan(st.y, st.x) * 5.)
	// 	     * sin(time + (2. + 10. * mouse.y) * length(st) - atan(st.y, st.x) * 5.)
	// 	     );
	// 	float c = sin(5. * t - length(st.xy) * 100. * sinp(t));
	// 	col[i] = c;
	// }
	
	
	
	gl_FragColor = vec4(col * ndl + specComp, 1.0);
	// gl_FragColor = vec4(1., 1., 1., 1.); 
}