varying vec2 vUv;

varying vec3 vPos;

void main(){
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x,position.y,position.z,1.);

}
