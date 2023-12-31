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
    // console.log('init');
    // device_checker
    m_device_checker = new DeviceChecker();
    var _is_mobile = m_device_checker.is_mobile();
    var _is_retina = m_device_checker.is_retina();

    //init audio element
    var audioDiv = document.querySelector(".audioDiv");
    audioDiv.innerHTML = "<audio id='audio' src='src.mp3' type='audio/mp3'></audio>";
    // console.log(audioDiv);
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
        // console.log(flag);
        if(flag == 0 || flag == undefined) {
            // console.log('inssit');
            init();
            audio = document.getElementById("audio");
            flag = 1;
            update();

            $("#play").fadeOut('1000', () => {
                $("#play p").html('Skip');
                $("#play").fadeIn('1000');
                setTimeout(function() {
                    $("#popup1").show(400);
                }, 1000);
                  setTimeout(function() {
                    $("#popup2").show(400);
                }, 10000);
                  setTimeout(function() {
                    $("#popup3").show(400);
                }, 20000);
				setTimeout(function() {
                    $("#popup4").show(400);
                }, 30000);
				setTimeout(function() {
                    $("#popup5").show(400);
                }, 40000);
				setTimeout(function() {
                    $("#popup6").show(400);
                }, 50000);				
                setTimeout(function() {
                    $("#popup1").hide(400);
                }, 9000);
                setTimeout(function() {
                    $("#popup2").hide(400);
                }, 19000);
                setTimeout(function() {
                    $("#popup3").hide(400);
                }, 29000);
                setTimeout(function() {
                    $("#popup4").hide(400);
                }, 39000);	
                setTimeout(function() {
                    $("#popup5").hide(400);
                }, 49000);				
               setTimeout(function() {
                    $("#popup6").hide(400);
                    $('.upload').removeClass('stop');
                    $("#play").css("display", "none");
                }, 57000);				
            })
        }
        if($("#play").hasClass( "played" )) {
            audio.pause();
            $(".popupMsgWrapper").addClass("hidden");
            $('.upload').removeClass('stop');
            $("canvas:not(.chartJs)").fadeOut("slow");
            $("#play").css("display", "none");
        } else {
            // console.log('play');
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
    $(".chartsWrapper").fadeOut();

    const inputElement = document.getElementById("file-input");
    inputElement.addEventListener("change", () => {
        // console.log('input changes');
        readCSVFile();
        $(".upload").addClass('stop');
    }, false);
});


