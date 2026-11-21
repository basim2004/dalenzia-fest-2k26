import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Compass,
  Layers,
  Sparkles,
  Info,
  Camera,
  RefreshCw
} from 'lucide-react';

export default function InteractiveStage3DViewer({
  stage,
  onOpenLightbox
}) {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [currentViewLabel, setCurrentViewLabel] = useState('Front View (Proscenium)');
  const [activePreset, setActivePreset] = useState('FRONT');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('3d'); // '3d' | 'photo'

  // Three.js internal references
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const targetCamPos = useRef(null);
  const animationFrameId = useRef(null);

  // Camera preset definitions
  const presets = {
    FRONT: { pos: new THREE.Vector3(0, 1.4, 7.8), target: new THREE.Vector3(0, 1.2, 0.5), label: 'Front View (Proscenium)' },
    LEFT: { pos: new THREE.Vector3(-7.8, 1.6, 1.5), target: new THREE.Vector3(0, 1.2, 0.5), label: 'Stage Left Wing (3D Perspective)' },
    RIGHT: { pos: new THREE.Vector3(7.8, 1.6, 1.5), target: new THREE.Vector3(0, 1.2, 0.5), label: 'Stage Right Wing (3D Perspective)' },
    BACK: { pos: new THREE.Vector3(0, 1.8, -7.8), target: new THREE.Vector3(0, 1.2, 0.5), label: 'Backstage Truss & Structural Rig' },
    TOP: { pos: new THREE.Vector3(0, 8.8, 0.6), target: new THREE.Vector3(0, 0.8, 0.6), label: 'Bird\'s-Eye Top Layout' },
    ELEVATED: { pos: new THREE.Vector3(5.6, 4.2, 6.2), target: new THREE.Vector3(0, 1.2, 0.5), label: 'Elevated Festival Angle' }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    setIsLoading(true);
    setLoadError(null);

    // 1. Scene & Dimensions
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Atmospheric studio background
    scene.background = new THREE.Color(0x0c0c0e);
    scene.fog = new THREE.FogExp2(0x0c0c0e, 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.copy(presets.FRONT.pos);
    cameraRef.current = camera;

    // 3. Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (e) {
      console.error('WebGL Initialization Error:', e);
      setLoadError('WebGL is not supported or hardware accelerated on this device.');
      setIsLoading(false);
      return;
    }

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.copy(presets.FRONT.target);
    controls.minDistance = 3.5;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI / 2 + 0.12; // Allow viewing slightly from below floor
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.6;
    controlsRef.current = controls;

    controls.addEventListener('start', () => {
      // User manual interaction disables auto-rotate
      setIsAutoRotating(false);
      targetCamPos.current = null;
    });

    controls.addEventListener('change', () => {
      // Determine dynamic view direction
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      if (camera.position.y > 6.0) {
        setCurrentViewLabel('Bird\'s-Eye Top Layout');
      } else if (camera.position.z < -2.5) {
        setCurrentViewLabel('Backstage Truss & Structural Rig');
      } else if (camera.position.x < -3.5) {
        setCurrentViewLabel('Stage Left Perspective');
      } else if (camera.position.x > 3.5) {
        setCurrentViewLabel('Stage Right Perspective');
      } else if (camera.position.y > 3.0) {
        setCurrentViewLabel('Elevated Festival Angle');
      } else {
        setCurrentViewLabel('Front Proscenium View');
      }
    });

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Key Stage Spotlight
    const mainSpot = new THREE.SpotLight(0xffffff, 2.5);
    mainSpot.position.set(0, 6.5, 6.0);
    mainSpot.angle = Math.PI / 3.5;
    mainSpot.penumbra = 0.6;
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.width = 1024;
    mainSpot.shadow.mapSize.height = 1024;
    scene.add(mainSpot);

    // Warm footlights
    const footlightColor = new THREE.Color(stage.modelConfig.spotlightColor);
    const leftFootlight = new THREE.PointLight(footlightColor, 1.8, 7.0);
    leftFootlight.position.set(-2.2, 0.6, 2.6);
    scene.add(leftFootlight);

    const centerFootlight = new THREE.PointLight(footlightColor, 2.2, 7.0);
    centerFootlight.position.set(0, 0.6, 2.6);
    scene.add(centerFootlight);

    const rightFootlight = new THREE.PointLight(footlightColor, 1.8, 7.0);
    rightFootlight.position.set(2.2, 0.6, 2.6);
    scene.add(rightFootlight);

    // Overhead warm cove wash
    const coveLight = new THREE.RectAreaLight(0xffecd2, 2.0, 7.5, 0.4);
    coveLight.position.set(0, 4.15, 0.5);
    coveLight.rotation.x = Math.PI / 2;
    scene.add(coveLight);

    // Backstage work light (cool white for backstage structural realism)
    const backstageLight = new THREE.PointLight(0x7dd3fc, 0.9, 10.0);
    backstageLight.position.set(0, 2.5, -3.5);
    scene.add(backstageLight);

    // 6. Stage Geometry Construction
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      stage.referencePhoto,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        // A. Main Backdrop (High-Res Architectural Face)
        const backdropGeo = new THREE.PlaneGeometry(7.2, 4.05, 32, 18);
        const backdropMat = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.35,
          metalness: 0.08,
          side: THREE.FrontSide
        });
        const backdropMesh = new THREE.Mesh(backdropGeo, backdropMat);
        backdropMesh.position.set(0, 2.25, 0);
        backdropMesh.receiveShadow = true;
        stageGroup.add(backdropMesh);

        // Backdrop Backing Panel (Backstage Wall)
        const backWallGeo = new THREE.PlaneGeometry(7.2, 4.05);
        const backWallMat = new THREE.MeshStandardMaterial({
          color: 0x18181b,
          roughness: 0.85,
          metalness: 0.1,
          side: THREE.BackSide
        });
        const backWallMesh = new THREE.Mesh(backWallGeo, backWallMat);
        backWallMesh.position.set(0, 2.25, -0.01);
        stageGroup.add(backWallMesh);

        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.warn('Could not load backdrop texture, falling back to procedural material:', err);
        // Fallback procedural backdrop plane
        const fallbackMat = new THREE.MeshStandardMaterial({
          color: stage.modelConfig.backdropColor,
          roughness: 0.5
        });
        const fallbackMesh = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 4.05), fallbackMat);
        fallbackMesh.position.set(0, 2.25, 0);
        stageGroup.add(fallbackMesh);
        setIsLoading(false);
      }
    );

    // B. Stage Flooring (Dual-Tiered Red Velvet Platforms)
    const carpetColor = new THREE.Color(stage.modelConfig.carpetColor);
    const carpetMat = new THREE.MeshStandardMaterial({
      color: carpetColor,
      roughness: 0.65,
      metalness: 0.1
    });

    // Main Upper Stage Platform
    const upperPlatformGeo = new THREE.BoxGeometry(7.8, 0.42, 3.4);
    const upperPlatform = new THREE.Mesh(upperPlatformGeo, carpetMat);
    upperPlatform.position.set(0, 0.21, 1.55);
    upperPlatform.receiveShadow = true;
    upperPlatform.castShadow = true;
    stageGroup.add(upperPlatform);

    // Lower Front Step Tier
    const lowerStepGeo = new THREE.BoxGeometry(8.4, 0.22, 0.9);
    const lowerStep = new THREE.Mesh(lowerStepGeo, carpetMat);
    lowerStep.position.set(0, 0.11, 3.55);
    lowerStep.receiveShadow = true;
    lowerStep.castShadow = true;
    stageGroup.add(lowerStep);

    // Step LED Strip Glows (Linear emissive edge strips)
    const glowColor = new THREE.Color(stage.modelConfig.stepGlowColor);
    const glowMat = new THREE.MeshStandardMaterial({
      color: glowColor,
      emissive: glowColor,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });

    // Upper platform front lip
    const upperLipGeo = new THREE.BoxGeometry(7.82, 0.04, 0.04);
    const upperLip = new THREE.Mesh(upperLipGeo, glowMat);
    upperLip.position.set(0, 0.42, 3.25);
    stageGroup.add(upperLip);

    // Lower step front lip
    const lowerLipGeo = new THREE.BoxGeometry(8.42, 0.04, 0.04);
    const lowerLip = new THREE.Mesh(lowerLipGeo, glowMat);
    lowerLip.position.set(0, 0.22, 4.0);
    stageGroup.add(lowerLip);

    // C. Side Portals / Flanking Pilasters
    const pillarMat = new THREE.MeshStandardMaterial({
      color: stage.modelConfig.pillarCream,
      roughness: 0.4,
      metalness: 0.1
    });

    // Left outer portal tower
    const leftPillarGeo = new THREE.BoxGeometry(0.55, 4.4, 0.6);
    const leftPillar = new THREE.Mesh(leftPillarGeo, pillarMat);
    leftPillar.position.set(-3.85, 2.2, 0.25);
    leftPillar.castShadow = true;
    leftPillar.receiveShadow = true;
    stageGroup.add(leftPillar);

    // Right outer portal tower
    const rightPillarGeo = new THREE.BoxGeometry(0.55, 4.4, 0.6);
    const rightPillar = new THREE.Mesh(rightPillarGeo, pillarMat);
    rightPillar.position.set(3.85, 2.2, 0.25);
    rightPillar.castShadow = true;
    rightPillar.receiveShadow = true;
    stageGroup.add(rightPillar);

    // D. Theatrical Drapery (Side Pleated Curtains with Natural Waves)
    const curtainMat = new THREE.MeshStandardMaterial({
      color: 0xfafaf9,
      roughness: 0.75,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    function createCurtainMesh(isLeft) {
      const curtainGroup = new THREE.Group();
      const pleatCount = 7;
      const pleatWidth = 0.16;

      for (let i = 0; i < pleatCount; i++) {
        const cylinderGeo = new THREE.CylinderGeometry(0.08, 0.09, 4.3, 12, 1, true, 0, Math.PI);
        const pleat = new THREE.Mesh(cylinderGeo, curtainMat);
        const xOffset = isLeft ? -4.15 - i * pleatWidth : 4.15 + i * pleatWidth;
        const zOffset = 0.2 + (i % 2 === 0 ? 0.05 : -0.05);
        pleat.position.set(xOffset, 2.15, zOffset);
        pleat.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
        pleat.castShadow = true;
        curtainGroup.add(pleat);
      }
      return curtainGroup;
    }

    stageGroup.add(createCurtainMesh(true));
    stageGroup.add(createCurtainMesh(false));

    // E. Ceiling Proscenium Header (Dark acoustic ceiling with linear cove)
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.9
    });
    const ceilingGeo = new THREE.BoxGeometry(8.6, 0.35, 3.6);
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.set(0, 4.4, 1.6);
    stageGroup.add(ceiling);

    // Ceiling linear LED cove highlight
    const ceilingCoveGeo = new THREE.BoxGeometry(7.6, 0.04, 0.04);
    const ceilingCove = new THREE.Mesh(ceilingCoveGeo, glowMat);
    ceilingCove.position.set(0, 4.22, 0.2);
    stageGroup.add(ceilingCove);

    // F. Spotlights Fixtures on Floor (Footlights)
    const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.7, roughness: 0.3 });
    [-2.2, 0, 2.2].forEach((xPos) => {
      const baseGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.18, 16);
      const base = new THREE.Mesh(baseGeo, fixtureMat);
      base.position.set(xPos, 0.5, 2.8);
      base.castShadow = true;
      stageGroup.add(base);

      // Angled head
      const headGeo = new THREE.CylinderGeometry(0.1, 0.13, 0.22, 16);
      const head = new THREE.Mesh(headGeo, fixtureMat);
      head.position.set(xPos, 0.65, 2.8);
      head.rotation.x = -Math.PI / 5;
      stageGroup.add(head);

      // Luminous lens
      const lensGeo = new THREE.CircleGeometry(0.09, 16);
      const lensMat = new THREE.MeshBasicMaterial({ color: glowColor });
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.position.set(xPos, 0.72, 2.73);
      lens.rotation.x = -Math.PI / 5;
      stageGroup.add(lens);
    });

    // G. Backstage Aluminum Truss Scaffolding (Rear Architecture)
    const trussMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.25
    });

    // Rear vertical truss towers
    [-3.5, -1.2, 1.2, 3.5].forEach((xPos) => {
      const vTrussGeo = new THREE.CylinderGeometry(0.04, 0.04, 4.4, 8);
      const vTruss = new THREE.Mesh(vTrussGeo, trussMat);
      vTruss.position.set(xPos, 2.2, -0.6);
      vTruss.castShadow = true;
      stageGroup.add(vTruss);

      // Structural diagonal bracing
      const dTrussGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.8, 8);
      const dTruss1 = new THREE.Mesh(dTrussGeo, trussMat);
      dTruss1.position.set(xPos, 1.4, -0.6);
      dTruss1.rotation.z = Math.PI / 4;
      stageGroup.add(dTruss1);

      const dTruss2 = new THREE.Mesh(dTrussGeo, trussMat);
      dTruss2.position.set(xPos, 3.0, -0.6);
      dTruss2.rotation.z = -Math.PI / 4;
      stageGroup.add(dTruss2);
    });

    // Rear horizontal lighting pipes
    [1.0, 2.5, 4.0].forEach((yPos) => {
      const hPipeGeo = new THREE.CylinderGeometry(0.035, 0.035, 7.8, 8);
      const hPipe = new THREE.Mesh(hPipeGeo, trussMat);
      hPipe.position.set(0, yPos, -0.6);
      hPipe.rotation.z = Math.PI / 2;
      stageGroup.add(hPipe);
    });

    // Stage ground shadow plane
    const groundGeo = new THREE.PlaneGeometry(24, 24);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.95
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // 7. Animation Loop with Smooth Camera Fly-To Interpolation
    let lastTime = performance.now();

    const animate = (currentTime) => {
      animationFrameId.current = requestAnimationFrame(animate);

      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Handle Smooth Preset Camera Flying
      if (targetCamPos.current) {
        camera.position.lerp(targetCamPos.current.pos, 0.08);
        controls.target.lerp(targetCamPos.current.target, 0.08);

        if (camera.position.distanceTo(targetCamPos.current.pos) < 0.05) {
          camera.position.copy(targetCamPos.current.pos);
          controls.target.copy(targetCamPos.current.target);
          targetCamPos.current = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    // 8. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [stage.id]);

  // Camera preset fly trigger
  const flyToPreset = (key) => {
    const preset = presets[key];
    if (!preset) return;

    setActivePreset(key);
    setCurrentViewLabel(preset.label);
    targetCamPos.current = {
      pos: preset.pos.clone(),
      target: preset.target.clone()
    };

    if (controlsRef.current) {
      controlsRef.current.autoRotate = false;
      setIsAutoRotating(false);
    }
  };

  // Auto-rotate toggle
  const toggleAutoRotate = () => {
    if (controlsRef.current) {
      const next = !controlsRef.current.autoRotate;
      controlsRef.current.autoRotate = next;
      setIsAutoRotating(next);
      if (next) {
        targetCamPos.current = null;
        setActivePreset('360');
      }
    }
  };

  // Zoom helpers
  const handleZoom = (delta) => {
    if (cameraRef.current && controlsRef.current) {
      const dir = new THREE.Vector3();
      cameraRef.current.getWorldDirection(dir);
      cameraRef.current.position.addScaledVector(dir, delta);
      controlsRef.current.update();
    }
  };

  // Reset to original view
  const handleReset = () => {
    flyToPreset('FRONT');
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden border border-stone-800 bg-stone-950 shadow-2xl flex flex-col ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'min-h-[520px] lg:min-h-[600px]'
    }`}>

      {/* Top HUD Bar */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-5 flex items-center justify-between z-20 pointer-events-none bg-gradient-to-b from-black/85 via-black/40 to-transparent">
        
        {/* Stage Identity Badge */}
        <div className="pointer-events-auto space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#A91F35] text-white text-[11px] font-black uppercase tracking-wider shadow-md">
              {stage.englishName}
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#E6A916]/20 border border-[#E6A916]/40 text-[#E6A916] text-[10px] font-mono font-bold uppercase">
              INTERACTIVE 3D MODEL
            </span>
          </div>
          <h3 className="font-serif font-black text-xl sm:text-2xl text-white drop-shadow-md">
            {stage.officialName}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
            <Compass className="w-3.5 h-3.5" />
            <span>{currentViewLabel}</span>
          </div>
        </div>

        {/* View Mode Toggle & Lightbox Link */}
        <div className="pointer-events-auto flex items-center gap-2">
          
          {/* Switch 3D / Original Photo */}
          <div className="bg-stone-900/90 border border-white/15 p-1 rounded-2xl flex items-center gap-1 shadow-lg backdrop-blur-sm">
            <button
              data-view-mode="3d"
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-[#E6A916] text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              3D Stage
            </button>
            <button
              data-view-mode="photo"
              onClick={() => setViewMode('photo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'photo'
                  ? 'bg-[#E6A916] text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Original Photo
            </button>
          </div>

          {/* Enlarge in Lightbox */}
          <button
            onClick={() => onOpenLightbox({
              title: `${stage.englishName} • Original Reference Photograph`,
              file: stage.referencePhoto,
              caption: `${stage.officialName} • ${stage.subtitle}`
            })}
            className="p-2.5 rounded-2xl bg-stone-900/90 hover:bg-stone-800 border border-white/15 text-white transition-all shadow-lg cursor-pointer"
            title="Inspect Original Stage Photograph"
          >
            <Camera className="w-4 h-4 text-[#E6A916]" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-2xl bg-stone-900/90 hover:bg-stone-800 border border-white/15 text-white transition-all shadow-lg cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* Main 3D Canvas / Photo Fallback Area */}
      <div className="relative flex-1 w-full h-full min-h-[460px] sm:min-h-[520px]">
        
        {/* Keep 3D Canvas always mounted to prevent WebGL context loss */}
        <div
          ref={mountRef}
          className={`w-full h-full cursor-grab active:cursor-grabbing ${viewMode === '3d' ? 'block' : 'hidden'}`}
        />

        {/* High-Resolution Photo Comparison Mode */}
        {viewMode === 'photo' && (
          <div className="w-full h-full flex items-center justify-center p-6 bg-stone-950">
            <img
              src={stage.referencePhoto}
              alt={stage.officialName}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && viewMode === '3d' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-stone-950/80 backdrop-blur-xs text-white space-y-3">
            <RefreshCw className="w-8 h-8 text-[#E6A916] animate-spin" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-amber-200">
              Generating 3D Stage Architecture...
            </span>
          </div>
        )}

        {/* Load Error State */}
        {loadError && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-stone-950 p-6 text-center text-white space-y-4">
            <p className="text-red-400 font-bold text-sm">{loadError}</p>
            <p className="text-xs text-stone-400 max-w-md">Displaying original verified reference photograph instead.</p>
            <img src={stage.referencePhoto} alt={stage.officialName} className="max-h-64 object-contain rounded-xl" />
          </div>
        )}

        {/* Floating Instruction Hint */}
        {viewMode === '3d' && (
          <div className="hidden sm:flex absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xs text-[11px] text-white/75 font-mono pointer-events-none items-center gap-2 border border-white/10 z-10">
            <span>Drag to rotate 360°</span>
            <span>•</span>
            <span>Scroll to zoom</span>
            <span>•</span>
            <span>Click preset buttons below</span>
          </div>
        )}

        {/* Side Floating Zoom & Reset Buttons */}
        {viewMode === '3d' && (
          <div className="absolute right-4 bottom-24 flex flex-col gap-2 z-20">
            <button
              onClick={() => handleZoom(1.0)}
              className="p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-white border border-white/15 shadow-lg transition-all cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-stone-300 hover:text-white" />
            </button>
            <button
              onClick={() => handleZoom(-1.0)}
              className="p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-white border border-white/15 shadow-lg transition-all cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-stone-300 hover:text-white" />
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-white border border-white/15 shadow-lg transition-all cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4 text-[#E6A916]" />
            </button>
          </div>
        )}

      </div>

      {/* Bottom Multi-Angle View Controls Dock */}
      {viewMode === '3d' && (
        <div className="p-3 sm:p-4 bg-stone-900/95 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 z-20">
          
          {/* Preset Buttons Bar */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 font-mono hidden md:inline-block mr-1">
              CAMERA PRESETS:
            </span>

            {['FRONT', 'LEFT', 'RIGHT', 'BACK', 'TOP', 'ELEVATED'].map((key) => {
              const isActive = activePreset === key && !isAutoRotating;
              return (
                <button
                  key={key}
                  onClick={() => flyToPreset(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#A91F35] text-white shadow-md border border-red-400/50'
                      : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white border border-white/10'
                  }`}
                >
                  {key}
                </button>
              );
            })}
          </div>

          {/* 360° Auto-Rotate Toggle Button */}
          <button
            onClick={toggleAutoRotate}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
              isAutoRotating
                ? 'bg-[#E6A916] text-stone-950 font-black'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-white/10'
            }`}
            title="Toggle 360° Auto-Rotation"
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>360° {isAutoRotating ? 'Rotating' : 'Auto-Rotate'}</span>
          </button>

        </div>
      )}

      {/* Undocumented Details Approximation Disclaimer Plaque */}
      <div className="py-2 px-4 bg-stone-950 border-t border-white/5 text-[10px] text-stone-400 text-center font-mono">
        Stage front and architectural elements modeled from official festival designs. Undocumented backstage truss rigging rendered as structural representation.
      </div>

    </div>
  );
}
