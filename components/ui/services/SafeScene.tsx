"use client";

import { Environment } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type SafeSceneProps = {
  activeIndex: number;
};

const ANIMATION_DURATION = 0.9;

function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

/*
|--------------------------------------------------------------------------
| ANGLE HELPERS
|--------------------------------------------------------------------------
*/

/*
 * Finds the closest equivalent version of an angle.
 *
 * Example:
 * 0.75 -> -0.2
 *
 * Instead of rotating through several revolutions,
 * it takes the shortest path.
 */
function nearestEquivalentAngle(
  targetAngle: number,
  currentAngle: number
) {
  const fullTurn = Math.PI * 2;

  let target =
    targetAngle +
    Math.round((currentAngle - targetAngle) / fullTurn) *
      fullTurn;

  return target;
}

/*
 * Returns the shortest angular difference between
 * the current orientation and target orientation.
 */
function shortestAngleDifference(
  current: number,
  target: number
) {
  const fullTurn = Math.PI * 2;

  let difference =
    ((target - current + Math.PI) % fullTurn) - Math.PI;

  if (difference < -Math.PI) {
    difference += fullTurn;
  }

  return difference;
}

/*
|--------------------------------------------------------------------------
| SAFE MODEL
|--------------------------------------------------------------------------
*/

function SafeModel({ activeIndex }: SafeSceneProps) {
  const safeRef = useRef<THREE.Group>(null);
  const doorRef = useRef<THREE.Group>(null);
  const handleRef = useRef<THREE.Group>(null);

  const animationTime = useRef(ANIMATION_DURATION);

  const startSafeRotation = useRef(0);
  const targetSafeRotation = useRef(-0.2);

  const startDoorRotation = useRef(0);
  const targetDoorRotation = useRef(-Math.PI * 0.12);

  const startHandleRotation = useRef(0);
  const targetHandleRotation = useRef(0);

  useEffect(() => {
    if (
      !safeRef.current ||
      !doorRef.current ||
      !handleRef.current
    ) {
      return;
    }

    animationTime.current = 0;

    startSafeRotation.current = safeRef.current.rotation.y;

    /*
    |--------------------------------------------------------------------------
    | SERVICE 1
    |--------------------------------------------------------------------------
    |
    | Return to the first pose using the SHORTEST path.
    | This fixes the unwanted spin from service 6 -> service 1.
    |
    */

    if (activeIndex === 0) {
      targetSafeRotation.current = nearestEquivalentAngle(
        -0.2,
        startSafeRotation.current
      );
    }

    /*
    |--------------------------------------------------------------------------
    | SERVICE 2
    |--------------------------------------------------------------------------
    */

    if (activeIndex === 1) {
      targetSafeRotation.current = nearestEquivalentAngle(
        0.45,
        startSafeRotation.current
      );
    }

    /*
    |--------------------------------------------------------------------------
    | SERVICE 3
    |--------------------------------------------------------------------------
    */

    if (activeIndex === 2) {
      targetSafeRotation.current = nearestEquivalentAngle(
        0.08,
        startSafeRotation.current
      );
    }

    /*
    |--------------------------------------------------------------------------
    | SERVICE 4 — 360°
    |--------------------------------------------------------------------------
    */

    if (activeIndex === 3) {
      targetSafeRotation.current =
        startSafeRotation.current + Math.PI * 2;
    }

    /*
    |--------------------------------------------------------------------------
    | SERVICE 5 — АВАРИЙНО ОТВАРЯНЕ
    |--------------------------------------------------------------------------
    |
    | FULL 360° SPIN IN THE OPPOSITE DIRECTION.
    |
    | We also finish at approximately 0.25 radians,
    | while forcing one complete negative revolution.
    |
    */

    if (activeIndex === 4) {
      const desiredFinalOrientation = 0.25;

      const difference = shortestAngleDifference(
        startSafeRotation.current,
        desiredFinalOrientation
      );

      targetSafeRotation.current =
        startSafeRotation.current -
        Math.PI * 2 +
        difference;
    }

    /*
    |--------------------------------------------------------------------------
    | SERVICE 6 — КОНСУЛТАЦИЯ
    |--------------------------------------------------------------------------
    |
    | Simply turn toward the right side.
    | No unnecessary revolution.
    |
    */

    if (activeIndex === 5) {
      targetSafeRotation.current = nearestEquivalentAngle(
        0.75,
        startSafeRotation.current
      );
    }

    /*
    |--------------------------------------------------------------------------
    | DOOR
    |--------------------------------------------------------------------------
    */

    startDoorRotation.current =
      doorRef.current.rotation.y;

    if (activeIndex === 0) {
      // First service — slightly open
      targetDoorRotation.current = -Math.PI * 0.12;
    } else if (activeIndex === 4) {
      // Emergency opening — fully open
      targetDoorRotation.current = -Math.PI * 0.58;
    } else {
      targetDoorRotation.current = 0;
    }

    /*
    |--------------------------------------------------------------------------
    | HANDLE
    |--------------------------------------------------------------------------
    */

    startHandleRotation.current =
      handleRef.current.rotation.z;

    if (activeIndex === 1) {
      // Монтаж на ключалки — 90° left
      targetHandleRotation.current = Math.PI / 2;
    } else {
      targetHandleRotation.current = 0;
    }
  }, [activeIndex]);

  /*
  |--------------------------------------------------------------------------
  | RUN TRANSITION
  |--------------------------------------------------------------------------
  */

  useFrame((_, delta) => {
    if (
      !safeRef.current ||
      !doorRef.current ||
      !handleRef.current
    ) {
      return;
    }

    if (animationTime.current >= ANIMATION_DURATION) {
      return;
    }

    animationTime.current += delta;

    const rawProgress = Math.min(
      animationTime.current / ANIMATION_DURATION,
      1
    );

    const progress = easeOutQuint(rawProgress);

    /*
    | SAFE ROTATION
    */

    safeRef.current.rotation.y = THREE.MathUtils.lerp(
      startSafeRotation.current,
      targetSafeRotation.current,
      progress
    );

    /*
    | DOOR
    */

    doorRef.current.rotation.y = THREE.MathUtils.lerp(
      startDoorRotation.current,
      targetDoorRotation.current,
      progress
    );

    /*
    | HANDLE
    */

    handleRef.current.rotation.z = THREE.MathUtils.lerp(
      startHandleRotation.current,
      targetHandleRotation.current,
      progress
    );

    /*
    | Snap exactly when complete.
    */

    if (rawProgress >= 1) {
      safeRef.current.rotation.y =
        targetSafeRotation.current;

      doorRef.current.rotation.y =
        targetDoorRotation.current;

      handleRef.current.rotation.z =
        targetHandleRotation.current;
    }
  });

  return (
    <group ref={safeRef} position={[0, -0.2, 0]}>
      {/* SAFE BODY */}
      <mesh>
        <boxGeometry args={[2.5, 3.2, 1.8]} />

        <meshStandardMaterial
          color="#262a30"
          metalness={0.8}
          roughness={0.32}
        />
      </mesh>

      {/* INNER OPENING */}
      <mesh position={[0, 0, 0.93]}>
        <boxGeometry args={[1.95, 2.65, 0.08]} />

        <meshStandardMaterial
          color="#111317"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* TOP SHELF */}
      <mesh position={[0, 0.3, 0.45]}>
        <boxGeometry args={[1.75, 0.05, 1.1]} />

        <meshStandardMaterial
          color="#30343a"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* BOTTOM SHELF */}
      <mesh position={[0, -0.34, 0.45]}>
        <boxGeometry args={[1.75, 0.05, 1.1]} />

        <meshStandardMaterial
          color="#30343a"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* DOOR */}
      <group
        ref={doorRef}
        position={[-1.25, 0, 0.98]}
      >
        {/* DOOR BODY */}
        <mesh position={[1.25, 0, 0]}>
          <boxGeometry args={[2.5, 3.05, 0.18]} />

          <meshStandardMaterial
            color="#343941"
            metalness={0.9}
            roughness={0.24}
          />
        </mesh>

        {/* LOCK */}
        <mesh
          position={[1.7, 0.35, 0.13]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry
            args={[0.28, 0.28, 0.12, 32]}
          />

          <meshStandardMaterial
            color="#15171b"
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>

        {/* ROTATING HANDLE */}
        <group
          ref={handleRef}
          position={[1.72, -0.1, 0.17]}
        >
          {/* HANDLE BAR */}
          <mesh position={[0, -0.35, 0]}>
            <cylinderGeometry
              args={[0.07, 0.07, 0.8, 32]}
            />

            <meshStandardMaterial
              color="#777d85"
              metalness={1}
              roughness={0.18}
            />
          </mesh>

          {/* HANDLE HUB */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry
              args={[0.16, 0.16, 0.16, 32]}
            />

            <meshStandardMaterial
              color="#777d85"
              metalness={1}
              roughness={0.18}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/*
|--------------------------------------------------------------------------
| CAMERA
|--------------------------------------------------------------------------
*/

function CameraRig({ activeIndex }: SafeSceneProps) {
  const { camera } = useThree();

  const animationTime = useRef(ANIMATION_DURATION);

  const currentLookAt = useRef(
    new THREE.Vector3(0, 0, 0)
  );

  const startPosition = useRef(
    new THREE.Vector3(5.5, 2.1, 6.4)
  );

  const targetPosition = useRef(
    new THREE.Vector3(5.5, 2.1, 6.4)
  );

  const startLookAt = useRef(
    new THREE.Vector3(0, 0, 0)
  );

  const targetLookAt = useRef(
    new THREE.Vector3(0, 0, 0)
  );

  useEffect(() => {
    animationTime.current = 0;

    startPosition.current.copy(camera.position);

    startLookAt.current.copy(
      currentLookAt.current
    );

    /*
    |--------------------------------------------------------------------------
    | PREKODIRANE — LOCK ZOOM
    |--------------------------------------------------------------------------
    */

    if (activeIndex === 2) {
      targetPosition.current.set(3.4, 1.0, 3.1);

      targetLookAt.current.set(1.0, 0.3, 0.9);
    } else {
      targetPosition.current.set(5.5, 2.1, 6.4);

      targetLookAt.current.set(0, 0, 0);
    }
  }, [activeIndex, camera]);

  useFrame((_, delta) => {
    if (animationTime.current >= ANIMATION_DURATION) {
      return;
    }

    animationTime.current += delta;

    const rawProgress = Math.min(
      animationTime.current / ANIMATION_DURATION,
      1
    );

    const progress = easeOutQuint(rawProgress);

    camera.position.lerpVectors(
      startPosition.current,
      targetPosition.current,
      progress
    );

    currentLookAt.current.lerpVectors(
      startLookAt.current,
      targetLookAt.current,
      progress
    );

    camera.lookAt(currentLookAt.current);

    if (rawProgress >= 1) {
      camera.position.copy(targetPosition.current);

      currentLookAt.current.copy(
        targetLookAt.current
      );

      camera.lookAt(currentLookAt.current);
    }
  });

  return null;
}

/*
|--------------------------------------------------------------------------
| CANVAS
|--------------------------------------------------------------------------
*/

export default function SafeScene({
  activeIndex,
}: SafeSceneProps) {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{
          position: [5.5, 2.1, 6.4],
          fov: 38,
        }}
        gl={{
          alpha: true,
          antialias: true,
        }}
        style={{
          background: "transparent",
        }}
      >
        <ambientLight intensity={1.8} />

        <directionalLight
          position={[5, 7, 6]}
          intensity={4}
        />

        <directionalLight
          position={[-4, 3, 2]}
          intensity={2.5}
        />

        <pointLight
          position={[0, 1, 4]}
          intensity={2}
        />

        <CameraRig activeIndex={activeIndex} />

        <SafeModel activeIndex={activeIndex} />

        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}