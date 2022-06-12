vec3 mod289(vec3 x){
  return x-floor(x*(1./289.))*289.;
}

vec4 mod289(vec4 x){
  return x-floor(x*(1./289.))*289.;
}

vec4 permute(vec4 x){
  return mod289(((x*34.)+10.)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159-.85373472095314*r;
}

float snoise(vec3 v)
{
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  
  // First corner
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  
  // Other corners
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  
  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;// 2.0*C.x = 1/3 = C.y
  vec3 x3=x0-D.yyy;// -1.0+3.0*C.x = -0.5 = -D.y
  
  // Permutations
  i=mod289(i);
  vec4 p=permute(
    permute(
      permute(
        i.z+vec4(0.,i1.z,i2.z,1.)
      )
      +i.y+vec4(0.,i1.y,i2.y,1.)
    )
    +i.x+vec4(0.,i1.x,i2.x,1.)
  );
  
  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_=.142857142857;// 1.0/7.0
  vec3 ns=n_*D.wyz-D.xzx;
  
  vec4 j=p-49.*floor(p*ns.z*ns.z);//  mod(p,7*7)
  
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);// mod(j,N)
  
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  
  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  
  //Normalise gradients
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;
  p1*=norm.y;
  p2*=norm.z;
  p3*=norm.w;
  
  // Mix final noise value
  vec4 m=max(.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 105.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),
  dot(p2,x2),dot(p3,x3)));
}

float fbm(vec3 x,float height,float amplitude,float frequency){
  
  for(int i=0;i<2;i++){
    height+=snoise(x*frequency)*amplitude;
    amplitude*=.5;
    frequency*=2.;
  }
  return height;
}

float terrain(vec2 p,float second){
  float h=0.;
  vec2 q=p*vec2(20.);
  float time=0.;
  time=uTime*2.;
  
  // First layer
  {
    
    vec2 uv=q*.2;
    float h1=0.;
    // sin(uTime/2.)+1.)/4.,4.)
    vec3 offset=vec3(0.,0.,0.);
    float timex=time*.1;
    offset.x=20.*(timex)/10.+100.;
    offset.y=timex;
    offset.z=20.*(timex)/10.;
    offset.xz/=4.;
    
    vec3 samplePos=vec3(uv.x,0.,uv.y);
    float t1=fbm(samplePos+offset,0.,.5,.3);
    t1=smoothstep(-1.,1.,t1)*.5+.5;
    t1=pow(t1,2.)*2.-1.;
    t1*=.8;
    h1+=t1-2.;
    h+=h1;
  }
  // Second layer
  {
    vec2 uv=q;
    float h1=0.;
    // sin(time/2.)+1.)/4.,4.)
    vec3 offset=vec3(0.,0.,0.);
    offset.x=cos(time/4.)+10.;
    offset.y=time/20.;
    offset.z=-sin(time/4.)-112.;
    offset.xz/=4.;
    
    vec3 samplePos=vec3(uv.x,0.,uv.y);
    float t1=fbm(samplePos+offset,0.,.5,12.);
    t1=smoothstep(-1.,1.,t1);
    t1*=.02;
    h1+=t1;
    h+=h1*second;
  }
  
  return h;
}

float terrain(vec2 p){
  float second=1.;
  return terrain(p,second);
}