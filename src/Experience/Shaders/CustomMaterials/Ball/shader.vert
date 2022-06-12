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

// varying vec4 vColor;
// varying vec2 vUv;
// varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uA;
uniform float uB;
uniform float uZRotation;
uniform vec2 uOffset;
varying float vH;
varying vec2 pUv;
varying float vAngle;
varying vec2 vAngle2;

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

vec2 rotateVector2D(vec2 vector,float angle){
	float s=sin(angle);
	float c=cos(angle);
	return vec2(vector.x*c-vector.y*s,vector.x*s+vector.y*c);
}

void main(){
	vUv=uv+uOffset;
	// vNormal=normal;
	vec3 p=position;
	
	pUv=vec2(.5,.5)-uOffset/80.;
	float second=.0;
	float noiseSignal=terrain(pUv,second);
	float zOffset=noiseSignal;
	vH=zOffset;
	// p.y-=noiseSignal*3.;
	float y=vH*3.+3.;
	vec2 e=vec2(.005,0.);
	vPosition=p;
	vH=noiseSignal*.3+1.;
	
	// vec3 n=normalize(vec3(terrain(pUv-e,second)-terrain(pUv+e,second),2.*e.x,terrain(pUv-e.yx,second)-terrain(pUv+e.yx,second)));
	// vColor.xyz=n;
	
	float spread=.1;
	float offset=1.;
	
	vec2 frontV=vec2(.0,-spread);
	vec2 backV=vec2(.0,spread);
	
	// rotate by uZRotation
	frontV=rotateVector2D(frontV,-uZRotation);
	backV=rotateVector2D(backV,-uZRotation);
	
	float front=terrain(pUv+frontV,second)+2.;
	float back=terrain(pUv+backV,second)+2.;
	// float front=terrain(pUv+vec2(-spread,0.),second)+2.;
	// float back=terrain(pUv+vec2(spread,0.),second)+2.;
	float angle=0.;
	vec2 dir=vec2(-1.,0.);
	dir=vec2(front,spread)-vec2(back,-spread);
	angle=atan(dir.y,dir.x);
	angle-=M_PI/2.;
	
	vAngle=angle;
	vAngle2=vec2(front,back);
	
	p=rotateVectorAroundAxis(p,angle*.127,vec3(1.,0.,0.),vec3(0.,0.,0.));
	
	// vec3 axis=normalize(cross(vec3(0.,1.,0.),n));
	// float angle=atan(n.y,n.x);
	// p=rotateVectorAroundAxis(p,angle,axis);
	p.y-=y+3.;
	
	// gl_Position=projectionPosition;
	csm_Position=p;
	// csm_Normal=n;
}