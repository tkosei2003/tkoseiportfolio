const snoise = /* glsl */ `
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }

vec4 taylorInvSqrt(vec4 r){
  return 1.79284291400159 - 0.85373472095314 * r;
}

// 3D Simplex noise
float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 =   v - i + dot(i, C.xxx);

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  // Permutations
  i = mod(i, 289.0 );
  vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 g0 = vec3(a0.xy, h.x);
  vec3 g1 = vec3(a0.zw, h.y);
  vec3 g2 = vec3(a1.xy, h.z);
  vec3 g3 = vec3(a1.zw, h.w);

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(g0,g0), dot(g1,g1), dot(g2,g2), dot(g3,g3)));
  g0 *= norm.x;
  g1 *= norm.y;
  g2 *= norm.z;
  g3 *= norm.w;

  // Mix contributions
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(g0,x0), dot(g1,x1), dot(g2,x2), dot(g3,x3) ) );
}`;

export const heroVertexShader = /* glsl */ `
uniform float uTime;
uniform vec3 uHoverCenter;
uniform float uHoverStrength;
uniform float uHoverRadius;
varying vec3 vPos;
${snoise}
void main() {
  float freq = 0.9;
  float amp = 0.008;
  vec3 displaced = position;
  vec3 grad = vec3( snoise(vec3(position.yz + uTime, 0.0)) - snoise(vec3(position.yz - uTime, 0.0)), snoise(vec3(position.zx + uTime, 0.0)) - snoise(vec3(position.zx - uTime, 0.0)), snoise(vec3(position.xy + uTime, 0.0)) - snoise(vec3(position.xy - uTime, 0.0)) );
  displaced.xyz += amp * vec3(
    snoise(vec3(position.xy * freq, uTime)),
    snoise(vec3(position.yz * freq, uTime + 1.0)),
    snoise(vec3(position.zx * freq, uTime + 2.0))*grad.x
    // position.x,
    // position.y,
    // position.z
  );
  // Hover effect
  vec3 toHover = displaced - uHoverCenter;
  float dist = length(toHover);
  float influence = smoothstep(uHoverRadius, uHoverRadius * 0.2, dist);
  if (dist > 0.0001) {
    displaced += normalize(toHover) * influence * uHoverStrength * 0.2 * vec3(1.0, 1.0, 0);
  }
  
  vPos = displaced;
  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 3.0;
}
`;

export const heroFragmentShader = /* glsl */ `
varying vec3 vPos;
void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.2, dist);
  gl_FragColor = vec4(vec3(1.0), alpha);
}
`;
