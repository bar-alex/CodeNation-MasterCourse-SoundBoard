const flickerInterval = 50;  // ms



const instrumentList = [];
const timeoutSink = [];


// goes through the .instrument tags, read
const scanInstruments = () => {
    console.log('inside scanInstruments');
    const instrTags = document.querySelectorAll('.instrument');
    console.log(instrTags);
    instrTags.forEach( el => {
        const name = el.getAttribute('name')
        const key = el.getAttribute('key');
        const sound = el.getAttribute('sound');
        const audio = new Audio(`sounds/${sound}`);
        console.log(name, key, sound, audio, key.split(',') );
        if(name!='') for(const k of key.split(',')){
            const audioObj = new Audio('sounds/'+sound);
            // audioObj.autoplay="true";
            // playAudio( audioObj );
            const instrument = {
                name: name,
                key: k,
                sound: sound,
                audio: audioObj,    // the audio object
                tag: el,                    // the tag
            };
            console.log('scanInstruments', instrument, instrumentList.length, sound );
            instrument.audio.load();    // maybe fixes the staggered start of the sounds ? 
            instrumentList[instrumentList.length] = instrument;
        }
    });
};


// will play the audio object received as a param
const playAudio = (audioObj,volumeLevel=1) => {
    // audioObject.volume = volumeLevel;
    console.log('playAudio', audioObj.canPlay, audioObj);
    // audioObj.muted = true;
    currentTime=0;
    audioObj.play();
};


// will display a visual tap on the html element
const visualTap = (elem) => {
    if(!elem.hasAttribute('ownColor')) elem.setAttribute('ownColor', elem.style.borderColor)
    const ownColor = elem.getAttribute('ownColor');
    elem.style.borderColor = 'red';
    timeoutSink[timeoutSink.length] = setTimeout(() => {
        elem.style.borderColor = ownColor;
    }, 100);
};


// handles keydown -- scan boxes for key attribute
const keyHandler = (evt) => {
    console.log('keyhandler <= ', evt.key, evt);
    
    for(const instr of instrumentList)
        if( evt.key.toLowerCase() == instr.key.toLowerCase() ){
            playAudio(instr.audio);
            visualTap(instr.tag.parentNode);
        }
};


const clickHandler = (evt) => {
    const spanElem = evt.target.querySelector('span');
    console.log('spaneleme',spanElem);
    const name = spanElem.getAttribute('name');
    const audioObj = instrumentList.filter( el => el.name.toLowerCase() == name.toLowerCase() )[0].audio;
    console.log('clickHandler', name, audioObj);
    if(audioObj instanceof Audio){
        playAudio(audioObj);
        visualTap(evt.target);
    }
};




// const xx = new Audio('/sounds/snare.wav');
// // xx.muted = true;
// setTimeout( () => {
//     xx.play(); 
//     xx.currentTime=0;
//     console.log( xx.play() );
// },1000 );



// scan teh instrument tags and builds the instrument list with name / key / sound / audioObject, tagObject
scanInstruments();

//  ind keypress event to document
document.addEventListener( "keydown", keyHandler );


// add the letters to the boxes and bind the click event as well
const boxes = document.getElementById("scene").getElementsByClassName('box');
[...boxes].forEach( el => { 
    // el.textContent = el.getAttribute('key');
    //el.addEventListener( "click",  clkHandler ); 
    el.addEventListener( "click",  clickHandler );
});

// [...boxes].addEventListener( "click",  clickHandler );





// document.getElementById('test').addEventListener('click', (evt) => {
//     const context = new AudioContext();

//     function playSound() {
//         const source = context.createBufferSource();
//         source.buffer = dogBarkingBuffer;
//         source.connect(context.destination);
//         source.start(0);
//     }

    
//     playSound();
// });