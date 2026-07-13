"use client";

import {useEffect, useRef, useState} from "react";
import {createClient} from "@/lib/supabase/client";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {SubmitEvent} from "react";
import styles from "./page.module.scss"
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import safeFindDOMNode from "react-bootstrap/cjs/safeFindDOMNode";
import {AuthError} from "@supabase/server";
import {AuthApiError} from "@supabase/supabase-js";

export default function Page() {
    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(r => {
            if (r.error) throw r.error;
            else if (r) window.location.href = "/login/logged-in"
        })
    }, [])


    const [validated, setValidated] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const validity = form.checkValidity();
        setValidated(true);
        if (!validity) {
            e.stopPropagation();
            return;
        }

        const emailField = safeFindDOMNode(emailRef.current) as HTMLInputElement;
        const passwordField = safeFindDOMNode(passwordRef.current) as HTMLInputElement;
        let result;
        try {
            result = await login(emailField.value, passwordField.value)
        } catch (error) {
            if (!(error instanceof AuthApiError)) throw error;
            setError("Invalid email or password");
            return;
        }

        if (result?.newAccount) {
            window.location.href = "/login/account-created";
        } else {
            window.location.href = "/login/logged-in";
        }

    }

    return (<div className="main-page-content">
        <Breadcrumb>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem active>Login</BreadcrumbItem>
        </Breadcrumb>
        <Form id={styles.loginForm} onSubmit={handleSubmit} data-bs-theme="dark" noValidate validated={validated}>
            <h2>Login or Create a New Account</h2>
            <br/>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" ref={emailRef} isInvalid={!!error}/>
                <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="********" ref={passwordRef} isInvalid={!!error}/>
                <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSubmit">
                <Button variant="primary" type="submit">
                    Login / Sign up
                </Button>
            </Form.Group>
        </Form>
    </div>);
}

export async function login(email: string, password: string) {
    const supabase = createClient();
    console.log("Get User ", await supabase.auth.getUser())
    const {data: emailExists, error: emailCheckError} = await supabase.rpc("email_exists", {email_to_check: email})
    if (emailCheckError) {console.error(emailCheckError); return;}
    if (emailExists) {
        const {data: signInData, error: signInError} = await supabase.auth.signInWithPassword({email, password})
        if (!signInError) {
            console.log("Sign in successful: ", signInData)
            console.log("Get User ", await supabase.auth.getUser())
            return {...signInData, newAccount: false}
        } else {
            console.error("Something went wrong signing in: ", signInError)
            throw signInError
        }
    } else {
        const {data: signUpData, error: signUpError} = await supabase.auth.signUp({email, password})
        if (!signUpError) {
            console.log("Sign up successful: ", signUpData)
            return {...signUpData, newAccount: true}
        } else {
            console.error("Something went wrong signing up: ", signUpError)
            throw signUpError
        }
    }
}