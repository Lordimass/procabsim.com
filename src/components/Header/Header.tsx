import "./Header.scss";
import Image from "next/image";

export default function Header() {
  return (
    <>
      <div className="header">
        <a href={"/"} aria-label='Return to "ProCab Simulators" Home Page'>
          <Image
            className="logo"
            src={"/favicon.svg"}
            width={50}
            height={50}
            alt="A minimalist stylised train wheel with orange spokes"
          />
        </a>
      </div>
    </>
  );
}
