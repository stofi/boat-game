import * as THREE from 'three'
import Experience from '../Experience'

class Environment {
    experience: Experience
    scene: THREE.Scene

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        // this.setBackground('#002f6c')
        this.addHemiSphereLight('#002f6c', '#71BCE1', 0.5)
        this.addSkyDome('#002f6c', '#71BCE1')
        this.addDirectionalLight('#ffffff', 0.75)
        // this.addFog('#0f427c', 60, 80)
    }

    setBackground(color: string) {
        this.scene.background = new THREE.Color(color)
    }

    addAmbientLight(color: string, intensity = 0.5) {
        const light = new THREE.AmbientLight(color, intensity)
        this.scene.add(light)
    }
    addHemiSphereLight(groundColor: string, skyColor: string, intensity = 0.5) {
        const light = new THREE.HemisphereLight(
            skyColor,
            groundColor,
            intensity
        )
        this.scene.add(light)
    }

    addFog(color: string, near = 0, far = 100) {
        this.scene.fog = new THREE.Fog(color, near, far)
    }

    addSkyDome(groundColor: string, skyColor: string) {
        const uniforms = {
            topColor: { value: new THREE.Color(skyColor) },
            bottomColor: { value: new THREE.Color(groundColor) },
            offset: { value: 0 },
            exponent: { value: 0.6 },
        }

        const skyGeo = new THREE.SphereGeometry(80, 32, 15)
        const skyMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: `

			varying vec3 vWorldPosition;

			void main() {

				vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
				vWorldPosition = worldPosition.xyz;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}

		`,
            fragmentShader: `

			uniform vec3 topColor;
			uniform vec3 bottomColor;
			uniform float offset;
			uniform float exponent;

			varying vec3 vWorldPosition;

			void main() {

				float h = normalize( vWorldPosition + offset ).y;
				gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );

			}

		`,
            side: THREE.BackSide,
        })

        const sky = new THREE.Mesh(skyGeo, skyMat)
        this.scene.add(sky)
    }

    addDirectionalLight(color: string, intensity = 0.5) {
        const light = new THREE.DirectionalLight(color, intensity)
        light.position.set(-4, 10, -6)
        light.castShadow = true
        light.shadow.camera.left = -100
        light.shadow.camera.right = 100
        light.shadow.camera.top = 100
        light.shadow.camera.bottom = -100
        light.shadow.camera.near = 0
        light.shadow.camera.far = 500
        light.shadow.mapSize.width = 2048
        light.shadow.mapSize.height = 2048

        this.scene.add(light)
    }
}
export default Environment
