var m_analyzer;
var m_renderer;
// var m_mouse;
var m_render_queue;
var m_blob;
var m_pbr;
var m_light;
var m_ctrl;
var m_device_checker;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const bufferLength = analyser.frequencyBinCount;
src = context.createMediaElementSource(audio);
src.connect(analyser);
analyser.connect(context.destination);
var init = function(){
    // device_checker
    m_device_checker = new DeviceChecker();
    var _is_mobile = m_device_checker.is_mobile();
    var _is_retina = m_device_checker.is_retina();

    // init audio input analyzer
    m_analyzer = new AudioAnalyzer();
    // init mouse handler
    // m_mouse = new MouseHandler();
    // m_mouse.register_dom_events(document.body);

    // TODO VOLUME INPUT
    // const gainNode = audioContext.createGain()
    // console.log(gainNode.gain.value);
    
    
    // init shared renderer
    var _is_perspective = true;
    m_renderer = new ThreeSharedRenderer(_is_perspective);
    m_renderer.append_renderer_to_dom(document.body);
    m_renderer.renderer.autoClear = true;

    // init pbr
    m_pbr = new ThreePBR();
    // init light
    m_light = new ThreePointLight();

    // init blob
    m_blob = new NoiseBlob(m_renderer, m_analyzer, m_light);
    m_blob.set_PBR(m_pbr);
    if(_is_retina) m_blob.set_retina();
    
    // setup render queue
    m_render_queue = [
        m_blob.update.bind(m_blob)
    ];

    // init gui
    m_ctrl = new Ctrl(m_blob, m_light, m_pbr, m_analyzer);
};


var update = function(){
    requestAnimationFrame( update );

    const dataArray = new Uint8Array(bufferLength);
    console.log(dataArray);
    // update audio analyzer
    m_analyzer.update();
    // m_analyzer.debug(document.getElementsByTagName("canvas")[0]);

    // update blob
    m_blob.update_PBR();
    
    // update pbr
    m_pbr.exposure = 5. 
        + 30. * m_analyzer.get_level();

    // update light
    // if(m_ctrl.params.light_ziggle) 
    //     m_light.ziggle( m_renderer.timer );
    
    // update renderer
    if(m_ctrl.params.cam_ziggle) 
        m_renderer.ziggle_cam(m_analyzer.get_history());
    m_renderer.render(m_render_queue);
};

const interfaceFunctions = () => {

    // init audioAnaliyzer
    $(".audioDiv").html("<audio id='audio' src='src.mp3' type='audio/mp3'></audio>");

    $("#play").bind('click', () => {
        if($("#play").hasClass( "played" )) {
            console.log('pause');
            audio.pause();
        } else {
            console.log('play');
            audio.play();
        }
        $("#play").toggleClass("played");
    })
}

document.addEventListener('DOMContentLoaded', function(){
    if(window.location.protocol == 'http:' && window.location.hostname != "localhost"){
        window.open("https://" + window.location.hostname + window.location.pathname,'_top');
    } else {
        interfaceFunctions();
        init();
        update();
    }
});


function loop(){
	console.log("loop");
    if(!audio.paused){
		array = new Uint8Array(analyser.frequencyBinCount);
    
		analyser.getByteFrequencyData(array);
		//console.log(array[40]/310);
		return array[40]/310;
    }
}