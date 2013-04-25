var renderer
  , camera
  , scene
  , mesh;

var isAnimating = false;

var inps = {};
$(document).keydown(function (e) {
  if (e.keyCode >= 37 && e.keyCode <= 40) {
    inps[e.keyCode] = true;
    isAnimating = true;
  }
});

$(document).keyup(function (e) {
  if (e.keyCode >= 37 && e.keyCode <= 40) {
    inps[e.keyCode] = false;
    isAnimating = false;
    for (var i in inps)
      if (inps[i])
        isAnimating = true;
  }
});

function initialize() {
  // set the scene size
  var WIDTH  = 1440
    , HEIGHT = 700;

  // set some camera attributes
  var VIEW_ANGLE = 45
    , ASPECT     = WIDTH / HEIGHT
    , NEAR       = 0.1
    , FAR        = 10000;

  // get the DOM element to attach to
  // - assume we've got jQuery to hand
  var $container = $('#container');

  // create a WebGL renderer, camera
  // and a scene
  renderer = new THREE.WebGLRenderer();
  camera   = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene    = new THREE.Scene();

  // add the camera to the scene
  scene.add(camera);

  // the camera starts at 0,0,0
  // so pull it back
  camera.position.y = -200;
  camera.position.z = 100;
  camera.lookAt(new THREE.Vector3(0, 100, 0));

  // start the renderer
  renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DOM element
  $container.append(renderer.domElement);


  var land = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40, 80, 80),
    new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('models/land.jpg') })
  );

  land.scale.x = land.scale.y = land.scale.z = 10;
  scene.add(land);

  var material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('models/char.jpg') });

  var loader = new THREE.JSONLoader(false);
  loader.load('models/char.js', function (geometry) {
    material.morphTargets = true;
    // material.shading = THREE.FlatShading;
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = mesh.position.y = mesh.position.z = 0;
    mesh.rotation.z = 0;
    mesh.rotation.x = Math.PI / 2;
    mesh.rotation.y = Math.PI;

    mesh.scale.x = mesh.scale.y = mesh.scale.z = 40;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    scene.add(mesh);
  });

  // create a point light
  var pointLight =
    new THREE.PointLight(0xFFFFFF);

  // set its position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  // add to the scene
  scene.add(pointLight);
}

function animate() {
  requestAnimationFrame(animate);
  checkInputs();
  render();
}

var SPEED = 1.5;
function checkInputs() {
  if (inps[37]) {
    mesh.rotation.y = Math.PI * 3 / 2;
    mesh.position.x -= SPEED;
    mesh.updateMatrix();
  }

  if (inps[38]) {
    mesh.rotation.y = Math.PI;
    mesh.position.y += SPEED;
    mesh.updateMatrix();
  }

  if (inps[39]) {
    mesh.rotation.y = Math.PI / 2;
    mesh.position.x += SPEED;
    mesh.updateMatrix();
  }

  if (inps[40]) {
    mesh.rotation.y = 0;
    mesh.position.y -= SPEED;
    mesh.updateMatrix();
  }
}

var duration        = 400
  , keyframes       = 20
  , interpolation   = duration / keyframes
  , lastKeyframe    = 0
  , currentKeyframe = 0
  , animOffset      = 395;

function render() {
  if (mesh && isAnimating) {
    var time = new Date().getTime() % duration;
    var keyframe = Math.floor( time / interpolation ) + animOffset;
    if (keyframe != currentKeyframe) {
      mesh.morphTargetInfluences[ lastKeyframe ] = 0;
      mesh.morphTargetInfluences[ currentKeyframe ] = 1;
      mesh.morphTargetInfluences[ keyframe ] = 0;
      lastKeyframe = currentKeyframe;
      currentKeyframe = keyframe;
    }
  }

  renderer.render(scene, camera);
}
