const key = '#define NOISE_SNIPPET'
import noise from './noise.glsl'
const value = noise

const injectSnippet = (shader: string) => {
    console.log('injectSnippet', shader.match(key))

    return shader.replace(key, value)
}

export default injectSnippet
