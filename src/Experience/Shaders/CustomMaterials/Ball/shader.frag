#ifdef LINT
precision mediump float;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#endif

#define M_PI 3.14159265358979323846

uniform vec2 uOffset;

// varying vec4 vColor;
// varying vec2 vUv;
// varying vec3 vNormal;
varying vec3 vPosition;
varying float vAngle;
varying vec2 vAngle2;
varying float vH;
varying vec2 pUv;

void main(){
	vec3 color=texture2D(map,vUv).rgb;
	color=mix(color,vec3(0.),.2);
	csm_DiffuseColor=vec4(color,1.);
	
	float angfac=mix(vAngle2.x,vAngle2.y,smoothstep(.45,.55,vPosition.z));
	// float angfac=mix(1.,0.,vPosition.z);
	
	// csm_DiffuseColor.rgb=vec3(vAngle);
	// csm_FragColor.rgb=vec3(angfac);
	
}