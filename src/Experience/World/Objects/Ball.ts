import * as THREE from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import * as gui from 'lil-gui'
import Base from './Base'

import shader from '../../Shaders/CustomMaterials/Ball'

import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

class Ball extends Base {
    group: THREE.Group
    gui!: gui.GUI
    rotation = 0
    rotationSpeed = 0.2
    input = {
        left: false,
        right: false,
    }

    constructor() {
        super(false)
        this.group = new THREE.Group()
        this.scene.add(this.group)
        this.initialize()
    }

    initialize() {
        const gltf = this.experience.resources.items['ship'] as GLTF

        const meshes = gltf.scene.children.reduce((acc, child) => {
            if (!child) return acc
            if (child.type !== 'Mesh') return acc
            acc.push(child as THREE.Mesh)
            return acc
        }, [] as THREE.Mesh[])

        const shipmesh = meshes[0]

        if (!shipmesh) {
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
        } else {
            const baseMaterial = Array.isArray(shipmesh.material)
                ? shipmesh.material[0]
                : shipmesh.material

            this.material = new CustomShaderMaterial({
                baseMaterial,
                ...shader,
            })
            this.mesh = shipmesh
            this.mesh.material = this.material
        }
        this.mesh.position.set(0, 3, 0)

        this.mesh.castShadow = true
        this.group.add(this.mesh)
        this.gui = this.experience.gui.addFolder('Ball')

        if (this.material instanceof CustomShaderMaterial) {
            this.gui.add(this.material.uniforms.uA, 'value', 0, 1)
        }
        if (this.material instanceof CustomShaderMaterial) {
            this.gui.add(this.material.uniforms.uB, 'value', 0, 1)
        }
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

            // this.material.uniforms.uOffset.value = new THREE.Vector2(
            //     mouseRotated.x,
            //     mouseRotated.z
            // ).multiplyScalar(0.5)

            // if (this.mesh) {
            //     this.mesh.position.z = mouse.z
            //     this.mesh.position.x = mouse.x
            // }
            this.material.uniforms.uZRotation.value = this.rotation
        }
        if (this.mesh) {
            // this.rotation += 0.01
            this.mesh.rotation.y = this.rotation
            //     this.calculateRotation() * this.rotationSpeed
            // this.rotation = this.mesh.rotation.y
        }
    }
}
export default Ball
