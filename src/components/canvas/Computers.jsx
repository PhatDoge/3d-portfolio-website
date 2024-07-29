import { Suspense, useEffect, useState } from "react"; // Added useState
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  return (
    <mesh>
      <hemisphereLight intensity={6} groundColor="black" />
      <pointLight intensity={4} />
      <spotLight
        position={[-20, 70, 10]}
        angle={0.12}
        penumbra={2}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.6 : 0.75}
        position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  //agregar un event listener para cambios en el tamaño de la pantalla
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: 600px)`);

    // se inicializa en valor de la variable isMobile con el valor de la media query
    setIsMobile(mediaQuery.matches);

    // define una funcion callback que se ejecutara cuando cambie el valor de la media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // se agrega la funcion callback al listener por algun cambio en la media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // se quita el listener cuando el componente se desmonte
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop="demand" // Change this to "always" to force continuous rendering
      shadows
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
