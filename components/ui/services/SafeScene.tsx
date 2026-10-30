"use client";

import { Environment, useGLTF } from "@react-three/drei";
import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type SafeSceneProps = {
  activeIndex: number;
  mobile?: boolean;
};

type InternalProps = {
  activeIndex: number;
  mobile: boolean;
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

function nearestEquivalentAngle(
  targetAngle: number,
  currentAngle: number
) {
  const fullTurn = Math.PI * 2;

  return (
    targetAngle +
    Math.round(
      (currentAngle - targetAngle) / fullTurn
    ) *
      fullTurn
  );
}

function shortestAngleDifference(
  current: number,
  target: number
) {
  const fullTurn = Math.PI * 2;

  let difference =
    ((target - current + Math.PI) % fullTurn) -
    Math.PI;

  if (difference < -Math.PI) {
    difference += fullTurn;
  }

  return difference;
}

/*
|--------------------------------------------------------------------------
| MOBILE SAFE POSITIONS
|--------------------------------------------------------------------------
*/

const mobileModelPositions = [
  /*
  | 1 - Гаранционен
  */
  new THREE.Vector3(
    0,
    -0.72,
    0
  ),

  /*
  | 2 - Монтаж
  */
  new THREE.Vector3(
    0,
    1.55,
    0
  ),

  /*
  | 3 - Прекодиране
  | Position unchanged.
  */
  new THREE.Vector3(
    1.08,
    -1.08,
    0
  ),

  /*
  | 4 - Профилактика
  | Position unchanged.
  | Still lives on the LEFT side.
  */
  new THREE.Vector3(
    -0.62,
    -1.08,
    0
  ),

  /*
  | 5 - Аварийно
  */
  new THREE.Vector3(
    1.05,
    -0.66,
    0
  ),

  /*
  | 6 - Консултация
  */
  new THREE.Vector3(
    0,
    1.55,
    0
  ),
];

/*
|--------------------------------------------------------------------------
| MOBILE SAFE SIZES
|--------------------------------------------------------------------------
*/

const mobileModelScales = [
  0.82,
  0.84,
  0.88,
  0.84,
  0.78,
  0.84,
];

/*
|--------------------------------------------------------------------------
| SAFE MODEL
|--------------------------------------------------------------------------
*/

function SafeModel({
  activeIndex,
  mobile,
}: InternalProps) {
  const { scene: importedScene } = useGLTF("/models/safe_model.glb");

  // Clone once per Canvas. Never mutate the shared GLTFLoader cache.
  const model = useMemo(() => {
    const copy = importedScene.clone(true);
    const door = copy.getObjectByName("Safe_Door");
    const handle = copy.getObjectByName("Safe_Handle");

    if (door && door.parent) {
      // Blender's door origin is at the hinge edge; preserve that origin
      // when introducing a dedicated animation pivot.
      const parent = door.parent;
      const pivot = new THREE.Group();
      pivot.name = "Website_Door_Hinge_Pivot";
      pivot.position.copy(door.position);
      pivot.quaternion.copy(door.quaternion);
      pivot.scale.copy(door.scale);
      parent.add(pivot);
      pivot.add(door);
      door.position.set(0, 0, 0);
      door.quaternion.identity();
      door.scale.set(1, 1, 1);

      if (handle && handle.parent) {
        const handleParent = handle.parent;
        const handlePivot = new THREE.Group();
        handlePivot.name = "Website_Handle_Pivot";
        handlePivot.position.copy(handle.position);
        handleParent.add(handlePivot);
        handlePivot.add(handle);
        handle.position.set(0, 0, 0);
      }
    }
    return copy;
  }, [importedScene]);

  const safeRef =
    useRef<THREE.Group>(null);

  const doorRef =
    useRef<THREE.Group>(null);

  const handleRef =
    useRef<THREE.Group>(null);

  const animationTime =
    useRef(ANIMATION_DURATION);

  /*
  |--------------------------------------------------------------------------
  | Y ROTATION
  |--------------------------------------------------------------------------
  */

  const startSafeRotation =
    useRef(0);

  const targetSafeRotation =
    useRef(-0.2);

  /*
  |--------------------------------------------------------------------------
  | X ROTATION
  |--------------------------------------------------------------------------
  |
  | Kept in the animation system so any previous tilt
  | smoothly returns to ZERO.
  |
  */

  const startSafePitch =
    useRef(0);

  const targetSafePitch =
    useRef(0);

  /*
  |--------------------------------------------------------------------------
  | DOOR
  |--------------------------------------------------------------------------
  */

  const startDoorRotation =
    useRef(0);

  const targetDoorRotation =
    useRef(-Math.PI * 0.12);

  /*
  |--------------------------------------------------------------------------
  | HANDLE
  |--------------------------------------------------------------------------
  */

  const startHandleRotation =
    useRef(0);

  const targetHandleRotation =
    useRef(0);

  /*
  |--------------------------------------------------------------------------
  | POSITION
  |--------------------------------------------------------------------------
  */

  const startPosition =
    useRef(
      new THREE.Vector3(
        0,
        -0.2,
        0
      )
    );

  const targetPosition =
    useRef(
      new THREE.Vector3(
        0,
        -0.2,
        0
      )
    );

  /*
  |--------------------------------------------------------------------------
  | SCALE
  |--------------------------------------------------------------------------
  */

  const startScale =
    useRef(
      new THREE.Vector3(
        1,
        1,
        1
      )
    );

  const targetScale =
    useRef(
      new THREE.Vector3(
        1,
        1,
        1
      )
    );

  useEffect(() => {
    doorRef.current = model.getObjectByName("Website_Door_Hinge_Pivot") as THREE.Group | null;
    handleRef.current = model.getObjectByName("Website_Handle_Pivot") as THREE.Group | null;
    if (
      !safeRef.current ||
      !doorRef.current ||
      !handleRef.current
    ) {
      return;
    }

    animationTime.current = 0;

    /*
    |--------------------------------------------------------------------------
    | CAPTURE CURRENT VALUES
    |--------------------------------------------------------------------------
    */

    startSafeRotation.current =
      safeRef.current.rotation.y;

    startSafePitch.current =
      safeRef.current.rotation.x;

    startDoorRotation.current =
      doorRef.current.rotation.y;

    startHandleRotation.current =
      handleRef.current.rotation.x;

    startPosition.current.copy(
      safeRef.current.position
    );

    startScale.current.copy(
      safeRef.current.scale
    );

    /*
    |--------------------------------------------------------------------------
    | MOBILE POSITION / SCALE
    |--------------------------------------------------------------------------
    */

    if (mobile) {
      targetPosition.current.copy(
        mobileModelPositions[
          activeIndex
        ]
      );

      const scale =
        mobileModelScales[
          activeIndex
        ];

      targetScale.current.set(
        scale,
        scale,
        scale
      );

      /*
      |--------------------------------------------------------------------------
      | IMPORTANT
      |--------------------------------------------------------------------------
      |
      | No mobile service is tilted on the X axis anymore.
      |
      | Especially service 3 - Прекодиране - stays upright.
      |
      */

      targetSafePitch.current = 0;
    } else {
      targetPosition.current.set(
        0,
        -0.2,
        0
      );

      targetScale.current.set(
        1,
        1,
        1
      );

      targetSafePitch.current = 0;
    }

    /*
    |--------------------------------------------------------------------------
    | SERVICE 1
    |--------------------------------------------------------------------------
    */

    if (activeIndex === 0) {
      targetSafeRotation.current =
        nearestEquivalentAngle(
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
      targetSafeRotation.current =
        nearestEquivalentAngle(
          0.45,
          startSafeRotation.current
        );
    }

    /*
    |--------------------------------------------------------------------------
    | SERVICE 3 - ПРЕКОДИРАНЕ
    |--------------------------------------------------------------------------
    |
    | Y rotation stays exactly as before.
    | X rotation is ZERO.
    |
    */

    if (activeIndex === 2) {
      targetSafeRotation.current =
        nearestEquivalentAngle(
          0.08,
          startSafeRotation.current
        );

      targetSafePitch.current = 0;
    }

    /*
    |--------------------------------------------------------------------------
    | SERVICE 4 - ПРОФИЛАКТИКА
    |--------------------------------------------------------------------------
    |
    | MOBILE:
    | - remains physically on LEFT side
    | - still performs full 360°
    | - finishes facing RIGHT
    |
    | DESKTOP:
    | - original full 360° behaviour unchanged
    |
    */

    if (activeIndex === 3) {
      if (mobile) {
        const desiredFinalOrientation =
          1.5;

        const difference =
          shortestAngleDifference(
            startSafeRotation.current,
            desiredFinalOrientation
          );

        targetSafeRotation.current =
          startSafeRotation.current +
          Math.PI * 2 +
          difference;
      } else {
        // Complete a full turn, then finish facing the right diagonal.
        const desiredFinalOrientation = 1.5;
        const difference = shortestAngleDifference(
          startSafeRotation.current,
          desiredFinalOrientation
        );
        targetSafeRotation.current =
          startSafeRotation.current + Math.PI * 2 + difference;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | SERVICE 5 - АВАРИЙНО
    |--------------------------------------------------------------------------
    */

    if (activeIndex === 4) {
      const desiredFinalOrientation =
        0.25;

      const difference =
        shortestAngleDifference(
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
    | SERVICE 6
    |--------------------------------------------------------------------------
    */

    if (activeIndex === 5) {
      targetSafeRotation.current =
        nearestEquivalentAngle(
          0.75,
          startSafeRotation.current
        );
    }

    /*
    |--------------------------------------------------------------------------
    | DOOR
    |--------------------------------------------------------------------------
    */

    if (activeIndex === 0) {
      targetDoorRotation.current =
        -Math.PI * 0.12;
    } else if (
      activeIndex === 4
    ) {
      targetDoorRotation.current =
        -Math.PI * 0.58;
    } else {
      targetDoorRotation.current =
        0;
    }

    /*
    |--------------------------------------------------------------------------
    | HANDLE
    |--------------------------------------------------------------------------
    */

    if (activeIndex === 1) {
      targetHandleRotation.current =
        Math.PI / 2;
    } else {
      targetHandleRotation.current =
        0;
    }
  }, [
    activeIndex,
    mobile,
    model,
  ]);

  /*
  |--------------------------------------------------------------------------
  | FIXED 0.9 SECOND TRANSITION
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

    if (
      animationTime.current >=
      ANIMATION_DURATION
    ) {
      return;
    }

    animationTime.current +=
      delta;

    const rawProgress =
      Math.min(
        animationTime.current /
          ANIMATION_DURATION,
        1
      );

    const progress =
      easeOutQuint(
        rawProgress
      );

    /*
    |--------------------------------------------------------------------------
    | POSITION
    |--------------------------------------------------------------------------
    */

    safeRef.current.position.lerpVectors(
      startPosition.current,
      targetPosition.current,
      progress
    );

    /*
    |--------------------------------------------------------------------------
    | SCALE
    |--------------------------------------------------------------------------
    */

    safeRef.current.scale.lerpVectors(
      startScale.current,
      targetScale.current,
      progress
    );

    /*
    |--------------------------------------------------------------------------
    | Y ROTATION
    |--------------------------------------------------------------------------
    */

    safeRef.current.rotation.y =
      THREE.MathUtils.lerp(
        startSafeRotation.current,
        targetSafeRotation.current,
        progress
      );

    /*
    |--------------------------------------------------------------------------
    | X ROTATION
    |--------------------------------------------------------------------------
    */

    safeRef.current.rotation.x =
      THREE.MathUtils.lerp(
        startSafePitch.current,
        targetSafePitch.current,
        progress
      );

    /*
    |--------------------------------------------------------------------------
    | DOOR
    |--------------------------------------------------------------------------
    */

    doorRef.current.rotation.y =
      THREE.MathUtils.lerp(
        startDoorRotation.current,
        targetDoorRotation.current,
        progress
      );

    /*
    |--------------------------------------------------------------------------
    | HANDLE
    |--------------------------------------------------------------------------
    */

    handleRef.current.rotation.x =
      THREE.MathUtils.lerp(
        startHandleRotation.current,
        targetHandleRotation.current,
        progress
      );

    /*
    |--------------------------------------------------------------------------
    | EXACT SNAP
    |--------------------------------------------------------------------------
    */

    if (rawProgress >= 1) {
      safeRef.current.position.copy(
        targetPosition.current
      );

      safeRef.current.scale.copy(
        targetScale.current
      );

      safeRef.current.rotation.y =
        targetSafeRotation.current;

      safeRef.current.rotation.x =
        targetSafePitch.current;

      doorRef.current.rotation.y =
        targetDoorRotation.current;

      handleRef.current.rotation.x =
        targetHandleRotation.current;
    }
  });

  return (
    <group ref={safeRef}>
      {/* Original Blender model, rotated so its front faces the camera. */}
      <group rotation={[0, Math.PI / 2, 0]} scale={1.6}>
        <primitive object={model} />
      </group>
    </group>
  );
}

/*
|--------------------------------------------------------------------------
| CAMERA
|--------------------------------------------------------------------------
*/

function CameraRig({
  activeIndex,
  mobile,
}: InternalProps) {
  const { camera } =
    useThree();

  const animationTime =
    useRef(
      ANIMATION_DURATION
    );

  const currentLookAt =
    useRef(
      new THREE.Vector3(
        0,
        0,
        0
      )
    );

  const startPosition =
    useRef(
      new THREE.Vector3(
        5.5,
        2.1,
        6.4
      )
    );

  const targetPosition =
    useRef(
      new THREE.Vector3(
        5.5,
        2.1,
        6.4
      )
    );

  const startLookAt =
    useRef(
      new THREE.Vector3(
        0,
        0,
        0
      )
    );

  const targetLookAt =
    useRef(
      new THREE.Vector3(
        0,
        0,
        0
      )
    );

  useEffect(() => {
    animationTime.current =
      0;

    startPosition.current.copy(
      camera.position
    );

    startLookAt.current.copy(
      currentLookAt.current
    );

    /*
    |--------------------------------------------------------------------------
    | MOBILE
    |--------------------------------------------------------------------------
    */

    if (mobile) {
      if (activeIndex === 0) {
        targetPosition.current.set(
          6.4,
          2.2,
          7.4
        );
      }

      if (activeIndex === 1) {
        targetPosition.current.set(
          6.25,
          2.2,
          7.2
        );
      }

      if (activeIndex === 2) {
        targetPosition.current.set(
          5.8,
          1.8,
          6.3
        );
      }

      if (activeIndex === 3) {
        targetPosition.current.set(
          6.5,
          2.2,
          7.5
        );
      }

      if (activeIndex === 4) {
        targetPosition.current.set(
          7.2,
          2.35,
          8.2
        );
      }

      if (activeIndex === 5) {
        targetPosition.current.set(
          6.25,
          2.2,
          7.2
        );
      }

      /*
      | Camera stays centered.
      */

      targetLookAt.current.set(
        0,
        0,
        0
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | DESKTOP - ORIGINAL
    |--------------------------------------------------------------------------
    */

    if (activeIndex === 2) {
      // Preserve the recoding close-up, but show more of the front face
      // and avoid the abrupt crop at the left edge.
      targetPosition.current.set(5.1, 1.55, 5.1);
      targetLookAt.current.set(0.45, 0.15, 0.35);
    } else if (activeIndex === 4) {
      // The opened door extends beyond the closed-safe silhouette.
      // Widen the camera framing and aim toward the door.
      targetPosition.current.set(7.5, 2.5, 8.7);
      targetLookAt.current.set(-0.45, 0, 0);
    } else if (activeIndex === 3) {
      // Extra breathing room at the top when facing the right diagonal.
      targetPosition.current.set(6.1, 2.25, 7.1);
      targetLookAt.current.set(0, 0, 0);
    } else {
      targetPosition.current.set(
        5.5,
        2.1,
        6.4
      );

      targetLookAt.current.set(
        0,
        0,
        0
      );
    }
  }, [
    activeIndex,
    camera,
    mobile,
  ]);

  /*
  |--------------------------------------------------------------------------
  | CAMERA TRANSITION
  |--------------------------------------------------------------------------
  */

  useFrame((_, delta) => {
    if (
      animationTime.current >=
      ANIMATION_DURATION
    ) {
      return;
    }

    animationTime.current +=
      delta;

    const rawProgress =
      Math.min(
        animationTime.current /
          ANIMATION_DURATION,
        1
      );

    const progress =
      easeOutQuint(
        rawProgress
      );

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

    camera.lookAt(
      currentLookAt.current
    );

    if (rawProgress >= 1) {
      camera.position.copy(
        targetPosition.current
      );

      currentLookAt.current.copy(
        targetLookAt.current
      );

      camera.lookAt(
        currentLookAt.current
      );
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
  mobile = false,
}: SafeSceneProps) {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{
          position: [
            5.5,
            2.1,
            6.4,
          ],
          fov: 38,
        }}
        gl={{
          alpha: true,
          antialias: true,
        }}
        style={{
          background:
            "transparent",
        }}
      >
        <ambientLight
          intensity={0.65}
        />

        <directionalLight
          position={[
            5,
            7,
            6,
          ]}
          intensity={2.0}
        />

        <directionalLight
          position={[
            -4,
            3,
            2,
          ]}
          intensity={0.9}
        />

        <pointLight
          position={[
            0,
            1,
            4,
          ]}
          intensity={0.5}
        />

        <CameraRig
          activeIndex={
            activeIndex
          }
          mobile={mobile}
        />

        <SafeModel
          activeIndex={
            activeIndex
          }
          mobile={mobile}
        />

        <Environment
          preset="studio"
          environmentIntensity={0.45}
        />
      </Canvas>
    </div>
  );
}