'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Canvas } from '@react-three/fiber';
import { Html, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';
import styles from './StorySection.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STORY_BEADS = [
  { id: 1, titleKey: 'step1Title', descKey: 'step1Desc', color: '#E8A0BF', labelColor: '#C86B93', emoji: '🎨', finalAngle: -90 },
  { id: 2, titleKey: 'step2Title', descKey: 'step2Desc', color: '#F9F5E3', labelColor: '#9E841B', emoji: '💎', finalAngle: -30 },
  { id: 3, titleKey: 'step3Title', descKey: 'step3Desc', color: '#99DBB4', labelColor: '#368C5D', emoji: '📿', finalAngle: 30 },
  { id: 4, titleKey: 'step4Title', descKey: 'step4Desc', color: '#B8C0FF', labelColor: '#5360C7', emoji: '✨', finalAngle: 90 },
  { id: 5, titleKey: 'step5Title', descKey: 'step5Desc', color: '#FFD3B6', labelColor: '#D97736', emoji: '🔍', finalAngle: 150 },
  { id: 6, titleKey: 'step6Title', descKey: 'step6Desc', color: '#D8B4F8', labelColor: '#8C4DBF', emoji: '💖', finalAngle: 210 },
] as const;

// 3D Scene Component
function SceneContent({ t, sectionRef }: { t: any, sectionRef: React.RefObject<HTMLDivElement | null> }) {
  const tl = useRef<gsap.core.Timeline | null>(null);

  // 3D Refs
  const braceletGroupRef = useRef<THREE.Group>(null);
  const beadWrappersRef = useRef<THREE.Group[]>([]);
  const beadMeshesRef = useRef<THREE.Mesh[]>([]);
  const charmRef = useRef<THREE.Group>(null);
  
  // DOM Refs (inside Html)
  const focusCardRefs = useRef<HTMLDivElement[]>([]);

  // State to enable drag rotation only at the end
  const [canRotate, setCanRotate] = useState(false);

  useEffect(() => {
    if (!braceletGroupRef.current || !sectionRef.current) return;

    // Reset initial states
    beadWrappersRef.current.forEach((ref) => {
      if (ref) ref.rotation.z = THREE.MathUtils.degToRad(15); // Start off-screen bottom-right
    });
    
    beadMeshesRef.current.forEach((mesh) => {
      if (mesh) mesh.scale.set(1, 1, 1);
    });
    
    if (charmRef.current) {
      charmRef.current.scale.set(0, 0, 0);
    }

    focusCardRefs.current.forEach((ref) => {
      if (ref) gsap.set(ref, { autoAlpha: 0, y: 30 });
    });

    // Build timeline connected to page scroll
    tl.current = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          // Enable free rotation interaction only when climax is reached
          setCanRotate(self.progress > 0.85);
        }
      }
    });

    // Phase 1: Threading
    STORY_BEADS.forEach((bead, i) => {
      const isFirst = i === 0;
      const stepDuration = 1;
      const stepLabel = `step${i}`;

      tl.current!.addLabel(stepLabel);

      if (!isFirst) {
        for (let j = 0; j < i; j++) {
          // Push older beads UP the string (towards top-left)
          const targetRot = THREE.MathUtils.degToRad(45 + (i - j) * 8); 
          tl.current!.to(beadWrappersRef.current[j].rotation, {
            z: targetRot,
            duration: stepDuration,
            ease: 'power1.inOut'
          }, stepLabel);
        }

        if (focusCardRefs.current[i - 1]) {
          tl.current!.to(focusCardRefs.current[i - 1], {
            autoAlpha: 0,
            y: -30,
            duration: stepDuration * 0.5,
          }, stepLabel);
        }
      }

      if (beadWrappersRef.current[i]) {
        tl.current!.to(beadWrappersRef.current[i].rotation, {
          z: THREE.MathUtils.degToRad(45), // Center bead at 45 degrees relative to bottom-left torus
          duration: stepDuration,
          ease: 'power1.inOut'
        }, stepLabel);
      }

      if (focusCardRefs.current[i]) {
        tl.current!.to(focusCardRefs.current[i], {
          autoAlpha: 1,
          y: 0,
          duration: stepDuration * 0.5,
        }, stepLabel + `+=${stepDuration * 0.4}`);
      }

      tl.current!.to({}, { duration: stepDuration * 0.5 });
    });

    const climaxLabel = 'climax';
    tl.current!.addLabel(climaxLabel, "+=0.5");

    // Zoom out bracelet
    // Initial giant circle is at X: -10.6, Y: -10.6, Radius: 15, so top-right edge is at X: 0, Y: 0 (center)
    tl.current!.to(braceletGroupRef.current!.position, {
      x: 0,
      y: 0,
      duration: 3,
      ease: 'power2.inOut'
    }, climaxLabel);

    tl.current!.to(braceletGroupRef.current!.scale, {
      x: 0.15,
      y: 0.15,
      z: 0.15,
      duration: 3,
      ease: 'power2.inOut'
    }, climaxLabel);

    STORY_BEADS.forEach((bead, i) => {
      // FORCE hide every single focus card explicitly
      if (focusCardRefs.current[i]) {
        tl.current!.to(focusCardRefs.current[i], {
          autoAlpha: 0,
          duration: 0.5
        }, climaxLabel);
      }

      tl.current!.to(beadWrappersRef.current[i].rotation, {
        z: THREE.MathUtils.degToRad(bead.finalAngle),
        duration: 3,
        ease: 'power2.inOut'
      }, climaxLabel);
      
      // Scale up the beads significantly so they are clearly visible when the bracelet zooms out (0.15 scale)
      if (beadMeshesRef.current[i]) {
        tl.current!.to(beadMeshesRef.current[i].scale, {
          x: 6.0,
          y: 6.0,
          z: 6.0,
          duration: 3,
          ease: 'power2.inOut'
        }, climaxLabel);
      }
    });

    if (charmRef.current) {
      tl.current!.to(charmRef.current.scale, {
        x: 1.3,
        y: 1.3,
        z: 1.3,
        duration: 1.5,
        ease: 'back.out(1.5)'
      }, climaxLabel + "+=1.5");
    }

    return () => {
      tl.current?.kill();
    };
  }, [sectionRef]);

  const beadMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    roughness: 0.15,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  }), []);

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <Environment preset="city" />

      <PresentationControls
        global
        snap={true}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
        enabled={canRotate}
      >
        <group ref={braceletGroupRef} position={[-10.6, -10.6, 0]} scale={[1, 1, 1]}>
          
          {/* Giant Wire Torus */}
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[15, 0.08, 32, 100]} />
            <meshStandardMaterial color="#E8A0BF" opacity={0.6} transparent />
          </mesh>

          {/* Beads */}
          {STORY_BEADS.map((bead, i) => (
            <group key={bead.id} ref={(el) => { if(el) beadWrappersRef.current[i] = el; }}>
              <group position={[15, 0, 0]}>
                
                <mesh castShadow receiveShadow ref={(el) => { if(el) beadMeshesRef.current[i] = el; }}>
                  <sphereGeometry args={[0.4, 64, 64]} />
                  <primitive object={beadMaterial.clone()} color={new THREE.Color(bead.color)} />
                </mesh>

                {/* Html Focus Card */}
                <Html
                  position={[1.4, 0, 0]}
                  center
                  className={styles.htmlOverlay}
                  zIndexRange={[100, 0]}
                >
                  <div 
                    ref={(el) => { if(el) focusCardRefs.current[i] = el; }}
                    className={styles.focusCard}
                    style={{ borderColor: bead.color }}
                  >
                    {/* Image Background (fills the entire card) */}
                    <div className={styles.focusImageBg} style={{ backgroundColor: bead.color + '33' }}>
                      <span className={styles.placeholderEmoji}>{bead.emoji}</span>
                    </div>

                    {/* Glassmorphism Text Overlay at the bottom */}
                    <div className={styles.focusContentOverlay}>
                      <div className={styles.focusHeader}>
                        <div className={styles.focusBadge} style={{ backgroundColor: bead.color }}>
                          {bead.id}
                        </div>
                        <h3 className={styles.focusTitle}>{t(bead.titleKey)}</h3>
                      </div>
                      <p className={styles.focusDesc}>{t(bead.descKey)}</p>
                    </div>
                  </div>
                </Html>
              </group>
            </group>
          ))}

          {/* Center Charm */}
          <group ref={charmRef} position={[0, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[2.5, 2.5, 0.4, 32]} />
              <meshPhysicalMaterial color="#FFFFFF" metalness={0.1} roughness={0.2} />
            </mesh>
            <Html center position={[0, 0, 0.25]} transform scale={0.8}>
              <div className={styles.charmHtml}>
                <span className={styles.charmEmoji}>🌸</span>
                <span className={styles.charmText}>Cheerfully</span>
              </div>
            </Html>
          </group>

        </group>
      </PresentationControls>

      <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={25} blur={2.5} far={4} />
    </>
  );
}

export function StorySection() {
  const t = useTranslations('home.story');
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section className={styles.storySection} id="story" ref={sectionRef}>
      
      <div className={styles.stickyViewport}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <Sparkles size={14} />
            <span>{t('badge')}</span>
          </div>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        <div className={styles.canvasWrapper}>
          <Canvas shadows camera={{ position: [0, 0, 10], fov: 35 }}>
            <SceneContent t={t} sectionRef={sectionRef} />
          </Canvas>
        </div>
      </div>
      
    </section>
  );
}
