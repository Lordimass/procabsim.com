import "./Header.scss";
import Image from "next/image";
import Dropdown from "react-bootstrap/Dropdown";
import {Button, DropdownItem, DropdownMenu, DropdownToggle} from "react-bootstrap";

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
                        loading="eager"
                    />
                </a>
                <Dropdown>
                    <DropdownToggle id="dropdown-basic" >Our Simulators</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem href="/simulators/class700">Class 700</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button variant={"outline-primary"} href={"/contact-us"}>Contact Us</Button>
            </div>
        </>
    );
}
