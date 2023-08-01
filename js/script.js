var m_analyzer;
var m_renderer;
// var m_mouse;
var m_render_queue;
var m_blob;
var m_pbr;
var m_light;
var m_ctrl;
var m_device_checker;
var flag = 0;
var audio;
var init = function(){
    console.log('init');
    // device_checker
    m_device_checker = new DeviceChecker();
    var _is_mobile = m_device_checker.is_mobile();
    var _is_retina = m_device_checker.is_retina();

    //init audio element
    var audioDiv = document.querySelector(".audioDiv");
    audioDiv.innerHTML = "<audio id='audio' src='src.mp3' type='audio/mp3'></audio>";
    console.log(audioDiv);
    audio = document.getElementById("audio");

    // init audio input analyzer
    m_analyzer = new AudioAnalyzer();

    // init mouse handler
    // m_mouse = new MouseHandler();
    // m_mouse.register_dom_events(document.body);

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
    if(flag == 1) {
        requestAnimationFrame( update );
        // update audio analyzer
        m_analyzer.update();
        // m_analyzer.debug(document.getElementsByTagName("canvas")[0]);

        // update blob
        m_blob.update_PBR();
        
        // update pbr
        if($("#play").hasClass( "played" )) {
            m_pbr.exposure = 5. 
                + 30. * m_analyzer.get_level();
        } else {
            m_pbr.exposure = 0;
        }


        // update light
        // if(m_ctrl.params.light_ziggle) 
        //     m_light.ziggle( m_renderer.timer );

        // update renderer
        if(m_ctrl.params.cam_ziggle) 
            m_renderer.ziggle_cam(m_analyzer.get_history());
        m_renderer.render(m_render_queue);
    }
};

const interfaceFunctions = () => {
    
    let audio;

    $("#play").bind('click', () => {
        console.log(flag);
        if(flag == 0 || flag == undefined) {
            console.log('inssit');
            init();
            audio = document.getElementById("audio");
            flag = 1;
            update();

            $("#play").fadeOut('1000', () => {
                $("#play").html('⏯︎');
                $("#play").fadeIn('1000');
                $('.next').parent().first().fadeIn();
            })
        }
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
        if(flag == 1) {
            update();
        }
    }
});

$(document).ready(() => {
	const toggleButton = document.querySelector('.toggle-menu');
	const navBar = document.querySelector('.nav-bar');
	const menu = document.querySelector('.menu');
	toggleButton.addEventListener('click', function () {
		navBar.classList.toggle('toggle');
		menu.classList.toggle('toggle');
	});

    $('.next').parent().fadeOut('1');
    $('.next').each(function(index) {
        $(this).bind('click', () => {
            $(this).parent().fadeOut('fast', () => {
                $(this).parent().next().fadeIn();
            });
        })
    });
});

function startLogic() {

}