function readCSVFile(){
    const files = document.querySelector('#file-input').files;
    if(files.length > 0 ){
        $(".upload").addClass('hidden');
        const audio = document.getElementById("audio");
        audio.pause();
        $("canvas:not(.chartJs)").fadeOut("slow");
        $(".playbtn").addClass('stop');
        $(".wrapper").fadeOut("slow");

        $(".chartsWrapper").fadeIn();


        // Selected file
        const file = files[0];

        // FileReader Object
        const reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function(event) {
            // Read file data
            const csvdata = event.target.result;
            const array = CSVToArray(csvdata);
            const charts = document.querySelectorAll('.chartJs');
            // console.log(array);            
            const settingsArray = [
                {
                    type: 'line',
                    data: {
                        //x-axis
                        labels: getAllColumn(array, 2),
                        datasets: [{
                            //y-axis
                            label: 'Загрузка в комнатах в прошлом',
                            data: getAllColumn(array, 5),
                            borderWidth: 1,
							pointBackgroundColor: '#00c7d6',
                            borderColor: '#0e1a2f',
                            backgroundColor: '#02faf2',
                            // fill: true,
                        }]
                    },
                    options:{
                        chartArea: {
                            backgroundColor: 'rgba(251, 85, 85, 0.4)'
                        },
                        responsive: true,
                        maintainAspectRatio: true,
                        animation: {
                            easing: 'easeInOutQuad',
                            duration: 520
                        },
                        scales: {
                            y: {
                                ticks: {
                                    color: ['#ffffff'],
                                },
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.08)',
                                    lineWidth: 1
                                }
                            },
                            x:{
                                ticks: {
                                    color: getColorsSequence(array, 3),
                                }
                            }
                        },
                        elements: {
                            line: {
                                tension: 0.4
                            }
                        },
                        point: {
                            backgroundColor: '#00c7d6'
                        },
                        tooltips: {
                            titleFontFamily: 'Poppins',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            titleFontColor: 'white',
                            caretSize: 5,
                            cornerRadius: 2,
                            xPadding: 10,
                            yPadding: 10
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: `Загрузка в комнатах в прошлом; Среднее значение: ${getAverage(getAllColumn(array, 5))}`,
                                color: '#ffffff',
                                font: {
                                    size: 20
                                },
                                padding: {
                                    top: 10,
                                    bottom: 30
                                }
                            },
                            legend: {
                                display: false
                            },
                        }
                    }
                },
                {
                    type: 'line',
                    data: {
                        //x-axis
                        labels: getAllColumn(array, 10),
                        datasets: [{
                            //y-axis
                            label: 'Загрузка в комнатах в будущем',
                            data: getAllColumn(array, 12),
                            borderWidth: 1,
							pointBackgroundColor: '#00c7d6',
                            borderColor: '#0e1a2f',
                            backgroundColor: '#02faf2',
                            // fill: 'origin'
                        },{
                            //y-axis
                            label: 'Загрузка в комнатах в прошлом',
                            data: getAllColumn(array, 5),
                            borderWidth: 1,
							pointBackgroundColor: '#00c7d6',
                            borderColor: '#0e1a2f',
                            backgroundColor: '#00C7D6'
                        }]
                    },
                    options:{
                        chartArea: {
                            backgroundColor: 'rgba(251, 85, 85, 0.4)'
                        },
                        responsive: true,
                        maintainAspectRatio: true,
                        animation: {
                            easing: 'easeInOutQuad',
                            duration: 520
                        },
                        scales: {
                            y: {
                                ticks: {
                                    color: ['#ffffff'],
                                    // stepSize: 10,
                                },
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.08)',
                                    lineWidth: 1
                                }
                            },
                            x: {
                                ticks: {
                                    color: getColorsSequence(array, 11),
                                }
                            }
                        },
                        elements: {
                            line: {
                                tension: 0.4
                            }
                        },
                        point: {
                            backgroundColor: '#00c7d6'
                        },
                        tooltips: {
                            titleFontFamily: 'Poppins',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            titleFontColor: 'white',
                            caretSize: 5,
                            cornerRadius: 2,
                            xPadding: 10,
                            yPadding: 10
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: `Загрузка в комнатах в будущем; Среднее значение: ${getAverage(getAllColumn(array, 12))}`,
                                color: '#ffffff',
                                font: {
                                    size: 20
                                },
                                padding: {
                                    top: 10,
                                    bottom: 30
                                }
                            },
                            legend: {
                                display: false
                            },
                        }
                    }
                },
                {
                    type: 'line',
                    data: {
                        //x-axis
                        labels: getAllColumn(array, 2),
                        datasets: [{
                            //y-axis
                            label: 'Закрузка в процентах в прошлом',
                            data: getAllColumn(array, 6),
                            borderWidth: 1,
							pointBackgroundColor: '#00c7d6',
                            borderColor: '#0e1a2f',
                            backgroundColor: '#02faf2',
                            // fill: true
                        }]
                    },
                    options:{

                        chartArea: {
                            backgroundColor: 'rgba(251, 85, 85, 0.4)'
                        },
                        responsive: true,
                        maintainAspectRatio: true,
                        animation: {
                            easing: 'easeInOutQuad',
                            duration: 520
                        },
                        scales: {
                            y: {
                                ticks: {
                                    beginAtZero: true,
                                    color: ['#ffffff'],
                                    // stepSize: 5
                                },
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.08)',
                                    lineWidth: 1
                                }
                            },
                            x: {
                                ticks: {
                                    color: getColorsSequence(array, 3),
                                }
                            }
                        },
                        elements: {
                            line: {
                                tension: 0.4
                            }
                        },
                        point: {
                            backgroundColor: '#00c7d6'
                        },
                        tooltips: {
                            titleFontFamily: 'Poppins',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            titleFontColor: 'white',
                            caretSize: 5,
                            cornerRadius: 2,
                            xPadding: 10,
                            yPadding: 10
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: `Закрузка в процентах в прошлом; Среднее значение: ${getAverage(getAllColumn(array, 6))}%`,
                                color: '#ffffff',
                                font: {
                                    size: 20
                                },
                                padding: {
                                    top: 10,
                                    bottom: 30
                                }
                            },
                            legend: {
                                display: false
                            },
                        }
                    }
                }, 
                {
                    type: 'line',
                    data: {
                        //x-axis
                        labels: getAllColumn(array, 10),
                        datasets: [{
                            //y-axis
                            label: 'Закрузка в процентах в будущем',
                            data: getAllColumn(array, 13),
                            borderWidth: 1,
							pointBackgroundColor: '#00c7d6',
                            borderColor: '#0e1a2f',
                            backgroundColor: '#02faf23',
                            // fill: 'origin'
                        },{
                            //y-axis
                            label: 'Закрузка в процентах в прошлом',
                            data: getAllColumn(array, 6),
                            borderWidth: 1,
							pointBackgroundColor: '#00c7d6',
                            borderColor: '#0e1a2f',
                            backgroundColor: '#02fa93',
                        }]
                    },
                    options:{

                        chartArea: {
                            backgroundColor: 'rgba(251, 85, 85, 0.4)'
                        },
                        responsive: true,
                        maintainAspectRatio: true,
                        animation: {
                            easing: 'easeInOutQuad',
                            duration: 520
                        },
                        scales: {
                            y: {
                                ticks: {
                                    color: ['#ffffff'],
                                    // stepSize: 5
                                },
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.08)',
                                    lineWidth: 1
                                }
                            },
                            x:{
                                ticks: {
                                    color: getColorsSequence(array, 11),
                                }
                            }
                        },
                        elements: {
                            line: {
                                tension: 0.4
                            }
                        },
                        point: {
                            backgroundColor: '#00c7d6'
                        },
                        tooltips: {
                            titleFontFamily: 'Poppins',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            titleFontColor: 'white',
                            caretSize: 5,
                            cornerRadius: 2,
                            xPadding: 10,
                            yPadding: 10
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: `Закрузка в процентах в будущем; Среднее значение: ${getAverage(getAllColumn(array, 13))}%`,
                                color: '#ffffff',
                                font: {
                                    size: 20
                                },
                                padding: {
                                    top: 10,
                                    bottom: 30
                                }
                            },
                            legend: {
                                display: false
                            },
                        }
                    }
                }, 
                {
                    type: 'bar',
                    data: {
                        //x-axis
                        labels: getAllColumn(array, 2),
                        datasets: [{
                            //y-axis
                            label: 'Доход в прошлом',
                            data: getAllColumn(array, 7),
                            borderWidth: 1,
                            pointBackgroundColor: '#00c7d6',
                            borderColor: '#0e1a2f',
                            backgroundColor: '#030bff',
                        }]
                    },
                    options:{
                        chartArea: {
                            backgroundColor: 'rgba(251, 85, 85, 0.4)'
                        },
                        responsive: true,
                        maintainAspectRatio: true,
                        animation: {
                            easing: 'easeInOutQuad',
                            duration: 520
                        },
                        scales: {
                            y: {
                                ticks: {
                                    color: '#ffffff',
                                    // stepSize: 5
                                },
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.08)',
                                    lineWidth: 1
                                }
                            },
                            x: {
                                ticks: {
                                    color: getColorsSequence(array, 3),
                                }
                            }
                        },
                        elements: {
                            line: {
                                tension: 0.4
                            }
                        },
                        point: {
                            backgroundColor: '#00c7d6'
                        },
                        tooltips: {
                            titleFontFamily: 'Poppins',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            titleFontColor: 'white',
                            caretSize: 5,
                            cornerRadius: 2,
                            xPadding: 10,
                            yPadding: 10
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: `Доход в прошлом; Всего: ${getSumm(getAllColumn(array, 7))}`,
                                color: '#ffffff',
                                font: {
                                    size: 20
                                },
                                padding: {
                                    top: 10,
                                    bottom: 30
                                }
                            },
                            legend: {
                                display: false
                            },
                        }
                    }
                }, 
                {
                    type: 'bar',
                    data: {
                        //x-axis
                        labels: getAllColumn(array, 10),
                        datasets: [{
                            //y-axis
                            label: 'Доход в будущем',
                            data: getAllColumn(array, 14),
                            borderWidth: 1,
							pointBackgroundColor: '#00c7d6',
                            borderColor: '#0e1a2f',
                            backgroundColor: '#030bff',
                        }]
                    },
                    options:{
                        chartArea: {
                            backgroundColor: 'rgba(251, 85, 85, 0.4)'
                        },
                        responsive: true,
                        maintainAspectRatio: true,
                        animation: {
                            easing: 'easeInOutQuad',
                            duration: 520
                        },
                        scales: {
                            y: {
                                ticks: {
                                    color: '#ffffff',
                                    // stepSize: 5
                                },
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.08)',
                                    lineWidth: 1
                                }
                            },
                            x: {
                                ticks: {
                                    color: getColorsSequence(array, 11),
                                }
                            }
                        },
                        elements: {
                            line: {
                                tension: 0.4
                            }
                        },
                        legend: {
                            display: false
                        },
                        point: {
                            backgroundColor: '#00c7d6'
                        },
                        tooltips: {
                            titleFontFamily: 'Poppins',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            titleFontColor: 'white',
                            caretSize: 5,
                            cornerRadius: 2,
                            xPadding: 10,
                            yPadding: 10
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: `Доход в будущем; Всего: ${getSumm(getAllColumn(array, 14))}`,
                                color: '#ffffff',
                                font: {
                                    size: 20
                                },
                                padding: {
                                    top: 10,
                                    bottom: 30
                                }
                            }
                        },
                        legend: {
                            display: false
                        },
                    }
                }, 
                {
                    type: 'bar',
                    data: {
                        //x-axis
                        labels: getAllColumn(array, 2),
                        datasets: [{
                            //y-axis
                            label: 'Средний тариф в прошлом',
                            data: getAllColumn(array, 8),
                            borderWidth: 1,
							pointBackgroundColor: '#00c7d6',
                            borderColor: '#0e1a2f',
                            backgroundColor: '#a34502',
                        }]
                    },
                    options:{

                        chartArea: {
                            backgroundColor: 'rgba(251, 85, 85, 0.4)'
                        },
                        responsive: true,
                        maintainAspectRatio: true,
                        animation: {
                            easing: 'easeInOutQuad',
                            duration: 520
                        },
                        scales: {
                            y: {
                                ticks: {
                                    color: '#ffffff',
                                    // stepSize: 5
                                },
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.08)',
                                    lineWidth: 1
                                }
                            },
                            x: {
                                ticks: {
                                    color: getColorsSequence(array, 3),
                                }
                            }
                        },
                        elements: {
                            line: {
                                tension: 0.4
                            }
                        },
                        legend: {
                            display: false
                        },
                        point: {
                            backgroundColor: '#00c7d6'
                        },
                        tooltips: {
                            titleFontFamily: 'Poppins',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            titleFontColor: 'white',
                            caretSize: 5,
                            cornerRadius: 2,
                            xPadding: 10,
                            yPadding: 10
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: `Средний тариф в прошлом; Среднее значение: ${getAverage(getAllColumn(array, 8))}`,
                                color: '#ffffff',
                                font: {
                                    size: 20
                                },
                                padding: {
                                    top: 10,
                                    bottom: 30
                                }
                            },
                            legend: {
                                display: false
                            },
                        }
                    }
                },
                {
                    type: 'bar',
                    data: {
                        //x-axis
                        labels: getAllColumn(array, 10),
                        datasets: [{
                            //y-axis
							
                            label: 'Средний тариф в будущем',
                            data: getAllColumn(array, 15),
                            borderWidth: 1,
							pointBackgroundColor: '#00c7d6',
                            borderColor: '#0e1a2f',
                            backgroundColor: '#a34502',
                        }]
                    },
                    options:{

                        chartArea: {
                            backgroundColor: 'rgba(251, 85, 85, 0.4)'
                        },
                        responsive: true,
                        maintainAspectRatio: true,
                        animation: {
                            easing: 'easeInOutQuad',
                            duration: 520
                        },
                        scales: {
                            y: {
                                ticks: {
                                    color: '#ffffff',
                                    // stepSize: 5
                                },
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.08)',
                                    lineWidth: 1
                                }
                            },
                            x: {
                                ticks: {
                                    color: getColorsSequence(array, 11),
                                }
                            }
                        },
                        elements: {
                            line: {
                                tension: 0.4
                            }
                        },
                        point: {
                            backgroundColor: '#00c7d6'
                        },
                        tooltips: {
                            titleFontFamily: 'Poppins',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            titleFontColor: 'white',
                            caretSize: 5,
                            cornerRadius: 2,
                            xPadding: 10,
                            yPadding: 10
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: `Средний тариф в будущем; Среднее значение: ${getAverage(getAllColumn(array, 15))}`,
                                color: '#ffffff',
                                font: {
                                    size: 20
                                },
                                padding: {
                                    top: 10,
                                    bottom: 30
                                }
                            },
                            legend: {
                                display: false
                            },
                        }
                         
                    }
                },
                {
                    type: 'line',
                    data: {
                        //x-axis
                        labels: getAllColumn(array, 10),
                        datasets: [{
                            //y-axis
                            label: 'Загрузка в комнатах в будущем на сегодня',
                            data: getAllColumn(array, 12),
                            borderWidth: 1,
							pointBackgroundColor: '#00c7d6',
                            borderColor: '#0e1a2f',
                            backgroundColor: '#02faf2',
                            // fill: 'origin'
                        },{
                            //y-axis
                            label: 'Прогноз загрузки в комнатах',
                            data: getAllColumn(array, 17),
                            borderWidth: 1,
							pointBackgroundColor: '#00c7d6',
                            borderColor: '#0e1a2f',
                            backgroundColor: '#02faf2',
                        }]
                    },
                    options:{

                        chartArea: {
                            backgroundColor: 'rgba(251, 85, 85, 0.4)'
                        },
                        responsive: true,
                        maintainAspectRatio: true,
                        animation: {
                            easing: 'easeInOutQuad',
                            duration: 520
                        },
                        scales: {
                            y: {
                                ticks: {
                                    color: '#ffffff',
                                    // stepSize: 5
                                },
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.08)',
                                    lineWidth: 1
                                }
                            },
                            x: {
                                ticks: {
                                    color: getColorsSequence(array, 11),
                                    stacked: true,
                                }
                            }
                        },
                        elements: {
                            line: {
                                tension: 0.4
                            }
                        },
                        point: {
                            backgroundColor: '#00c7d6'
                        },
                        tooltips: {
                            titleFontFamily: 'Poppins',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            titleFontColor: 'white',
                            caretSize: 5,
                            cornerRadius: 2,
                            xPadding: 10,
                            yPadding: 10
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: `Прогноз загрузки в комнатах; Среднее значение: ${getAverage(getAllColumn(array, 17))}`,
                                color: '#ffffff',
                                font: {
                                    size: 20
                                },
                                padding: {
                                    top: 10,
                                    bottom: 30
                                }
                            },
                            legend: {
                                display: false
                            },
                        }
                    }
                },
                {
                    type: 'line',
                    data: {
                        //x-axis
                        labels: getAllColumn(array, 10),
                        datasets: [{
                            //y-axis
                            label: 'Загрузка в процентах в будущем на сегодня',
                            data: getAllColumn(array, 6),
                            borderWidth: 1,
							pointBackgroundColor: '#00c7d6',
                            borderColor: '#0e1a2f',
                            backgroundColor: '#000053',
                            // fill: 'origin'
                        },{
                            //y-axis
                            label: 'Прогноз загрузки в процентах',
                            data: getAllColumn(array, 18),
                            borderWidth: 1,
							pointBackgroundColor: '#00c7d6',
                            borderColor: '#0e1a2f',
                            backgroundColor: '#02e1d9',
                            // fill: 0
                        }]
                    },
                    options:{
                        chartArea: {
                            backgroundColor: 'rgba(251, 85, 85, 0.4)'
                        },
                        responsive: true,
                        maintainAspectRatio: true,
                        animation: {
                            easing: 'easeInOutQuad',
                            duration: 520
                        },
                        scales: {
                            y: {
                                ticks: {
                                    color: ['#ffffff'],
                                    // stepSize: 5
                                },
                                min: 0,
                                max: 100,
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.08)',
                                    lineWidth: 1
                                }
                            },
                            x:{
                                ticks: {
                                    color: getColorsSequence(array, 11),
                                    z: 999,
                                    display: true,
                                }
                            }
                        },
                        elements: {
                            line: {
                                tension: 0.4
                            }
                        },
                        point: {
                            backgroundColor: '#00c7d6'
                        },
                        tooltips: {
                            titleFontFamily: 'Poppins',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            titleFontColor: 'white',
                            caretSize: 5,
                            cornerRadius: 2,
                            xPadding: 10,
                            yPadding: 10
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: `Прогноз загрузки в процентах; Среднее значение: ${getAverage(getAllColumn(array, 18))}%`,
                                color: '#ffffff',
                                font: {
                                    size: 20
                                },
                                padding: {
                                    top: 10,
                                    bottom: 30
                                }
                            },
                            legend: {
                                display: false
                            },
                        } 
                    }
                },
            ];

            for(let i = 1; i <= settingsArray.length; i++) {
                drawChart(i, settingsArray[i-1]);
            }

            const rows = document.querySelectorAll(".tg tr");
            const futureDates = getAllColumn(array, 10);
            const reccomendation = getAllColumn(array, 20);
            for(let i = 0; i < futureDates.length; i++) {
                const td = document.createElement("td");
                td.classList.add("tg-0lax");
                rows[0].appendChild(td);
                rows[0].children.item(i).innerHTML = futureDates[i];
                rows[0].children.item(i).style.color = "white";
            }
            for(let i = 0; i < reccomendation.length; i++) {
                const td = document.createElement("td");
                td.classList.add("tg-0lax");
                rows[1].appendChild(td);
                rows[1].children.item(i).innerHTML = reccomendation[i];
                if (rows[1].children.item(i).innerHTML == "Down price") {
                    rows[1].children.item(i).style.color = "red";
                } else {
                    rows[1].children.item(i).style.color = "green";
                }
            }

            $('.downloadPDF').bind('click', () => {
                // get size of report page
                var reportPageHeight = $('.chartJs').attr('height') *  $('.chartJs').length ;
                var reportPageWidth = $('.chartJs').attr('width') * 3 + 50;
            
                // create a new canvas object that we will populate with all other canvas objects
                var pdfCanvas = $('<canvas />').attr({
                  id: "canvaspdf",
                  width: reportPageWidth,
                  height: reportPageHeight
                });
            
                // keep track canvas position
                var pdfctx = $(pdfCanvas)[0].getContext('2d');
                var pdfctxX = 0;
                var pdfctxY = 0;
                var buffer = 100;
                // for each chart.js chart
                $("canvas.chartJs").each(function(index) {
                  // get the chart height/width
                  var canvasHeight = $(this).innerHeight();
                  var canvasWidth = $(this).innerWidth();
                  
                  // draw the chart into the new canvas
                  pdfctx.drawImage($(this)[0], pdfctxX, pdfctxY, canvasWidth, canvasHeight);
                  pdfctxX += canvasWidth + buffer;
                  
                  // our report page is in a grid pattern so replicate that in the new canvas
                  if (index % 2 === 1) {
                    pdfctxX = 0;
                    pdfctxY += canvasHeight + buffer;
                  }
                });
                // create new pdf and add our new canvas as an image
                var pdf = new jsPDF('portrait', 'pt', [reportPageHeight, reportPageWidth]);
                pdf.addImage($(pdfCanvas)[0], 'PNG', 0, 0);
                // download the pdf
                pdf.save('report.pdf');
            });
        };

    } else {
        alert("Please select a file.");
    }

}
function drawChart(id, settings) {
    const ctx = $(`#myChart${id}`);
    new Chart(ctx, settings);
}
function getAverage(numbers) {
    const sum = numbers.reduce((acc, number) => +acc + +number, 0);
    const length = numbers.length;
    return Math.ceil(sum / length);
};
function getSumm(numbers) {
    return Math.ceil(numbers.reduce((acc, number) => +acc + +number, 0));
}
function getAllColumn(array, myIndex) {
    let newArray = [];
    array.forEach((element,i) => {
        const currentElement = array[i][0].split(';')[myIndex];
        if(isNaN(+currentElement)) {
            newArray.push(currentElement); 
        } else {
            newArray.push(+currentElement);
        }
    });
    newArray.shift();

    newArray = newArray.filter(function( element ) {
        return element !== undefined;
    });
    // console.log(newArray);
    return newArray;
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
function getColorsSequence(array, index) {
    const tickColors = [];
    getAllColumn(array, index).forEach((dataPoint) => {
        if(dataPoint == 'green') {
            tickColors.push('#07ab25')
        } else {
            tickColors.push('#ab0715')
        }
    });
    return tickColors;
}
