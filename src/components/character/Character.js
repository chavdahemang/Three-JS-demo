import { useAnimations, useFBX } from "@react-three/drei";
import { useEffect, useRef } from "react";

export default function Character({
    shirtColor = "#ef4444",
    pantsColor = "#4b5563",
    activeAnimation = "breathing"
}) {
    const group = useRef();

    const character = useFBX("/avatar1.fbx");
    const breathingFbx = useFBX("/Breathing Idle.fbx");

    if (character.animations?.[0]) character.animations[0].name = "default";
    if (character.animations?.[1]) character.animations[1].name = "dance";
    if (breathingFbx.animations?.[0]) breathingFbx.animations[1].name = "breathing";

    const allClips = [...character.animations, ...breathingFbx.animations];
    const { actions } = useAnimations(allClips, group);

    useEffect(() => {
        const nextAction = actions[activeAnimation];
        if (!nextAction) return;

        Object.values(actions).forEach((a) => {
            if (a !== nextAction && a.isRunning()) {
                a.fadeOut(0.4);
            }
        });

        nextAction.reset().fadeIn(0.4).play();

        return () => {
            nextAction.fadeOut(0.3);
        };
    }, [actions, activeAnimation]);

    useEffect(() => {
        character.traverse((child) => {
            if (!child.isMesh || !child.material) return;

            const materials = Array.isArray(child.material) ? child.material : [child.material];

            materials.forEach((mat) => {
                const matName = mat.name || "";

                if (matName === "Topmat" || matName.toLowerCase().includes("top") || matName.toLowerCase().includes("shirt")) {
                    if (mat.map) {
                        mat.map = null;
                        mat.needsUpdate = true;
                    }
                    mat.color.set(shirtColor);
                }

                if (matName === "Bottommat" || matName.toLowerCase().includes("bottom") || matName.toLowerCase().includes("pant")) {
                    mat.color.set(pantsColor);
                }
            });
        });
    }, [character, shirtColor, pantsColor]);

    return (
        <group ref={group}>
            <primitive object={character} scale={0.01} position={[0, -1.0, 0]} />
        </group>
    );
}