var gulp = require('gulp');

var browserSync = require('browser-sync').create();

var KarmaServer = require('karma').Server;



gulp.task('test', () => {

  var karmaConfig = {

    configFile: __dirname + '/karma.conf.js',

    singleRun: false,

    autoWatch: true,

    usePolling: true

  };



  var karmaInstance = new KarmaServer(karmaConfig, _onKarmaExit);



  // get Karma's web server instance

  var karmaWebServer = karmaInstance.get('webServer');



  // listen on listening event and grab the address to pass to browserSync

  karmaWebServer.on('listening', _getConnectionDetails);



  karmaInstance.on('file_list_modified', browserSync.reload);



  karmaInstance.start();



  function _getConnectionDetails() {

    var connectionDetails = karmaWebServer.address();

    var debugAddress = [

      'http://localhost:',

      connectionDetails.port,

      '/debug.html'

    ].join('');



    _startBrowserSync(debugAddress);

  }



  function _startBrowserSync(debugAddress) {

    browserSync.init({

      open: true,

      reloadOnRestart: true,

      proxy: debugAddress

    });

  }



  function _onKarmaExit(exitCode) {

    process.exit(exitCode);

  }

});



gulp.task('default', ['test']);
