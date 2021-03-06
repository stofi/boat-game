import fragment from './basic.frag'
import vertex from './basic.vert'

const BasicShader = {
    uniforms: {
        uTime: { value: 0 },
        uOffset: {
            value: {
                x: 0,
                y: 0,
            },
        },
    },
    fragmentShader: fragment,
    vertexShader: vertex,
}

export default BasicShader
