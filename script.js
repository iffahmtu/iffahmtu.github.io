import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const matcapTexture = textureLoader.load('./textures/matcaps/8.png')

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff,0.7)
pointLight.position.y = 150
pointLight.position.x = 50
pointLight.position.z = 150
scene.add(pointLight)

//fonts
const fontLoader = new THREE.FontLoader()
fontLoader.load('./fonts/helvetiker_regular.typeface.json',
(font) => {
    const textGeometry = new THREE.TextGeometry('IffahMTU', 
    {
        font:font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5

    })
    textGeometry.center()
    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     -textGeometry.boundingBox.max.x * 0.5,
    //     -textGeometry.boundingBox.max.y * 0.5,
    //     -textGeometry.boundingBox.max.z * 0.5,
    // )
    const textmaterial = new THREE.MeshMatcapMaterial(
        {
            matcap: matcapTexture,
        })
    const text = new THREE.Mesh(textGeometry, textmaterial)
    scene.add(text)

    const donutGeometry = new THREE.TorusGeometry(0.3,0.2,32,64)
    for(let i = 0; i < 100; i++)
    {
        const donut = new THREE.Mesh(donutGeometry, textmaterial)
        donut.position.x = (Math.random() - 0.5) * 12
        donut.position.y = (Math.random() - 0.5) * 12
        donut.position.z = (Math.random() - 0.5) * 12
        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI
        donut.rotation.z = Math.random() * Math.PI

        const scale = Math.random()
        donut.scale.set(scale,scale,scale)

        scene.add(donut)
    }
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
camera.lookAt(scene.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    camera.position.x = (0.01 * elapsedTime) * Math.PI
    camera.position.y = (0.01 * elapsedTime) * Math.PI

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()