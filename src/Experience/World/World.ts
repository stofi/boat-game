import * as THREE from 'three'
import Experience from '../Experience'
import Environment from './Environment'
import type Resources from '../Utils/Resources'

import Plane from './Objects/Plane'
import Ball from './Objects/Ball'
import type Base from './Objects/Base'
import type Mouse from '../Mouse'

class World {
    experience: Experience
    scene: THREE.Scene
    resources: Resources
    environment?: Environment
    objects: Base[] = []
    mouse: Mouse
    ball!: THREE.Object3D

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.mouse = this.experience.mouse
        this.resources.on('ready', this.onReady.bind(this))
    }

    private onReady() {
        this.environment = new Environment()
        this.addObjects()
    }

    addObjects() {
        this.objects.push(new Plane())
        const ball = new Ball()
        this.ball = ball.group
        this.objects.push(ball)
    }

    resize() {
        this.objects.forEach((object) => object.resize())
    }

    update() {
        if (this.ball) {
            this.ball.position.x = this.mouse.worldPosition.x
            this.ball.position.z = this.mouse.worldPosition.z
        }
        this.objects.forEach((object) => object.update())
    }
}
export default World
