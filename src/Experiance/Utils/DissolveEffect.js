import gsap from 'gsap';
import createRevealFromGlowMaterial from './createRevealFromGlowMaterial';

export default class DissolveEffect {
    constructor(meshes, noiseMap) {
        this.meshes = meshes;
        this.noiseMap = noiseMap;
        this.applied = false;
    }

    apply() {
        if (this.applied) return;
        this.meshes.forEach(mesh => {
            mesh.traverse(child => {
                if (!child.material || !child.isMesh) return;
                child.material.depthWrite = false;

                if (!child.userData.originalMaterial) {
                    child.userData.originalMaterial = child.material;
                }

                const originalMap = child.userData.originalMaterial.map ?? null;
                const shaderMaterial = createRevealFromGlowMaterial(originalMap, this.noiseMap);
                shaderMaterial.uniforms.threshold.value = 1;
                shaderMaterial.uniforms.time.value = 0;

                child.material = shaderMaterial;
                child.visible = true;
                child.userData.wasDissolved = true;
            });
        });

        this.applied = true;
    }



    create(duration, onComplete) {
        this.apply();
        this.animateTime(duration);

        let remaining = 0;

        this.meshes.forEach(mesh => {
            mesh.traverse(child => {
                if (child.material?.uniforms?.threshold !== undefined) {
                    child.visible = true;
                    remaining++;

                    gsap.to(child.material.uniforms.threshold, {
                        value: 0,
                        duration: duration,
                        ease: "power2.out",
                        onComplete: () => {
                            remaining--;
                            if (remaining === 0 && onComplete) {
                                onComplete();
                            }
                        }
                    });
                }
            });
        });
    }

    animateTime(duration) {
        const start = performance.now();

        const tick = () => {
            const now = performance.now();
            const elapsed = (now - start) / 1000;

            this.meshes.forEach(mesh => {
                mesh.traverse(child => {
                    if (child.material?.uniforms?.time !== undefined) {
                        child.material.uniforms.time.value = elapsed;
                    }
                });
            });

            if (elapsed < duration) {
                requestAnimationFrame(tick);
            }
        };

        tick();
    }

    burn(duration, onComplete) {
        this.apply();

        let remaining = 0;

        this.meshes.forEach(mesh => {
            mesh.traverse(child => {
                if (child.material?.uniforms?.threshold !== undefined) {
                    child.visible = true;
                    remaining++;

                    gsap.to(child.material.uniforms.threshold, {
                        value: 1,
                        duration: duration,
                        ease: "power2.inOut",
                        onComplete: () => {
                            remaining--;
                            if (remaining === 0 && onComplete) {
                                onComplete();
                            }
                        }
                    });
                }
            });
        });
    }
}
