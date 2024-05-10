import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

const pointer = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
camera.position.set(55, 0, 30)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false
camera.lookAt(new THREE.Vector3(-400,100,0))
//controls.target.set(-350,0,-100)
//controls.update()
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes

	//lights
	lights.defaultLight = addLight()

	//changes
	// meshes.default.scale.set(2, 2, 2)

	//scene operations
	scene.add(meshes.default)
	scene.add(meshes.standard)
	scene.add(lights.defaultLight)

	models()
	resize()
	animate()
	raycast()
	//setupSongs()
}



function models() {
	//How we add models
	const textureLoader = new THREE.TextureLoader();
      const panoramaTexture = textureLoader.load('aquariumTexture.jpg');
      panoramaTexture.mapping = THREE.EquirectangularReflectionMapping;

      const geometry = new THREE.SphereGeometry(500, 60, 40);
      const material = new THREE.MeshBasicMaterial({ map: panoramaTexture, side: THREE.BackSide });

      const skybox = new THREE.Mesh(geometry, material);
      scene.add(skybox);
	const Aquarium = new Model({
		url: '/scene.gltf',
		name: 'aquarium',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(2, 2, 2),
		rotation: new THREE.Vector3(0, Math.PI / 2, 0),
	})
	Aquarium.initFBX()

	//we can specify rotation, scale or position to place models inside one another, beside one another etc.
	const Fish = new Model({
		url: '/fish_animated.glb',
		name: 'fish',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(.6, .6, .6),
		position: new THREE.Vector3(-200, 172, -55),
		rotation: new THREE.Vector3(0,13,-1),
	})
	Fish.init()

	

	const shell = new Model({
		url: '/shell.glb',
		name: 'shell',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(.6, .6, .6),
		position: new THREE.Vector3(-300, -100, -60),
	})
	shell.init()

	const bubble1 = new Model({
		url: '/bubble.glb',
		name: 'bubbble',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(500,500,500),
		position: new THREE.Vector3(-350, -70, -65),
	})
	bubble1.init()

	const bubble2 = new Model({
		url: '/bubble2.glb',
		name: 'bubbble2',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(800,800,800),
		position: new THREE.Vector3(-250, 50, -160),
	})
	bubble2.init()

	const bubble3 = new Model({
		url: '/bubble3.glb',
		name: 'bubbble3',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(330,330,330),
		position: new THREE.Vector3(-80, 30, 100),
	})
	bubble3.init()

	const bubble4 = new Model({
		url: '/bubble4.glb',
		name: 'bubbble4',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(900,900,900),
		position: new THREE.Vector3(-350, -70, 120),
	})
	bubble4.init()
	
	const bubble5 = new Model({
		url: '/bubble5.glb',
		name: 'bubbble5',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(350,350,350),
		position: new THREE.Vector3(-350,-50,-160),
	})
	bubble5.init()

	const bubble6 = new Model({
		url: '/bubble6.glb',
		name: 'bubbble6',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(700,700,700),
		position: new THREE.Vector3(-200, 180, -65),
	})
	bubble6.init()


	const turtle = new Model({
		url: '/turtle.glb',
		name: 'turtle',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(50, 50, 50),
		position: new THREE.Vector3(-300, 80, -320),
		rotation: new THREE.Vector3(0,160,120),
	})
	turtle.init()

	const starfish = new Model({
		url: '/starfish.glb',
		name: 'starfish',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(40, 40, 40),
		position: new THREE.Vector3(-400, -70, 140),
		rotation: new THREE.Vector3(0,160,120),
	})
	starfish.init()

	const crab = new Model({
		url: '/crab.glb',
		name: 'crab',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(6,6,6),
		position: new THREE.Vector3(-350,-70,-160),
		rotation: new THREE.Vector3(0,90,0),
	})
	crab.init()

	const jellyfish = new Model({
		url: '/newjelly.glb',
		name: 'jellyfish',
		meshes: meshes,
		scene: scene,
		scale: new THREE.Vector3(5,5,5),
		position: new THREE.Vector3(-100, 5, 100),
		rotation: new THREE.Vector3(0,160,120)
	})
	jellyfish.init()
}
function raycast() {
	window.addEventListener('click', (event) => {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(pointer, camera)
		const intersects = raycaster.intersectObjects(scene.children, true)
		for (let i = 0; i < intersects.length; i++) {
			let object = intersects[i].object
			while (object) {
				if (object.userData.groupName === 'shell') {
					const songs = document.querySelectorAll ('.songs')
					const song1 = document.querySelector ('#sound1')
					const song2 = document.querySelector ('#sound2')
					songs.forEach((song)=>{
						song.pause()
					})
					song1.play()
					gsap.to(meshes.shell.scale, {
						x: 1.3,
						y: 1.3,
						z: 1.3,
						duration: 0.5,
						
					})
					
					break
				}
				if (object.userData.groupName === 'crab') {
					const songs = document.querySelectorAll ('.songs')
					const song1 = document.querySelector ('#sound1')
					const song2 = document.querySelector ('#sound2') 
					songs.forEach((song)=>{
						song.pause()
					})
					song2. play()
					

					gsap.to(meshes.crab.rotation, {
						x: '+=100',
						y: '+=100',
						z: '+=100',
						duration: 60,
					})


					break
				}
				
				if (object.userData.groupName === 'jellyfish') {
					const songs = document.querySelectorAll ('.songs')
					const song1 = document.querySelector ('#sound1')
					const song2 = document.querySelector ('#sound2') 
					const song3 = document.querySelector ('#sound3') 
					songs.forEach((song)=>{
						song.pause()
					})
					song3. play()

					gsap.to(meshes.jellyfish.rotation, {
						x: '+=200',
						y: '+=200',
						z: '+=200',
						duration: 60,
					})
					break
				}


				if (object.userData.groupName === 'fish') {
					const songs = document.querySelectorAll ('.songs')
					const song1 = document.querySelector ('#sound1')
					const song2 = document.querySelector ('#sound2') 
					const song3 = document.querySelector ('#sound3') 
					const song4 = document.querySelector ('#sound4') 
					songs.forEach((song)=>{
						song.pause()
					})
					song4. play()
					gsap.to(meshes.fish.rotation, {
						x: '+=100',
						y: '+=100',
						z: '+=0',
						duration: 60,
					})


					break
			}
			if (object.userData.groupName === 'starfish') {
				const songs = document.querySelectorAll ('.songs')
				const song1 = document.querySelector ('#sound1')
				const song2 = document.querySelector ('#sound2') 
				const song3 = document.querySelector ('#sound3') 
				const song4 = document.querySelector ('#sound4') 
				const song5 = document.querySelector ('#sound5') 
				songs.forEach((song)=>{
					song.pause()
				})
				song5. play()
				gsap.to(meshes.starfish.rotation, {
					x: '+=150',
					y: '+=150',
					z: '+=150',
					duration: 60,
				})


				break
			}
			if (object.userData.groupName === 'turtle') {
				const songs = document.querySelectorAll ('.songs')
				const song1 = document.querySelector ('#sound1')
				const song2 = document.querySelector ('#sound2') 
				const song3 = document.querySelector ('#sound3') 
				const song4 = document.querySelector ('#sound4') 
				const song5 = document.querySelector ('#sound5') 
				const song6 = document.querySelector ('#sound6') 
				songs.forEach((song)=>{
					song.pause()
				})
				song6. play()
				gsap.to(meshes.turtle.scale, {
					x: 60,
					y: 60,
					z: 60,
					duration: 0.5,
					
				})


				break
			}
				object = object.parent
			}
		}
	})
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function animate() {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()

	renderer.render(scene, camera)
}
