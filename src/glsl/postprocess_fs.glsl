uniform sampler2D input_texture;
uniform sampler2D data;
varying vec2 vUv;

varying vec3 vPos;

uniform float time;

void main(){
    vec4 src = texture2D(data, vUv);
    //vec4 src = texture2D(input_texture,vUv);
    gl_FragColor = vec4(0.,src.r*(vPos.x+0.9),src.r*(vPos.y+0.9),1. );

}