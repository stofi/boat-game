import * as THREE from 'three'
import Experience from '../Experience'

class Environment {
    experience: Experience
    scene: THREE.Scene

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.addAmbientLight('#ffffff', 0.4)
        this.addDirectionalLight('#ffffff', 0.5)
    }

    setBackground(color: string) {
        this.scene.background = new THREE.Color(color)
    }

    addAmbientLight(color: string, intensity = 0.5) {
        const light = new THREE.AmbientLight(color, intensity)
        this.scene.add(light)
    }
    addDirectionalLight(color: string, intensity = 0.5) {
        const light = new THREE.DirectionalLight(color, intensity)
        light.position.set(-8, 10, -12)
        light.castShadow = true
        light.shadow.camera.left = -100
        light.shadow.camera.right = 100
        light.shadow.camera.top = 100
        light.shadow.camera.bottom = -100
        light.shadow.camera.near = 0
        light.shadow.camera.far = 500
        light.shadow.mapSize.width = 2048
        light.shadow.mapSize.height = 2048

        // add heleper to see the shadow camera
        const helper = new THREE.CameraHelper(light.shadow.camera)
        this.scene.add(helper)

        this.scene.add(light)
    }
}
export default Environment
