import "./SupporterImages.scss"
import Image from "next/image"

interface Props {
    images: string[];
}

export default function SupporterImages({ images }: Props) {
    return <div className={"supporters"}>
        {images.map((image, i) => (
            <div key={i}>
                <Image src={image} alt={""} width={150} height={150} />
            </div>

        ))}
    </div>
}