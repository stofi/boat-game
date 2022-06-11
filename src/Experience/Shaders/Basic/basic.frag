#ifdef LINT
precision mediump float;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#endif

#define M_PI 3.14159265358979323846

uniform vec2 uOffset;

varying vec4 vColor;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main(){
	vec3 color=vec3(1.);
	
	vec3 lightDirection=normalize(vec3(0.,0.,1.));
	vec3 normal=normalize(vNormal);
	float diffuse=max(dot(lightDirection,normal),0.);
	vec3 ambient=vec3(.4157,.4157,.4157);
	vec3 light=vec3(0.);
	light+=ambient;
	light+=diffuse;
	color=color.rgb*(light);
	gl_FragColor=vec4(color,1.);
	
}