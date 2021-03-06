import * as THREE from 'three'
import * as gui from 'lil-gui'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass.js'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'
import { BlendShader } from 'three/examples/jsm/shaders/BlendShader.js'

import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'

import Experience from './Experience'
import processingShader from './Shaders/Processing'

import type Sizes from './Utils/Sizes'
import type Camera from './Camera'

class Renderer {
    experience: Experience
    canvas: HTMLCanvasElement
    sizes: Sizes
    scene: THREE.Scene
    camera: Camera
    instance!: THREE.WebGLRenderer
    effects!: EffectComposer
    renderPass!: RenderPass
    processingPass!: ShaderPass
    blendPass!: ShaderPass
    savePass!: SavePass
    bokehPass!: BokehPass
    outputPass!: ShaderPass
    target!: THREE.WebGLRenderTarget
    gui!: gui.GUI

    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.gui = this.experience.gui.addFolder('Renderer')

        this.setInstance()
    }

    private setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
        })
        this.instance.shadowMap.enabled = true

        this.target = new THREE.WebGLRenderTarget(4, 3, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
        })

        this.effects = new EffectComposer(this.instance, this.target)
        this.resize()
        this.renderPass = new RenderPass(this.scene, this.camera.instance)

        this.processingPass = new ShaderPass(processingShader)
        this.processingPass.enabled = true

        // save pass

        this.savePass = new SavePass(
            new THREE.WebGLRenderTarget(
                this.experience.sizes.width,
                this.experience.sizes.height
            )
        )
        this.bokehPass = new BokehPass(
            this.scene,
            this.experience.camera.instance,
            {
                focus: 1.0,
                aperture: 0.0001,
                maxblur: 0.8,
                width: this.experience.sizes.width,
                height: this.experience.sizes.height,
            }
        )

        // blend pass
        this.blendPass = new ShaderPass(BlendShader, 'tDiffuse1')
        this.blendPass.uniforms['tDiffuse2'].value =
            this.savePass.renderTarget.texture
        this.blendPass.uniforms['mixRatio'].value = 0.5

        // output pass
        this.outputPass = new ShaderPass(CopyShader)
        this.outputPass.renderToScreen = true

        this.effects.addPass(this.renderPass)
        this.effects.addPass(this.blendPass)
        this.effects.addPass(this.savePass)
        this.effects.addPass(this.bokehPass)
        this.effects.addPass(this.outputPass)
        this.effects.addPass(this.processingPass)

        this.instance.setClearColor(0x000000, 0)
        this.turnOffEffects()
        this.setGUI()
    }
    turnOffEffects() {
        this.processingPass.enabled = false
        this.blendPass.enabled = false
        this.savePass.enabled = false
        this.outputPass.enabled = false
        this.bokehPass.enabled = false
    }
    turnOnEffects() {
        this.processingPass.enabled = true
        this.blendPass.enabled = true
        this.savePass.enabled = true
        this.outputPass.enabled = true
        this.bokehPass.enabled = true
    }
    setGUI() {
        this.gui.add(this.renderPass, 'enabled').name('Render Pass')
        this.gui.add(this.blendPass, 'enabled').name('Blend Pass')
        this.gui
            .add(this.blendPass.uniforms.mixRatio, 'value', 0, 0.99)
            .name('Blend Ratio')
        this.gui.add(this.savePass, 'enabled').name('Save Pass')
        this.gui.add(this.bokehPass, 'enabled').name('Bokeh Pass')

        this.gui
            .add(
                (this.bokehPass.uniforms as any).focus,
                'value',
                0.0,
                3000.0,
                10
            )
            .name('Bokeh Focus')
        this.gui
            .add(
                (this.bokehPass.uniforms as any).aperture,
                'value',
                0.00001,
                0.01,
                0.0001
            )
            .name('Bokeh Aperture')
        this.gui
            .add(
                (this.bokehPass.uniforms as any).maxblur,
                'value',
                0.0,
                1.0,
                0.001
            )
            .name('Bokeh Max Blur')

        this.gui.add(this.outputPass, 'enabled').name('Output Pass')
        this.gui.add(this.processingPass, 'enabled').name('Post-processing')
    }

    resize() {
        const aspect = this.sizes.width / this.sizes.height
        // max 1080p
        const maxWidth = 720
        // const maxWidth = 1920
        const size = new THREE.Vector2(
            this.experience.sizes.width,
            this.experience.sizes.height
        )
        if (size.x > maxWidth) {
            size.x = maxWidth
            size.y = size.x / aspect
        }
        const pixelRatio = size.x / this.experience.sizes.width

        this.instance.setPixelRatio(pixelRatio)
        this.effects.setPixelRatio(this.sizes.pixelRatio)
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.effects.setSize(this.sizes.width, this.sizes.height)
        // this.instance.setPixelRatio(this.sizes.pixelRatio)
        // this.instance.setSize(this.sizes.width, this.sizes.height)
        // this.effects.setPixelRatio(this.sizes.pixelRatio)
        // this.effects.setSize(this.sizes.width, this.sizes.height)
    }

    update() {
        this.effects.render()
    }
}

export default Renderer
