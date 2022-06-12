import * as THREE from 'three'

import type Sizes from './Utils/Sizes'

import Experience from './Experience'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'

interface CameraOptions {
    controls?: 'orbit' | 'first-person'
}

class Camera {
    experience: Experience
    sizes: Sizes
    scene: THREE.Scene
    canvas: HTMLCanvasElement
    options: CameraOptions
    instance!: THREE.PerspectiveCamera | THREE.OrthographicCamera
    controls?: OrbitControls | FirstPersonControls

    // getters
    get useFirstPersonControls() {
        return this.options.controls === 'first-person'
    }

    get useOrbitControls() {
        return this.options.controls === 'orbit'
    }

    constructor(options: CameraOptions = {}) {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.options = options

        this.setInstance()
    }

    private setInstance() {
        const ratio = this.sizes.width / this.sizes.height
        const d = this.sizes.height / 200
        // this.instance = new THREE.OrthographicCamera(
        //     (-ratio * d) / 2,
        //     (ratio * d) / 2,
        //     d / 2,
        //     -d / 2,
        //     -100,
        //     100
        // )
        this.instance = new THREE.PerspectiveCamera(2, ratio, 0.1, 1000)

        this.instance.zoom = 0.2
        const y = 2
        // this.instance.position.set(14, 6 + y, -9)
        this.instance.position.set(155, 75, -100)

        this.scene.add(this.instance)
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25
        this.controls.enablePan = false
        this.controls.minZoom = 0.1
        this.controls.maxZoom = 1
        this.controls.maxDistance = 200
        this.controls.minAzimuthAngle = Math.PI / 2
        this.controls.maxAzimuthAngle = Math.PI
        this.controls.maxPolarAngle = (4 * Math.PI) / 9
        this.controls.target.set(0, y + 2, 0)
        // this.controls.minPolarAngle = -Math.PI / 2
    }

    resize() {
        if (this.instance instanceof THREE.PerspectiveCamera) {
            this.instance.aspect = this.sizes.width / this.sizes.height
            this.instance.updateProjectionMatrix()
        } else if (this.instance instanceof THREE.OrthographicCamera) {
            const ratio = this.sizes.width / this.sizes.height
            const d = this.sizes.height / 200
            this.instance.left = (-ratio * d) / 2
            this.instance.right = (ratio * d) / 2
            this.instance.top = d / 2
            this.instance.bottom = -d / 2
            this.instance.updateProjectionMatrix()
        }
    }

    update() {
        if (this.controls instanceof FirstPersonControls) {
            this.controls.update(this.experience.time.delta / 1000)
        } else if (this.controls instanceof OrbitControls) {
            this.controls.update()
        }
    }
}

export default Camera
