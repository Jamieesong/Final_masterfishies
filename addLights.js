import * as THREE from 'three'

export function addLight() {
	const light = new THREE.DirectionalLight(0xffffff, 5)
	light.position.set(300, 0, 0)
	return light
}


