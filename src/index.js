import ReactDOM from 'react-dom'
import * as THREE from 'three'
import seedrandom from 'seedrandom'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Text from './Text'
import './styles.css'

function Jumbo({ name }) {
  const ref = useRef()
  useFrame(({ clock }) => (ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.3))
  return (
    <group ref={ref}>
      <Text hAlign="left" position={[-5, 4.2, 0]} children="JIJ" />
      <Text hAlign="left" position={[10, 4.2, 0]} children="HEBT" />
      <Text hAlign="center" position={[0, 0, 0]} children={name} />
      {/* <Text hAlign="left" position={[12, 0, 0]} children="5" size={3} /> */}
      <Text hAlign="left" position={[16.5, -4.2, 0]} children="XXX" />
    </group>
  )
}

let i = 0

// This component was auto-generated from GLTF by: https://github.com/react-spring/gltfjsx
function Bird({ speed, factor, url, ...props }) {
  const { nodes, materials, animations } = useLoader(GLTFLoader, url)
  const group = useRef()
  const [mixer] = useState(() => new THREE.AnimationMixer())
  useEffect(() => void mixer.clipAction(animations[0], group.current).play(), [])
  useFrame((state, delta) => {
    group.current.rotation.y += Math.sin((delta * factor) / 2) * Math.cos((delta * factor) / 2) * 1.5
    mixer.update(delta * speed)
  })

  return (
    <group ref={group} dispose={null}>
      <scene name="Scene" {...props}>
        <mesh
          name="Object_0"
          morphTargetDictionary={nodes.Object_0.morphTargetDictionary}
          morphTargetInfluences={nodes.Object_0.morphTargetInfluences}
          rotation={[1.5707964611537577, 0, 0]}
          geometry={nodes.Object_0.geometry}
          material={materials.Material_0_COLOR_0}
        />
      </scene>
    </group>
  )
}

function Birds() {
  return new Array(100).fill().map((_, i) => {
    const x = (15 + Math.random() * 30) * (Math.round(Math.random()) ? -1 : 1)
    const y = -10 + Math.random() * 20
    const z = -5 + Math.random() * 10
    const bird = ['Stork', 'Parrot', 'Flamingo'][Math.round(Math.random() * 2)]
    let speed = bird === 'Stork' ? 0.5 : bird === 'Flamingo' ? 2 : 5
    let factor = bird === 'Stork' ? 0.5 + Math.random() : bird === 'Flamingo' ? 0.25 + Math.random() : 1 + Math.random() - 0.5
    return <Bird key={i} position={[x, y, z]} rotation={[0, x > 0 ? Math.PI : 0, 0]} speed={speed} factor={factor} url={`/${bird}.glb`} />
  })
}

function Result({ receiverName }) {
  console.log(receiverName)
  return (
    <Canvas camera={{ position: [0, 0, 35] }}>
      <ambientLight intensity={2} />
      <pointLight position={[40, 40, 40]} />
      <Suspense fallback={null}>
        <Jumbo name={receiverName} />
        <Birds />
      </Suspense>
    </Canvas>
  )
}

function Form({ handleFormSubmit }) {
  const [name, setName] = useState('')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleFormSubmit(name)
      }}>
      <p>Geef je naam in:</p>
      <input type="text" name={name} onChange={(e) => setName(e.target.value)} />
      <input type="submit" value="Wie heb ik?" />
    </form>
  )
}

const NAMES = ['DIANE', 'HUGO', 'KAROLIEN', 'DON', 'ROSELIEN', 'FREDERIK']
const FORBIDDEN_PAIRS = {
  HUGO: 'DIANE',
  DIANE: 'HUGO',
  KAROLIEN: 'DON',
  DON: 'KAROLIEN',
  FREDERIK: 'ROSELIEN',
  ROSELIEN: 'FREDERIK'
}
const SEED = 100

function randomInt(rng, lower, upper) {
  return lower + Math.floor(rng() * (upper - lower + 1))
}

function stableShuffle(array, seed) {
  const rng = seedrandom(seed)
  array = array.slice()
  var index = -1,
    length = array.length,
    lastIndex = length - 1,
    size = length

  while (++index < size) {
    var rand = randomInt(rng, index, lastIndex),
      value = array[rand]

    array[rand] = array[index]
    array[index] = value
  }
  array.length = size
  return array
}

function shuffleNames() {
  let seed = SEED
  let allCorrect = true
  let shuffled

  do {
    // debugger
    shuffled = stableShuffle(NAMES, seed)
    allCorrect = true

    for (let i = 0; i < NAMES.length; i++) {
      const a = NAMES[i]
      const b = shuffled[i]
      if (a === b || FORBIDDEN_PAIRS[a] === b) {
        console.log(`${a} cant give to ${b}`)
        allCorrect = false
        break
      }
    }
    seed += 1
  } while (!allCorrect)

  // console.log(NAMES)
  // console.log(shuffled)
  // console.log(seed)
  return shuffled
}

function App() {
  // chooseName('FREDERIK')
  // const [giverName, setGiverName] = useState('')
  const [receiverName, setReceiverName] = useState()

  const handleFormSubmit = (name) => {
    // This is your name;
    name = name.trim().toUpperCase()
    const index = NAMES.indexOf(name)
    if (index === -1) {
      alert('Ik ken die naam niet.')
      return
    }
    const shuffled = shuffleNames()

    setReceiverName(shuffled[index])
  }
  if (!receiverName) {
    return <Form handleFormSubmit={handleFormSubmit} />
  } else {
    return <Result receiverName={receiverName} />
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
