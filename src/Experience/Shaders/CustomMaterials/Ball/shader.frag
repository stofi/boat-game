#ifdef LINT
precision mediump float;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#endif

#define M_PI 3.14159265358979323846

uniform vec2 uOffset;

varying vec4 vColor;
varying vec2 vUv;
// varying vec3 vNormal;
varying vec3 vPosition;
varying float vH;
varying vec2 pUv;

void main(){
	vec3 color=vec3(1.);
	
	csm_DiffuseColor=vec4(color,1.);
	
}