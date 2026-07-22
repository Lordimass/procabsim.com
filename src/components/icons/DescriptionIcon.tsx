type props = {
    strokeColor: string
}

// Used by Schedule-X Calendar Modal

/**
 * Origin of SVG: https://www.svgrepo.com/svg/506838/list
 * License: PD License
 * Author: Salah Elimam
 * Author website: https://www.figma.com/@salahelimam
 * */
export default function DescriptionIcon({ strokeColor }: props) {
    return (
        <>
            <svg
                className="sx__event-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                    <rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        rx="3"
                        stroke={strokeColor}
                        strokeWidth="2"
                    ></rect>
                    <path
                        d="M16 10L8 10"
                        stroke={strokeColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                    ></path>
                    <path
                        d="M16 14L8 14"
                        stroke={strokeColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                    ></path>
                </g>
            </svg>
        </>
    )
}