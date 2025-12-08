import { characterImages } from "../constants/characterMap";

interface Props {
    characterType: string;
}

export default function CharacterDisplay({ characterType }: Props) {
    const imageSrc = characterImages[characterType] || characterImages["KEYCAP_01"]

    return (
        <img
            src={imageSrc}
            alt={characterType}
            style={{
                width: "200px",
                imageRendering: "pixelated",
            }}
        />
    );
}