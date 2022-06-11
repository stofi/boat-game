#ifdef LINT
precision mediump float;
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
#endif

#define M_PI 3.14159265358979323846

uniform vec2 uOffset;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uLightColor1;
uniform vec3 uLightColor2;
uniform float uHeight; 
varying vec4 vColor;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float peak;

void main(){
	vec3 color=vec3(1.);
	float h=0.;
	h+=vPosition.y*.5;
	h=smoothstep(0.1,1.,h);
	/* h=pow(h,2.); */
	color=mix(uColor1,uColor2,h);
	vec3 lightDirection=normalize(vec3(-1.,0.,1.));
	vec3 normal=normalize(vNormal);
	float diffuse=max(dot(lightDirection,normal),0.);
	vec3 ambient=vec3(.3);
	vec3 light=vec3(0.);
	light+=ambient*uLightColor2
        ;
	light+=diffuse*uLightColor1;
	color=color.rgb*(light);
	gl_FragColor=vec4(color,1.);
    /* gl_FragColor = vec4(vPosition.yyy*uHeight,1.); */
	
}
