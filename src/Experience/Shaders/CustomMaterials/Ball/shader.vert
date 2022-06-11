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
// varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform vec2 uOffset;
varying float vH;
varying vec2 pUv;

#define NOISE_SNIPPET

vec3 rotateVectorAroundAxis(vec3 vector,float angle,vec3 axis){
	float s=sin(angle);
	float c=cos(angle);
	float omc=1.-c;
	vec3 temp=vector;
	vector=(omc*axis*dot(axis,vector)+vector*c+cross(axis,temp)*s);
	return vector;
}

vec3 rotateVectorAroundAxis(vec3 vector,float angle,vec3 axis,vec3 pivot){
	vec3 temp=vector-pivot;
	temp=rotateVectorAroundAxis(temp,angle,axis);
	return temp+pivot;
}

void main(){
	vUv=uv+uOffset;
	// vNormal=normal;
	vec3 p=position;
	
	pUv=vec2(.5,.5)-uOffset/30.;
	float second=.0;
	float noiseSignal=terrain(pUv,second);
	float zOffset=noiseSignal;
	vH=zOffset;
	// p.y-=noiseSignal*3.;
	float y=vH*3.+3.;
	vec2 e=vec2(.005,0.);
	vPosition=p;
	vH=noiseSignal*.3+1.;
	
	vec3 n=normalize(vec3(terrain(pUv-e,second)-terrain(pUv+e,second),2.*e.x,terrain(pUv-e.yx,second)-terrain(pUv+e.yx,second)));
	vColor.xyz=n;
	
	// vec3 axis=normalize(cross(vec3(0.,1.,0.),n));
	// float angle=atan(n.y,n.x);
	// p=rotateVectorAroundAxis(p,angle,axis);
	p.y-=y+3.;
	
	// gl_Position=projectionPosition;
	csm_Position=p;
	// csm_Normal=n;
}