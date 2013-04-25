var
  camera,
  projector,
  scene,
  renderer,
  mesh,
  animOffset = 30,
  walking = false,
  stats;

function initialize() {
  /*camera = new THREE.FirstPersonCamera( {
    fov: 60,
    aspect: window.innerWidth / window.innerHeight,
    near: 1,
    far: 20000,
    movementSpeed: 100,
    lookSpeed: 0.01,
    noFly: true,
    lookVertical: true
  });*/
  camera = new THREE.Camera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.y = 130;
  camera.position.x = -100;
  camera.position.z = 100;
  camera.target.position.y = 60; 
  
  scene = new THREE.Scene();
  
  // Add Troll
  var loader = new THREE.JSONLoader();
  loader.load( { model: "assets/obj/troll.js", callback: createScene } );
  
  // Create renderer
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  
  document.body.appendChild(renderer.domElement);
  document.addEventListener("keydown", toggleWalk, false);
  
  // Append stats
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  document.body.appendChild( stats.domElement );
}

function toggleWalk(e) {
  var i;

  if ( e.keyCode === 32 ) {
    
    if ( !walking ) {
      animOffset = 0;
      duration = 1000;
      keyframes = 30;
      interpolation = duration / keyframes;
      lastKeyframe = 0;
      currentKeyframe = 0;
      walking = true;
    } else {
      animOffset = 30;
      duration = 5000;
      keyframes = 150;
      interpolation = duration / keyframes;
      lastKeyframe = 0;
      currentKeyframe = 0;
      walking = false;
    }
    
    for ( i = 0; i < mesh.morphTargetInfluences.length; i++ ) {
      mesh.morphTargetInfluences[i] = 0;
    }
  }
}

function createScene( geometry ) {
  
  geometry.materials[0][0].shading = THREE.FlatShading;
  geometry.materials[0][0].morphTargets = true;
  
  var material = new THREE.MeshFaceMaterial();
    
  mesh = new THREE.Mesh( geometry, material );
  mesh.scale.set(50, 50, 50);
  
  scene.addObject( mesh );
}

function animate() {
  requestAnimationFrame( animate );
  
  render();
  stats.update();
}

var 
  duration = 5000,
  keyframes = 150,
  interpolation = duration / keyframes,
  lastKeyframe = 0, currentKeyframe = 0;

function render() {
  
  if ( mesh ) {

    // Alternate morph targets

    var time = new Date().getTime() % duration;

    var keyframe = Math.floor( time / interpolation ) + animOffset;

    if ( keyframe != currentKeyframe ) {

      mesh.morphTargetInfluences[ lastKeyframe ] = 0;
      mesh.morphTargetInfluences[ currentKeyframe ] = 1;
      mesh.morphTargetInfluences[ keyframe ] = 0;

      lastKeyframe = currentKeyframe;
      currentKeyframe = keyframe;

    }
    
    mesh.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
    mesh.morphTargetInfluences[ lastKeyframe ] = 1 - mesh.morphTargetInfluences[ keyframe ];

  }
  
  renderer.render( scene, camera );
}