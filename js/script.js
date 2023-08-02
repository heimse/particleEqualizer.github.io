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

    audio.onended = function() {
        $('.audioDiv').addClass('stop');
    };
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


//Heimse Script
$(document).ready(() => {
	const toggleButton = document.querySelector('.toggle-menu');
	const navBar = document.querySelector('.nav-bar');
	const menu = document.querySelector('.menu');
	toggleButton.addEventListener('click', function () {
		navBar.classList.toggle('toggle');
		menu.classList.toggle('toggle');
	});

    $('.next').each(function() {
        $(this).bind('click', () => {
            $(this).parent().addClass('shown');
            $(this).parent().fadeOut('fast', () => {
                $(this).parent().next().fadeIn();
            });
        })
    });

    $('.lastbtn').bind('click', () => {
        $('.upload').removeClass('stop');
    })
});


function readCSVFile(){
    const files = document.querySelector('#file-input').files;
    $(".upload").addClass('stop');
    
    
    if(files.length > 0 ){

        // Selected file
        const file = files[0];

        // FileReader Object
        const reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function(event) {
            // Read file data
            const csvdata = event.target.result;
            const array = CSVToArray(csvdata);
            
            console.log(array);
            alert("console.log");
        };

    } else {
        alert("Please select a file.");
    }

}
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }


        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            var strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}

