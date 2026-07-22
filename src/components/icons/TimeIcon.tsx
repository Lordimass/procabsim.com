type props = {
    strokeColor: string
}

// Used by Schedule-X Calendar Modal

/**
 * Origin of SVG: https://www.svgrepo.com/svg/506771/time
 * License: PD License
 * Author Salah Elimam
 * Author website: https://www.figma.com/@salahelimam
 * */
export default function TimeIcon({ strokeColor }: props) {
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
                    <path
                        d="M12 8V12L15 15"
                        stroke={strokeColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                    ></path>
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke={strokeColor}
                        strokeWidth="2"
                    ></circle>
                </g>
            </svg>
        </>
    )
}