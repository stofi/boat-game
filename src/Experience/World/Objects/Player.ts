import * as THREE from 'three'
import Base from './Base'

import basicShader from '../../Shaders/Basic'

class Plane extends Base {
    constructor() {
        super(false)
        this.initialize()
    }

    initialize() {
        this.geometry = new THREE.PlaneBufferGeometry(2, 2)
        this.material = new THREE.ShaderMaterial({
            ...basicShader,
            side: THREE.DoubleSide,
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)

        this.mesh.rotation.x = Math.PI / 2

        this.scene.add(this.mesh)

        // noop
    }

    resize() {
        // noop
    }

    update() {
        // noop
    }
}
export default Plane
