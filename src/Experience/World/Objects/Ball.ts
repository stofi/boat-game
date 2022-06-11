import * as THREE from 'three'
import * as gui from 'lil-gui'
import Base from './Base'

import shader from '../../Shaders/CustomMaterials/Ball'

import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

class Ball extends Base {
    group: THREE.Group
    gui!: gui.GUI
    constructor() {
        super(false)
        this.group = new THREE.Group()
        this.scene.add(this.group)
        this.initialize()
    }

    initialize() {
        this.geometry = new THREE.BoxBufferGeometry(1, 1, 1)
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            roughness: 0.8,
            metalness: 0,
            side: THREE.DoubleSide,
        })

        this.material = new CustomShaderMaterial({
            baseMaterial,
            ...shader,
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)

        this.mesh.position.set(0, 3, 0)
        this.mesh.castShadow = true
        this.group.add(this.mesh)
        this.gui = this.experience.gui.addFolder('Ball')
        // noop
    }

    resize() {
        // noop
    }

    update() {
        if (
            this.material &&
            (this.material instanceof THREE.ShaderMaterial ||
                this.material instanceof CustomShaderMaterial)
        ) {
            this.material.uniforms.uTime.value =
                this.experience.time.elapsed / 1000

            const mouse = this.experience.mouse.worldPosition

            // rotate mouse by 45 degrees on y axis
            const mouseRotated = new THREE.Vector3(mouse.x, mouse.y, mouse.z)
            // mouseRotated.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4)

            this.material.uniforms.uOffset.value = new THREE.Vector2(
                -mouseRotated.x,
                -mouseRotated.z
            ).multiplyScalar(1)
        }
    }
}
export default Ball
