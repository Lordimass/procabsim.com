"use client";
import {SubmitEvent, useState} from "react";
import "./ContactForm.scss"
import {Button, Col, Form, FormControl, FormGroup, FormLabel, Row} from "react-bootstrap";

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [failed, setFailed] = useState(false);
    const [validated, setValidated] = useState(false);

    async function handleSubmit(
        e: SubmitEvent<HTMLFormElement>
    ) {
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        if (!form.checkValidity()) {
            e.stopPropagation();
            setValidated(true);
            setLoading(false);
            return;
        }

        const formData = new FormData(form);
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: formData.get("name"),
                email: formData.get("email"),
                message: formData.get("message"),
            }),
        });

        setLoading(false);

        if (response.ok) {
            setSent(true);
            setFailed(false);
            form.reset();
        } else {
            setFailed(true);
        }
    }

    return (
        <Form onSubmit={handleSubmit} noValidate validated={validated}>
            <Row className="mb-2">
                <FormGroup as={Col} md="4">
                    <FormLabel>Name</FormLabel>
                    <FormControl name="name" required placeholder="Your Name" />
                    <FormControl.Feedback type="invalid">Please enter a name</FormControl.Feedback>
                </FormGroup>
                <FormGroup as={Col} md={"4"}>
                    <FormLabel>Email</FormLabel>
                    <FormControl name="email" type="email" required placeholder={"example@example.com"} />
                    <FormControl.Feedback type="invalid">Please enter a valid email address</FormControl.Feedback>
                </FormGroup>
            </Row>
            <Row className="mb-2">
                <FormGroup as={Col} md="12">
                    <FormLabel>Message</FormLabel>
                    <FormControl as="textarea" name="message" required placeholder="Enter your message to us here"/>
                    <FormControl.Feedback type="invalid">Don't forget to add your message!</FormControl.Feedback>
                </FormGroup>
            </Row>
            <hr/>
            <Button disabled={loading || sent} type="submit">
                {loading ? "Sending..." : sent ? "Message received, thank you!" : "Send"}
            </Button>
            <div className="invalid-feedback" style={{display: failed ? "block" : "none"}}>Something went wrong!</div>
        </Form>
    );
}