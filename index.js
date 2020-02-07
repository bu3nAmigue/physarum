import 'file-loader?name=[name].[ext]!./src/html/index.html';
import {
    Scene,
    OrthographicCamera,
    WebGLRenderer,
    Mesh,
    DataTexture,
    RGBAFormat,
    FloatType,
    PlaneBufferGeometry,
    ShaderMaterial,
    Vector2,
    AudioListener,
    Audio,
    AudioAnalyser,
    AudioLoader,
    LuminanceFormat
} from 'three';
import PingpongRenderTarget from "./src/PingpongRenderTarget"
import RenderTarget from "./src/RenderTarget"
import dat from "dat.gui";
import Controls from "./src/Controls";

import soundfile from "./src/song.mp3"

// 0 configure scene
//////////////////////////////////////

let w = window.innerWidth
let h = window.innerHeight
 
const renderer = new WebGLRenderer({
    alpha: true
});
document.body.appendChild(renderer.domElement);
renderer.setSize(w, h);
const scene = new Scene();
const camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 100);
camera.position.z = 1;

// AUDIO MIC

var laposta = {
    "plow": {"value": 45.0},
    "pmid": {"value": 45.0},
    "phigh": {"value": 45.0},
    "cosa": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "inicial":true};
var fftSize = 127;
window.onload = function () {
    "use strict";
    var AudioContext;
    var audioContent;
    var path;

    AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContent = new AudioContext();


    var soundNotAllowed = function (error) {
        h.innerHTML = "You must allow your microphone.";
        console.log(error);
    }

    var soundAllowed = function (stream) {
        var audioStream = audioContent.createMediaStreamSource( stream );
        var analyser = audioContent.createAnalyser();
        var fftSize = 1024;

        analyser.fftSize = fftSize;
        audioStream.connect(analyser);

        laposta["cosa"] = analyser;
        laposta.inicial = false;
              
    }

    navigator.mediaDevices.getUserMedia({audio:true})
        .then(soundAllowed)
        .catch(soundNotAllowed);

};

var dameData = function () {
    if(laposta.inicial) return laposta.cosa;
    var bufferLength = laposta.cosa.frequencyBinCount;
    var frequencyArray = new Uint8Array(bufferLength);
    laposta.cosa.getByteFrequencyData(frequencyArray);
    var third = frequencyArray.length/3;

    return frequencyArray.map((i, index) => {
        if (index < (third + 1)) return (i / 256 * laposta.plow.value)
        if (index > third && index < (2* third)) return (i /256*laposta.pmid.value)
        if (index > (2*third+1)) return (i /256*laposta.phigh.value)
    }) ;
}

// 1 init buffers 
//////////////////////////////////////

let size = 512 // particles amount = ( size ^ 2 )

let count = size * size;
let pos = new Float32Array(count * 3)
let uvs = new Float32Array(count * 2)
let ptexdata = new Float32Array(count * 4)

let id = 0, u,v;
for (let i = 0; i < count; i++) {

    //point cloud vertex 
    id = i * 3
    pos[id++] = pos[id++] = pos[id++] = 0;

    //computes the uvs
    u = (i % size) / size;
    v = ~~(i / size) / size;
    id = i * 2
    uvs[id++] = u
    uvs[id] = v

    //particle texture values (agents)
    id = i * 4
    ptexdata[id++] = Math.random() // normalized pos x
    ptexdata[id++] = Math.random() // normalized pos y
    ptexdata[id++] = Math.random() // normalized angle
    ptexdata[id++] = 1
    

}

// 2 data & trails 
//////////////////////////////////////

//performs the diffusion and decay 
let diffuse_decay = new ShaderMaterial({
    uniforms: {
        points: { value: null },
        decay: {value: .9 }        
    },
    vertexShader: require('./src/glsl/quad_vs.glsl'),
    fragmentShader: require('./src/glsl/diffuse_decay_fs.glsl')
})
let trails = new PingpongRenderTarget(w, h, diffuse_decay)


// 3 agents 
//////////////////////////////////////

//moves agents around 
let update_agents = new ShaderMaterial({
    uniforms: {
        data: { value: null },
        sa: { value: 2 },
        ra: { value: 4 },
        so: { value: 12 },
        ss: { value: 1.1 }
    },
    vertexShader: require('./src/glsl/quad_vs.glsl'),
    fragmentShader: require('./src/glsl/update_agents_fs.glsl')
})
let agents = new PingpongRenderTarget(size, size, update_agents, ptexdata)


// 4 point cloud
//////////////////////////////////////

