// font stole here http://www.wab.com/?screen=262
// sorry had no time to create a new one :<
var myfont = new image('/images/font_c3.png');
var mycanvas, mod;
var my3d;
//var mycanvasoff;
var mystarfield;
var myscrolltext;
var myscrollparam = [{
    myvalue: 0,
    amp: 40,
    inc: 0.35,
    offset: -0.03
}, ];

function initDemo() {
    var ready_to_play = 0;
    mod = new Protracker();
    mod.onReady = function() {
        ready_to_play = 1;
    }
    mod.setautostart(false);
    mod.load("tunes/between2.mod");
    mod.repeat = true;

    //mod.setautostart(true);
    //mod.play();
    myfont.initTile(18, 20, 0x20);
    myscrolltext = new scrolltext_horizontal();
    myscrolltext.scrtxt = scroller_text;
    mycanvas = new canvas(640, 480, "democanvas");
    mystarfield = new starfield3D(mycanvas, 200, 2, 640, 480, 320, 240, '#FFFFFF', 10, 30, 0);
    myscrolltext.init(mycanvas, myfont, 1.7, myscrollparam);
    
    my3d=new codef3D(mycanvas, 900, 100, 1, 3000 );
    my3d.faces(myobjvert,myobj2, true, false );
    my3d.group.position.x = 100
    my3d.addAmbiLight(0x505080);
    my3d.addDirLight(0.5,0.5,0.5,0x5050ff);

    //fakeCRT() // disabled too heavy :)

    requestAnimFrame(go);
}

function go() {
    mycanvas.clear();
    //mycanvasoff.clear();
    myscrolltext.draw(240 + 140);
    mystarfield.draw();
    my3d.group.rotation.x+=0.00;
    my3d.group.rotation.y+=0.04;
    my3d.group.rotation.z+=0.00;
    my3d.draw();

    requestAnimFrame(go);
}

var lines = new Image();
lines.src = 'images/scanlines.png';

function fakeCRT() {
    var glcanvas, source, srcctx, texture, w, h, hw, hh, w75;

    // Try to create a WebGL canvas (will fail if WebGL isn't supported)
    try {
        glcanvas = fx.canvas();
    } catch (e) {
        return;
    }

    // Assumes the first canvas tag in the document is the 2D game, but
    // obviously we could supply a specific canvas element here.
    source = document.getElementsByTagName('canvas')[0];
    srcctx = source.getContext('2d');

    // This tells glfx what to use as a source image
    texture = glcanvas.texture(source);

    // Just setting up some details to tweak the bulgePinch effect
    w = source.width;
    h = source.height;
    hw = w / 2;
    hh = h / 2;
    w75 = w * 0.75;

    // Hide the source 2D canvas and put the WebGL Canvas in its place
    source.parentNode.insertBefore(glcanvas, source);
    source.style.display = 'none';
    glcanvas.className = source.className;
    glcanvas.id = source.id;
    source.id = 'old_' + source.id;

    // It is pretty silly to setup a separate animation timer loop here, but
    // this lets us avoid monkeying with the source game's code.
    // It would make way more sense to do the following directly in the source
    // game's draw function in terms of performance.
    setInterval(function() {
        // Give the source scanlines
        srcctx.drawImage(lines, 0, 0, w, h);

        // Load the latest source frame
        texture.loadContentsOf(source);

        // Apply WebGL magic
        glcanvas.draw(texture)
            .bulgePinch(hw, hh, w75, 0.12)
            .vignette(0.25, 0.74)
            .update();
    }, Math.floor(1000 / 40));
}

function player_cmd(obj, mod){
    if(mod.playing){
        mod.pause();
    }else{
        mod.play();
    }

    obj.children('span').toggleClass('glyphicon-play');
    obj.children('span').toggleClass('glyphicon-pause');

}
