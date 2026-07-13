"use client";

import {Breadcrumb, BreadcrumbItem, Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {useRef, SubmitEvent, useState} from "react";
import {createClient} from "@/lib/supabase/client";
import safeFindDOMNode from "react-bootstrap/cjs/safeFindDOMNode";
import {error} from "next/dist/build/output/log";

export default function Page() {
    const currentPasswordRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const [match, setMatch] = useState<boolean>();
    const [oldPasswordError, setOldPasswordError] = useState<string>();
    const [newPasswordError, setNewPasswordError] = useState<string>();

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        e.stopPropagation();
        const passwordField: HTMLInputElement = safeFindDOMNode(passwordRef.current) as HTMLInputElement;
        const confirmPasswordField: HTMLInputElement = safeFindDOMNode(confirmPasswordRef.current) as HTMLInputElement;
        const currentPasswordField: HTMLButtonElement = safeFindDOMNode(currentPasswordRef.current) as HTMLButtonElement;
        if (passwordField.value !== confirmPasswordField.value) {
            setMatch(false)
            return;
        } else {
            setMatch(true)
        }

        const supabase = createClient()
        const {data, error} = await supabase.auth.updateUser({password: passwordField.value, current_password: currentPasswordField.value})
        if (error) {
            setNewPasswordError(error.message)
        } else {
            window.location.href = "/profile"
        }
    }

    return <div className="main-page-content">
        <Breadcrumb>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/login">Login</BreadcrumbItem>
            <BreadcrumbItem active>Reset Password</BreadcrumbItem>
        </Breadcrumb>

        <h1>Password Reset</h1>
        <p>Enter your new password below to reset your password.</p>

        <Form className="password-reset-form" data-bs-theme="dark" onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" placeholder="********" ref={currentPasswordRef} isInvalid={!!oldPasswordError} />
                <Form.Control.Feedback type="invalid">{oldPasswordError}</Form.Control.Feedback>
            </Form.Group>
            <br/>
            <Form.Group>
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" placeholder="********" ref={passwordRef} isInvalid={!!newPasswordError} />
                <Form.Control.Feedback type="invalid">{newPasswordError}</Form.Control.Feedback>
            </Form.Group>
            <br/>
            <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="********" ref={confirmPasswordRef} isInvalid={match !== undefined && !match}/>
                <Form.Control.Feedback type="invalid">Passwords do not match</Form.Control.Feedback>
            </Form.Group>
            <br/>
            <Button type="submit">Reset Password</Button>
        </Form>
    </div>
}