import fragment from './shader.frag'
import vertex from './shader.vert'

import noiseSnippet from '../../lib/noise'

const BasicShader = {
    uniforms: {
        uTime: { value: 0 },
        uOffset: {
            value: {
                x: 0,
                y: 0,
            },
        },
        uA: { value: 0.11 },
        uB: { value: 0.11 },
        uZRotation: { value: 0 },
    },
    fragmentShader: noiseSnippet(fragment),
    vertexShader: noiseSnippet(vertex),
}

export default BasicShader
