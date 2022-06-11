import * as THREE from 'three'
import * as gui from 'lil-gui'
import Experience from './Experience'

class Mouse {
    experience: Experience
    scene: THREE.Scene

    worldPosition: THREE.Vector3
    screenPosition: THREE.Vector3

    gui: gui.GUI

    plane: THREE.Mesh

    raycaster: THREE.Raycaster

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.worldPosition = new THREE.Vector3()
        this.screenPosition = new THREE.Vector3()
        this.gui = this.experience.gui.addFolder('Mouse')
        this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(10000, 10000))
        this.plane.rotation.x = -Math.PI / 2
        this.plane.position.y = 0
        this.plane.visible = false
        this.scene.add(this.plane)
        this.raycaster = new THREE.Raycaster()
        this.addListeners()
    }

    addListeners() {
        window.addEventListener('mousemove', this.onMouseMove.bind(this))
        // window.addEventListener('mousedown', this.onMouseDown.bind(this))
        // window.addEventListener('mouseup', this.onMouseUp.bind(this))
    }
    removeListeners() {
        window.removeEventListener('mousemove', this.onMouseMove.bind(this))
        // window.removeEventListener('mousedown', this.onMouseDown.bind(this))
        // window.removeEventListener('mouseup', this.onMouseUp.bind(this))
    }

    onMouseMove(event: MouseEvent) {
        this.screenPosition.x = (event.clientX / window.innerWidth) * 2 - 1
        this.screenPosition.y = -(event.clientY / window.innerHeight) * 2 + 1
        this.raycaster.setFromCamera(
            this.screenPosition,
            this.experience.camera.instance
        )
        const intersects = this.raycaster.intersectObjects([this.plane])
        if (intersects.length > 0) {
            this.worldPosition.copy(intersects[0].point)
        }
    }

    // resize() {
    // }

    // update() {
    // }
}
export default Mouse
