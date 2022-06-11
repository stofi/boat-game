#ifdef LINT
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
#endif

#define M_PI 3.14159265358979323846

varying vec4 vColor;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform vec2 uOffset;

#define NOISE_SNIPPET

void main(){
	vUv=uv+uOffset;
	vNormal=normal;
	float noiseSignal=terrain(vUv);
	float zOffset=noiseSignal;
	
	vColor=vec4(1.,1.,zOffset,1.);
	
	vec3 p=position;
	p.z+=zOffset;
	
	vec2 e=vec2(.005,0.);
	vec3 n=normalize(vec3(terrain(vUv-e)-terrain(vUv+e),2.*e.x,terrain(vUv-e.yx)-terrain(vUv+e.yx)));
	vNormal=n;
	
	vec4 modelPosition=modelMatrix*vec4(p,1.);
	vec4 viewPosition=viewMatrix*modelPosition;
	vec4 projectionPosition=projectionMatrix*viewPosition;
	
	vPosition=modelPosition.xyz;
	gl_Position=projectionPosition;
}
