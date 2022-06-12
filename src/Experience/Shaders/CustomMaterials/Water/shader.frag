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
uniform float uA;
uniform float uB;
varying vec4 vColor;
varying vec2 vUv;
varying float vX;

varying float vH;
uniform float uTime;
// varying vec3 vNormal;
varying vec3 vPosition;
varying float peak;

#define NOISE_SNIPPET

// The Linear Burn mode sums the value in the two layers and subtracts 1.

float linearBurn(float a,float b){
	return a+b-1.;
}

// The Linear Dodge blend mode simply sums the values in the two layers (also known as additive blending). Blending with white gives white.

float linearDodge(float a,float b){
	return a+b;
}

// Linear Light: this blend mode combines Linear Dodge and Linear Burn (rescaled so that neutral colors become middle gray). Dodge is applied when the value on the top layer is lighter than middle gray, and burn applies when the top layer value is darker. The calculation simplifies to the sum of the bottom layer and twice the top layer, subtract 1. This mode decreases the contrast.

float linearLight(float a,float b){
	return linearDodge(a,b)+linearBurn(a,2.*b-1.);
}

float compressor(float x,int ratio){
	float sX=x-.5;
	return pow(
		sin(
			sX*M_PI/2.
		),
		float(
			2*ratio+1
		)
	)*.5+.5;
}

float compressor2(float x,int ratio){
	float sX=x-.5;
	float absXoverX=abs(sX)/sX;
	float oscillator=cos(
		sX*M_PI/2.
	);
	return(
		pow(
			oscillator,
			float(
				2*ratio+1
			)
		)*absXoverX-absXoverX
		/-1.
	)*.5+.5;
}

void main(){
	vec3 color=vec3(1.);
	float h=0.;
	h+=vPosition.y;
	h=h*.225+.03;
	h=smoothstep(.1,.9,1.-h);
	h=pow(h,.666);
	
	color=mix(uColor1,uColor2,h);
	
	vec2 nUv=vUv;
	nUv*=4.;
	vec3 waveColor=vec3(1.);
	float wave=0.;
	vec3 waveUv=vec3(nUv,uTime*.02)*30.;
	waveUv=mix(waveUv,vec3(sin(waveUv.x*.5*M_PI*2.)),.4);
	wave=snoise(waveUv)*.5+.5;
	
	wave=1.-smoothstep(.1,.791,wave);
	
	float blob=0.;
	vec3 blobUv=vec3(nUv,uTime*.01)*10.;
	blob=snoise(blobUv)*.5+.5;
	
	float factor=.4;
	
	blob=factor>1.?mix(linearLight(blob,wave),blob,factor-1.):mix(wave,linearLight(wave,blob),factor);
	
	blob=sin(blob*3.)*.5+.5;
	blob=smoothstep(.98,1.,blob);
	
	float noise=0.;
	vec3 noiseUv=vec3(nUv,uTime*.08)*3.;
	noise=snoise(noiseUv)*.25+.75;
	noise=pow(noise,1.2);
	noise=blob*noise;
	vec3 waves=mix(color,vec3(.4902,.8431,.949),noise);
	color=mix(color,waves,.06);
	float unitCircle=1.-smoothstep(.4,.5,length(vUv-.5-uOffset));
	csm_DiffuseColor=vec4(color,.8*unitCircle);
	
	// csm_DiffuseColor=vec4(vec3(vX+2.),1.);
	// csm_FragColor=vec4(vec3(vX+2.),unitCircle);
	// csm_FragColor=vec4(unitCircle,0.,0.,unitCircle);
	
}
