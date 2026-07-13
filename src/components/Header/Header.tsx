import "./Header.scss";
import Image from "next/image";
import {
    DropdownItem, Nav, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle, NavDropdown, NavLink,
} from "react-bootstrap";
import {getUser, createClient} from "@/lib/supabase/server";

export default async function Header() {
    const supabase = await createClient()
    const user = await getUser(supabase);

    return (
        <>
            <Navbar className="header" expand="xl" data-bs-theme="dark">
                <NavbarBrand href="/" aria-label="Return to ProCab Simulators Home Page">
                    <Image
                        className="logo"
                        src="/favicon.svg"
                        width={50}
                        height={50}
                        alt="A minimalist stylised train wheel with orange spokes"
                        loading="eager"
                    />
                </NavbarBrand>
                <NavbarToggle aria-controls="basic-navbar-nav" />
                <NavbarCollapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink className="btn btn-primary" href="/book">Book Your Slot</NavLink>
                        <NavDropdown className="btn btn-outline-primary" title="Our Simulators" id="basic-nav-dropdown">
                            <DropdownItem href="/simulators/class700">Class 700</DropdownItem>
                        </NavDropdown>
                        <NavLink className="btn btn-outline-primary" href="/contact-us">Contact Us</NavLink>
                    </Nav>
                    <Nav>
                        {user
                            ? <NavLink href="/profile" className="no-outline">
                                <Image src="/user-profile.svg" width={50} height={50} alt="An icon showing the silloutte of a person in a circle"/>
                        </NavLink>
                            : <NavLink className="btn btn-outline-primary" href="/login">Login</NavLink>
                        }

                    </Nav>
                </NavbarCollapse>
            </Navbar>
        </>
    );
}

