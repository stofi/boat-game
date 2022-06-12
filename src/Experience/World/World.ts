import * as THREE from 'three'
import * as gui from 'lil-gui'
import Experience from '../Experience'
import Environment from './Environment'
import type Resources from '../Utils/Resources'

import Plane from './Objects/Plane'
import Ball from './Objects/Ball'
import type Base from './Objects/Base'
import type Mouse from '../Mouse'

import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

class World {
    experience: Experience
    scene: THREE.Scene
    resources: Resources
    environment?: Environment
    objects: Base[] = []
    mouse: Mouse
    ball!: Ball
    plane!: Plane

    speed = 0.001

    position = new THREE.Vector2()
    velocity = new THREE.Vector2()
    acceleration = new THREE.Vector2()
    angle = 0
    angularVelocity = 0
    angularAcceleration = 0
    maxVelocity = 0.01
    maxAngularVelocity = 0.1
    friction = 0.1
    angularFriction = 0.1

    rotation = 0
    rotationSpeed = 0.02
    input = {
        forward: false,
        backward: false,
        left: false,
        right: false,
    }
    debug = document.getElementById('debug')! as HTMLPreElement

    gui: gui.GUI

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.mouse = this.experience.mouse
        this.resources.on('ready', this.onReady.bind(this))
        this.gui = this.experience.gui.addFolder('World')
        this.gui.add(this, 'speed', 0, 0.01).step(0.001)
        this.gui.add(this, 'friction', 0, 1.0).step(0.01)
        this.gui.add(this, 'angularFriction', 0, 0.1).step(0.001)
        this.gui.add(this, 'maxVelocity', 0, 0.1).step(0.001)
        this.gui.add(this, 'maxAngularVelocity', 0, 1.0).step(0.001)
        this.gui.add(this, 'rotationSpeed', 0, 0.1).step(0.001)
    }

    private onReady() {
        this.environment = new Environment()
        this.addObjects()
        this.addListeners()
    }

    addObjects() {
        const plane = new Plane()
        const ball = new Ball()
        this.ball = ball
        this.plane = plane
        this.objects.push(plane)
        this.objects.push(ball)
    }

    onMouseLeave() {
        this.input.forward = false
        this.input.backward = false
        this.input.left = false
        this.input.right = false
    }

    onKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'w':
                this.input.forward = true
                break
            case 's':
                this.input.backward = true
                break
            case 'a':
                this.input.left = true
                break
            case 'd':
                this.input.right = true
                break
        }
    }
    onKeyUp(event: KeyboardEvent) {
        switch (event.key) {
            case 'w':
                this.input.forward = false
                break
            case 's':
                this.input.backward = false
                break
            case 'a':
                this.input.left = false
                break
            case 'd':
                this.input.right = false
                break
        }
    }
    addListeners() {
        window.addEventListener('keydown', this.onKeyDown.bind(this))
        window.addEventListener('keyup', this.onKeyUp.bind(this))
        this.experience.canvas.addEventListener(
            'mouseleave',
            this.onMouseLeave.bind(this)
        )
    }
    getRotation() {
        let rotation = 0
        if (this.input.left) {
            rotation += 0.1
        }
        if (this.input.right) {
            rotation -= 0.1
        }
        return rotation
    }
    getAcceleration() {
        const acceleration = new THREE.Vector2()
        if (!this.ball) return acceleration
        const rotation = this.rotation
        const direction = this.input.forward ? 1 : this.input.backward ? -1 : 0
        acceleration.x = Math.sin(rotation) * direction * this.speed
        acceleration.y = Math.cos(rotation) * direction * this.speed
        return acceleration
    }
    getVelocity() {
        const velocity = this.velocity.clone()
        const acceleration = this.acceleration.clone()
        velocity.add(acceleration)
        // clamp velocity
        if (velocity.length() > this.maxVelocity) {
            velocity.normalize().multiplyScalar(this.maxVelocity)
        }
        // friction
        velocity.multiplyScalar(1 - this.friction)
        return velocity
    }
    getAngularAcceleration() {
        const angle = this.getRotation()
        const angularAcceleration = angle * this.rotationSpeed
        return angularAcceleration
    }
    getAngularVelocity() {
        let angularVelocity = this.angularVelocity
        const angularAcceleration = this.angularAcceleration
        angularVelocity += angularAcceleration
        // clamp velocity
        if (angularVelocity > this.maxAngularVelocity) {
            angularVelocity = this.maxAngularVelocity
        }
        if (angularVelocity < -this.maxAngularVelocity) {
            angularVelocity = -this.maxAngularVelocity
        }
        // friction
        angularVelocity *= 1 - this.angularFriction

        return angularVelocity
    }
    calculatePosition() {
        this.acceleration = this.getAcceleration()
        this.velocity = this.getVelocity()
        const position = this.position.clone()
        position.add(this.velocity)
        this.position = position
    }
    calculateAngle() {
        this.angularAcceleration = this.getAngularAcceleration()
        this.angularVelocity = this.getAngularVelocity()
        let angle = this.angle
        const angularVelocity = this.getAngularVelocity()
        angle += angularVelocity
        this.angle = angle
    }
    renderDebug() {
        const f = (n: number) => n.toFixed(4)
        this.debug.textContent = `DEBUG:
position:               ${f(this.position.x)} x, ${f(this.position.y)} y
velocity:               ${f(this.velocity.x)} x, ${f(this.velocity.y)} y = ${f(
            this.velocity.length()
        )} m/s
acceleration:           ${f(this.acceleration.x)} x, ${f(this.acceleration.y)} y
angle:                  ${f(this.angle)} r
angularVelocity:        ${f(this.angularVelocity)} r/s 
angularAcceleration:    ${f(this.angularAcceleration)} r/s^2
maxVelocity:            ${f(this.maxVelocity)} m/s
maxAngularVelocity:     ${f(this.maxAngularVelocity)} r/s
friction:               ${f(this.friction)} m/s
angularFriction:        ${f(this.angularFriction)} r/s^2
        `
    }

    resize() {
        this.objects.forEach((object) => object.resize())
    }

    update() {
        this.calculateAngle()
        this.calculatePosition()
        this.objects.forEach((object) => object.update())
        if (
            this.plane &&
            (this.plane.material instanceof THREE.ShaderMaterial ||
                this.plane.material instanceof CustomShaderMaterial) &&
            this.ball &&
            (this.ball.material instanceof THREE.ShaderMaterial ||
                this.ball.material instanceof CustomShaderMaterial)
        ) {
            {
                const current = this.plane.material.uniforms.uOffset.value
                const offset = this.position.clone()

                const diff = new THREE.Vector2(-offset.x, -offset.y)
                this.plane.material.uniforms.uOffset.value = diff
            }
            {
                // this.rotation += this.getRotation() * this.rotationSpeed
                this.rotation = this.angle
                this.ball.rotation = this.rotation
                const current = this.ball.material.uniforms.uOffset.value
                const offset = this.position.clone().multiplyScalar(80)
                const diff = new THREE.Vector2(offset.x, offset.y)
                this.ball.material.uniforms.uOffset.value = diff
            }
        }
        // this.renderDebug()
    }
}
export default World
