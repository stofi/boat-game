import * as THREE from 'three'
import fragment from './shader.frag'
import vertex from './shader.vert'

import noiseSnippet from '../../lib/noise'

const shader = {
    uniforms: {
        uTime: { value: 0 },
        uOffset: {
            value: {
                x: 0,
                y: 0,
            },
        },
        uHeight: { value: 0 },
        uA: { value: 0.1 },
        uB: { value: 0.9 },
        uColor1: { type: 'c', value: new THREE.Color(0x3465a4) },
        uColor2: { type: 'c', value: new THREE.Color(0x011d57) },
        uLightColor1: { type: 'c', value: new THREE.Color(0xfffbb9) },
        uLightColor2: { type: 'c', value: new THREE.Color(0x52d6fc) },
    },

    fragmentShader: noiseSnippet(fragment),
    vertexShader: noiseSnippet(vertex),
}

export default shader
