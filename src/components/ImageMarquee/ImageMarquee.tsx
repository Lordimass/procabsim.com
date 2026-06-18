import "./ImageMarquee.scss"
import Image from "next/image"

interface Props {
    images: string[];
}

export default function ImageMarquee({ images }: Props) {
    const duplicatedImages = [...images, ...images];

    return (
        <div className={"wrapper"}>
            <div className={"track"}>
                {duplicatedImages.map((src, index) => (
                    <div key={index} className={"item"}>
                        <Image
                            src={src}
                            alt=""
                            width={150}
                            height={50}
                            style={{
                                display: "flex",
                                width: "100%",
                                height: "auto",
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}