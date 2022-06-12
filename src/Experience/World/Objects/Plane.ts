import * as THREE from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import * as gui from 'lil-gui'
import Base from './Base'

import waterShader from '../../Shaders/CustomMaterials/Water'

import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

class Plane extends Base {
    scale = 160
    gui!: gui.GUI
    constructor() {
        super(false)
        this.initialize()
    }

    initialize() {
        const gltf = this.experience.resources.items['plane'] as GLTF

        const meshes = gltf.scene.children.reduce((acc, child) => {
            if (!child) return acc
            if (child.type !== 'Mesh') return acc
            acc.push(child as THREE.Mesh)
            return acc
        }, [] as THREE.Mesh[])

        const planemesh = meshes[0]

        // this.geometry = planemesh.geometry
        this.geometry = new THREE.PlaneBufferGeometry(
            this.scale,
            this.scale,
            1024,
            1024
        )
        // this.material = new THREE.ShaderMaterial({
        //     ...waterShader,
        //     side: THREE.DoubleSide,
        // })

        const baseMaterial = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            roughness: 0,
            metalness: 0,
            side: THREE.DoubleSide,
            transparent: true,
        })
        this.material = new CustomShaderMaterial({
            baseMaterial,
            ...waterShader,
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.receiveShadow = true
        this.mesh.castShadow = true
        this.mesh.rotation.x = Math.PI / 2

        // this.mesh.visible = false
        this.scene.add(this.mesh)

        // this.mesh.position.y = -5

        this.gui = this.experience.gui.addFolder('Plane')
        if (
            this.material instanceof THREE.ShaderMaterial ||
            this.material instanceof CustomShaderMaterial
        ) {
            this.gui
                .add(this.material.uniforms.uHeight, 'value', 0, 100)
                .name('Height')
            this.gui.add(this.material.uniforms.uA, 'value', 0, 1).name('A')
            this.gui.add(this.material.uniforms.uB, 'value', 0, 1).name('B')

            this.gui
                .addColor(this.material.uniforms.uColor1, 'value')
                .name('Color 1')
            this.gui
                .addColor(this.material.uniforms.uColor2, 'value')
                .name('Color 2')
            this.gui
                .addColor(this.material.uniforms.uLightColor1, 'value')
                .name('Color 1')
            this.gui
                .addColor(this.material.uniforms.uLightColor2, 'value')
                .name('Color 2')
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
            //     -mouseRotated.x,
            //     -mouseRotated.z
            // ).multiplyScalar(1 / this.scale)
        }
    }
}
export default Plane
