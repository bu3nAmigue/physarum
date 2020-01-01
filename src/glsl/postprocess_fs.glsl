uniform sampler2D input_texture;
uniform sampler2D data;
varying vec2 vUv;

uniform sampler2D tAudioData;

varying vec3 vPos;

uniform float time;

void main(){
	//float i = step( vUv.y, f ) * step( f - 0.0125, vUv.y );
	//gl_FragColor = vec4( mix( backgroundColor, color, i ), 1.0 );

	//float f = (texture2D( tAudioData, vUv.xy ).x + texture2D( tAudioData, vUv.xy ).y)*100000.;

    vec4 src = texture2D(data, vUv);
    //vec4 src = texture2D(input_texture,vUv);
    //gl_FragColor = vec4(0.,f,0.,1. );

	vec3 backgroundColor = vec3( 0.125, 0.125, 0.125 );
	vec3 color = vec3( 1.0, 1.0, 0.0 );

	float f = texture2D( tAudioData, vec2( 1.0, 1.0 ) ).x*100. + texture2D( tAudioData, vec2( 1.0, 1.0 ) ).y*100.;

	//gl_FragColor = vec4( src.x,0.,0., 1.0 );
    gl_FragColor = vec4(0.,src.r*(vPos.x+0.9),src.r*(vPos.y+0.9),1. );




}