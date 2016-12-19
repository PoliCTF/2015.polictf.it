      var player;

      function init() {
        if (player == undefined) {
          player = new ChiptuneJsPlayer(new ChiptuneJsConfig(1));
        }
        else {
          player.stop();
          playPauseButton();
        }
      }

      if(typeof(String.prototype.trim) === "undefined")
      {
          String.prototype.trim = function() 
          {
              return String(this).replace(/^\s+|\s+$/g, '');
          };
      }


      function setMetadata(filename) {
        var metadata = player.metadata();
        if (metadata['title'] != '') {
          document.getElementById('title').innerHTML = metadata['title'];
        } else {
          document.getElementById('title').innerHTML = filename;
        }

        if (metadata['artist'] != '') {
          document.getElementById('artist').innerHTML = '<br />' + metadata['artist'];
        }
        else if ( metadata['message'] ){
          document.getElementById('artist').innerHTML = metadata['message'].trim().replace(/(\r\n|\n|\r)/gm,"");
        }
        else {
          document.getElementById('artist').innerHTML = '';
        }
      }

      function loadURL(path) {
        init();
        player.load(path, function(buffer) {
          player.play(buffer);
          setMetadata(path);
          pausePauseButton();
        });
      }

      function loadFile(file) {
        init();
        player.load(file, function(buffer) {
          player.play(buffer);
          setMetadata(file.name);
          pausePauseButton();
        });
      }

      function pauseButton() {
        player.togglePause();
        switchPauseButton();
      }

      function switchPauseButton() {
        var button = document.getElementById('pause')
        if (button) {
          button.id = "play_tmp";
          button.className = 'fa fa-play'
        }
        button = document.getElementById('play')
        if (button) {
          button.id = "pause";
          button.className = 'fa fa-pause'
        }
        button = document.getElementById('play_tmp')
        if (button) {
          button.id = "play";
          button.className = 'fa fa-play';
        }
      }

      function playPauseButton() {
        var button = document.getElementById('pause')
        if (button) {
          button.id = "play";
          button.className = 'fa fa-play';
        }
      }

      function pausePauseButton() {
        var button = document.getElementById('play')
        if (button) {
          button.id = "pause";
          button.className = 'fa fa-pause'
        }
      }