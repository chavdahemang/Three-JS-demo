import { useAnimations, useFBX, } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Audio, AudioListener, AudioLoader} from "three";

export default function Character({
    shirtColor = "#ef4444",
    pantsColor = "#4b5563",
    activeAnimation = "breathing",
    playMusic=false
}) {
    const group = useRef();
    // create an AudioListener and add it to the camera
    // const listener = new THREE.AudioListener();
    const listener =new  AudioListener()
    // camera.add(listener);

    // create a global audio source
    // const sound = new Audio(listener);
    const sound = new Audio(listener)

    // load a sound and set it as the Audio object's buffer
    
    const handlePlayMusic = ()=>{
        const audioLoader = new AudioLoader();
        audioLoader.load('sound1.mp3', function (buffer) {
            console.log('sounds  = ',audioLoader);
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.5);
            if(playMusic){
                sound.play();
            }else{
                sound.stop();
            }
        });
    }


    const character = useFBX("/avatar1.fbx");
    const breathingFbx = useFBX("/Breathing Idle.fbx");
    const dancingFBX = useFBX('/dancing2.fbx');

    if (character.animations?.[0]) character.animations[0].name = "default";
    if (character.animations?.[1]) character.animations[1].name = "dance";
    if (breathingFbx.animations?.[0]) breathingFbx.animations[1].name = "breathing";
    if (dancingFBX.animations?.[0]) dancingFBX.animations[0].name = "dance2";


    const allClips = [...character.animations, ...breathingFbx.animations, ...dancingFBX.animations];
    const { actions } = useAnimations(allClips, group);

    console.log(allClips);
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


    useEffect(()=>{
        console.log('music ',playMusic);
        handlePlayMusic()
    },[playMusic])
    return (
        <group ref={group}>
            <primitive object={character} scale={0.01} position={[0, -1.0, 0]} />
        </group>
    );
}