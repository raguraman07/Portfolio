'use client';
import './index.css';
import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial });

const GLTF_PATH = '/assets/kartu.glb';
const TEXTURE_PATH = '/assets/bandd.png';

useGLTF.preload(GLTF_PATH);
useTexture.preload(TEXTURE_PATH);

// Lightweight, dependency-free card shown on mobile instead of the full
// WebGL physics scene — avoids GPU/WASM compatibility issues on phones
// while still showing a swinging identity card with the same photo.
function MobileCard() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '4%',
        right: '6%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 8,
          height: 70,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.1))',
          borderRadius: 4,
        }}
      />

      <motion.div
        animate={{ rotate: [-6, 6, -6] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          transformOrigin: 'top center',
          width: 130,
          borderRadius: 18,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.15)',
          background: '#111',
          boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
        }}
      >
        <img
          src="/assets/card-front.png"
          alt="Sanjay Ramamoorthy"
          style={{ width: '100%', display: 'block' }}
        />
        <div style={{ padding: '8px 10px', textAlign: 'center' }}>
          <p
            style={{
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              margin: 0,
            }}
          >
            Raguraman
          </p>
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 9,
              margin: '2px 0 0',
            }}
          >
            Cyber Security Enthusiast
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return <MobileCard />;
  }

  return (
    <div
      className="responsive-wrapper"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <Canvas
        gl={{ alpha: true }}
        camera={{ position: [0, 0, 13], fov: 25 }}
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          pointerEvents: isMobile ? 'none' : 'auto', // ✅ fix drag desktop
        }}
      >
        <ambientLight intensity={Math.PI} />

        <Scene isMobile={isMobile} />

        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Scene({ isMobile }) {
  return (
    <Physics
      key={isMobile ? 'mobile' : 'desktop'}
      interpolate
      gravity={[0, -40, 0]}
      timeStep={1 / 60}
    >
      {/* Card renders on all screen sizes; dragging is disabled on mobile separately */}
      <Band isMobile={isMobile} />
    </Physics>
  );
}

function Band({ isMobile, maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(GLTF_PATH);
  const texture = useTexture(TEXTURE_PATH);
  const { width, height } = useThree((state) => state.size);

  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = 'chordal';
    return c;
  });

  useEffect(() => {
    if (texture) {
      // eslint-disable-next-line react-hooks/immutability
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  }, [texture]);

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const canDrag = !isMobile;

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered && canDrag) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged, canDrag]);

  useFrame((state, delta) => {
    if (dragged && card.current && canDrag) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());

      const newX = vec.x - dragged.x;
      let newY = vec.y - dragged.y;
      const newZ = vec.z - dragged.z;

      const screenY = state.pointer.y;
      const limit = isMobile ? -0.1 : -0.2;

      if (screenY < limit) newY = card.current.translation().y;

      card.current.setNextKinematicTranslation({ x: newX, y: newY, z: newZ });
    }

    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        }

        const d = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );

        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + d * (maxSpeed - minSpeed))
        );
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());

      if (band.current?.geometry) {
        band.current.geometry.setPoints(curve.getPoints(32));
      }

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());

      card.current.setAngvel({
        x: ang.x,
        y: ang.y - rot.y * 0.25,
        z: ang.z,
      });
    }
  });

  return (
    <>
      <group position={[3, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>

        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />

          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => canDrag && hover(true)}
            onPointerOut={() => canDrag && hover(false)}
            onPointerUp={(e) => {
              if (!canDrag) return;
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              if (!canDrag) return;
              e.target.setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial {...materials.base} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          transparent
          opacity={0.9}
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}