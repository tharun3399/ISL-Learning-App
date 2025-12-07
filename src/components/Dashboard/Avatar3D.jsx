import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './Avatar3D.css'

export default function Avatar3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) {
      console.log('Container not found')
      return
    }

    try {
      // Clean container
      containerRef.current.innerHTML = ''

      // Create scene
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x0a0e27)

      // Create camera
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
      camera.position.z = 2.5

      // Create renderer
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        precision: 'highp',
        logarithmicDepthBuffer: false
      })
      renderer.setSize(350, 350)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x0a0e27, 1)

      // Append to DOM
      containerRef.current.appendChild(renderer.domElement)
      rendererRef.current = renderer
      sceneRef.current = scene

      console.log('Three.js setup complete, canvas appended')

      // Add lights
      const light1 = new THREE.AmbientLight(0xffffff, 0.8)
      scene.add(light1)

      const light2 = new THREE.PointLight(0xffffff, 0.6)
      light2.position.set(5, 5, 5)
      scene.add(light2)

      // Create avatar
      const group = new THREE.Group()

      // Head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 20, 20),
        new THREE.MeshStandardMaterial({ color: 0xf4a480 })
      )
      head.position.y = 0.5
      group.add(head)

      // Eyes
      const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 })
      const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), eyeMat)
      eye1.position.set(-0.1, 0.65, 0.25)
      group.add(eye1)

      const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), eyeMat)
      eye2.position.set(0.1, 0.65, 0.25)
      group.add(eye2)

      // Body
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.2, 0.5, 20),
        new THREE.MeshStandardMaterial({ color: 0x00d9ff })
      )
      group.add(body)

      // Arms
      const armMat = new THREE.MeshStandardMaterial({ color: 0xf4a480 })
      const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16), armMat)
      arm1.position.set(-0.35, 0.1, 0)
      arm1.rotation.z = 0.3
      group.add(arm1)

      const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16), armMat)
      arm2.position.set(0.35, 0.1, 0)
      arm2.rotation.z = -0.3
      group.add(arm2)

      // Legs
      const legMat = new THREE.MeshStandardMaterial({ color: 0x1a1f3a })
      const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16), legMat)
      leg1.position.set(-0.15, -0.35, 0)
      group.add(leg1)

      const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16), legMat)
      leg2.position.set(0.15, -0.35, 0)
      group.add(leg2)

      scene.add(group)

      console.log('Avatar mesh created')

      // Animation state
      let isWaving = false
      let isJumping = false
      let isDancing = false
      let actionTimer = 0

      const animate = () => {
        requestAnimationFrame(animate)

        // Idle animations
        group.position.y = Math.sin(Date.now() * 0.001) * 0.1
        group.rotation.y += 0.005

        // Handle actions
        if (isWaving) {
          actionTimer += 0.016
          arm2.rotation.z = -0.5 + Math.sin(actionTimer * 4) * 0.4
          if (actionTimer > 2) {
            isWaving = false
            actionTimer = 0
            arm2.rotation.z = -0.3
          }
        }

        if (isJumping) {
          actionTimer += 0.016
          const jumpPower = Math.max(0, Math.sin(actionTimer * Math.PI / 1.5) * 0.5)
          group.position.y = jumpPower + Math.sin(Date.now() * 0.001) * 0.05
          if (actionTimer > 1.5) {
            isJumping = false
            actionTimer = 0
          }
        }

        if (isDancing) {
          actionTimer += 0.016
          leg1.rotation.z = Math.sin(actionTimer * 3) * 0.3
          leg2.rotation.z = -Math.sin(actionTimer * 3) * 0.3
          group.rotation.z = Math.sin(actionTimer * 2) * 0.1
          if (actionTimer > 3) {
            isDancing = false
            actionTimer = 0
            leg1.rotation.z = 0
            leg2.rotation.z = 0
            group.rotation.z = 0
          }
        }

        renderer.render(scene, camera)
      }

      animate()

      // Store action handlers in window for button clicks
      window.avatarActions = {
        wave: () => { isWaving = true; actionTimer = 0 },
        jump: () => { isJumping = true; actionTimer = 0 },
        dance: () => { isDancing = true; actionTimer = 0 }
      }

      console.log('Avatar animation started')

      return () => {
        renderer.dispose()
      }
    } catch (error) {
      console.error('Avatar error:', error)
    }
  }, [])

  return (
    <div className="avatar-container">
      <div className="avatar-canvas" ref={containerRef} style={{ backgroundColor: '#0a0e27', border: '1px solid rgba(0,217,255,0.5)' }}></div>
      <div className="avatar-controls">
        <button
          className="avatar-btn wave-btn"
          onClick={() => window.avatarActions?.wave?.()}
          title="Wave"
        >
          👋
        </button>
        <button
          className="avatar-btn jump-btn"
          onClick={() => window.avatarActions?.jump?.()}
          title="Jump"
        >
          ⬆️
        </button>
        <button
          className="avatar-btn dance-btn"
          onClick={() => window.avatarActions?.dance?.()}
          title="Dance"
        >
          💃
        </button>
      </div>
    </div>
  )
}