//renders the updated agents as red dots 
let render_agents = new ShaderMaterial({
    vertexShader: require('./src/glsl/render_agents_vs.glsl'),
    fragmentShader: require('./src/glsl/render_agents_fs.glsl')
})
let render = new RenderTarget(w,h,render_agents, pos, uvs)


// 5 post process
//////////////////////////////////////

//post process the result of the trails (render the trails as greyscale)
let postprocess = new ShaderMaterial({
    uniforms: {
        data: {
            value: null
        },
        time: {
            value: 0.0
        },
        tAudioData: {
            value: new DataTexture( dameData(), fftSize / 2, 1, LuminanceFormat )
        }
    },
    vertexShader: require('./src/glsl/quad_vs.glsl'),
    fragmentShader: require('./src/glsl/postprocess_fs.glsl')
})
let postprocess_mesh = new Mesh(new PlaneBufferGeometry(), postprocess)
postprocess_mesh.scale.set(w, h, 1)
scene.add(postprocess_mesh)


// 6 interactive controls 
//////////////////////////////////////
let controls = new Controls( renderer, agents )
controls.count = ~~(size * size * .05)


// animation loop 
//////////////////////////////////////

function raf(){
    
    requestAnimationFrame(raf)

    time = (Date.now() - start) * 0.001

    
    trails.material.uniforms.points.value = render.texture
    trails.render( renderer, time )
    
    agents.material.uniforms.data.value = trails.texture
    agents.render(renderer, time)
    //agents.material.uniforms.ra.value.needsUpdate = true;
    //agents.material.uniforms.ra.value = (new DataTexture( dameData(), fftSize / 2, 1, LuminanceFormat )).image.data[0]/1
    //agents.material.uniforms.sa.value = (new DataTexture( dameData(), fftSize / 2, 1, LuminanceFormat )).image.data[10]/10
    //agents.material.uniforms.so.value = (new DataTexture( dameData(), fftSize / 2, 1, LuminanceFormat )).image.data[20]/1
    agents.material.uniforms.ra.value = 60 + Math.min(Math.max(0,new DataTexture( dameData(), fftSize / 2, 1, LuminanceFormat ).image.data[50]/5),60*0.25)
    //console.log(dameData());
    //console.log(60 + Math.min(Math.max(0,new DataTexture( dameData(), fftSize / 2, 1, LuminanceFormat ).image.data[50]/5),60*0.25));
    agents.material.uniforms.sa.value = 60 + Math.min(Math.max(0,new DataTexture( dameData(), fftSize / 2, 1, LuminanceFormat ).image.data[50]/5),60*0.25)
    agents.material.uniforms.ss.value = 2 + Math.min(Math.max(0,new DataTexture( dameData(), fftSize / 2, 1, LuminanceFormat ).image.data[50]/5),10)
    render.render( renderer, time )
    
    postprocess_mesh.material.uniforms.data.value = render.texture
    postprocess_mesh.material.uniforms.time.value = time

    //analyser.getFrequencyData();
    //console.log(new DataTexture( dameData(), fftSize / 2, 1, LuminanceFormat ).image.data)

    //postprocess_mesh.material.uniforms.tAudioData.value = new DataTexture( dameData(), fftSize / 2, 1, LuminanceFormat )
    postprocess_mesh.material.uniforms.tAudioData.value.needsUpdate = true;

    renderer.setSize(w,h)
    renderer.clear()
    renderer.render(scene, camera)
    
}

//////////////////////////////////////////////////

let materials = [
    diffuse_decay, update_agents, render_agents
]
let resolution = new Vector2(w,h);
materials.forEach( (mat)=>{mat.uniforms.resolution.value = resolution})

let start = Date.now();
let time = 0;

raf()

// settings
//////////////////////////////////////////////////

let gui = new dat.GUI()
gui.add(diffuse_decay.uniforms.decay, "value", 0.01, .99, .01).name("decay")
gui.add(update_agents.uniforms.sa, "value", 1, 90, .1).name("sa")
gui.add(update_agents.uniforms.ra, "value", 1, 90, .1).name("ra")
gui.add(update_agents.uniforms.so, "value", 1, 90, .1).name("so")
gui.add(update_agents.uniforms.ss, "value", 0.1, 10, .1).name("ss")
gui.add(controls, "random")
gui.add(controls, "radius",.001,.25)
gui.add(controls, "count", 1,size*size, 1)
gui.add(laposta.plow, "value", 1, 90, 1).name("low")
gui.add(laposta.phigh, "value",1.,90., 1).name("high")
gui.add(laposta.pmid, "value",1.,90., 1).name("mid")
