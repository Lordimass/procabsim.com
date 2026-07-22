import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import {SimulatorOptionalExtra as OptEx} from "@/lib/types/types";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import InputGroup from "react-bootstrap/InputGroup";
import {createClient} from "@/lib/supabase/client";
import {DeleteFromListButton} from "@/app/admin/settings/page";

export default function OptionalExtraSettings() {
    const extras = useGetOptionalExtras();
    const [optionalExtras, setOptionalExtras] = useState<(OptEx | null)[]>(extras);
    useEffect(() => {
        setOptionalExtras(extras)
    }, [extras]);
    const [newOptExName, setNewOptExName] = useState("");

    return <><hr/><h2>Optional Extras</h2><hr/>
        <p>
            Create and modify the extra experiences that can be added to bookings.
        </p>
        <Accordion className={"mb-2"}>{
            optionalExtras.map(
                optEx => optEx ? <OptionalExtraComponent
                    optionalExtra={optEx}
                    key={optEx.name}
                    optionalExtras={optionalExtras} setOptionalExtras={setOptionalExtras}
                /> : null)
        }</Accordion>
        <InputGroup>
            <Button disabled={newOptExName === ""} onClick={()=>{setOptionalExtras([...optionalExtras, {
                name: newOptExName,
                created_at: (new Date()).toISOString(),
                disclaimer: "",
                price: 0,
                description: ""
            }])
                setNewOptExName("")
            }}>Create New</Button>
            <Form.Control value={newOptExName} placeholder={"New Optional Extra Name"} onChange={(e)=>{
                setNewOptExName(e.target.value);
            }}/>
        </InputGroup>

    </>
}

function OptionalExtraComponent({optionalExtra, optionalExtras, setOptionalExtras}: {optionalExtra: OptEx, optionalExtras: (OptEx | null)[], setOptionalExtras: (optEx: (OptEx | null)[]) => void}) {
    const [originalOptEx, setOriginalOptEx] = useState<OptEx>(optionalExtra);
    const [newOptEx, setNewOptEx] = useState<OptEx>(originalOptEx);
    const [feedback, setFeedback] = useState("");

    async function handleSave() {
        const supabase = createClient();
        const resp = await supabase
            .from("optional_extras")
            .upsert(newOptEx)
        if (resp.error) {
            setFeedback("Something went wrong! " + resp.error.message);
            return
        }
        setOriginalOptEx(newOptEx);
        setFeedback("Saved!");
    }

    function handleReset() {
        setNewOptEx(originalOptEx);
        setFeedback("");
    }

    return <Accordion.Item eventKey={newOptEx.name} className={"opt-ex-settings"}>
        <Accordion.Header>{newOptEx.name}</Accordion.Header>
        <Accordion.Body>
            <Form>
                <Row className="mb-2">
                    <Col>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            value={newOptEx.name}
                            onChange={(e) => {
                                setNewOptEx({...newOptEx, name: e.target.value});
                                setFeedback("")
                            }}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Price (GBP)</Form.Label>
                        <Form.Control
                            type="number"
                            value={newOptEx.price ?? 0}
                            onChange={(e) => {
                                setNewOptEx({...newOptEx, price: Number(e.target.value)});
                                setFeedback("")
                            }}
                        />
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col xs={2}><Form.Label>Description</Form.Label></Col>
                    <Col><Form.Control
                        as={"textarea"}
                        value={newOptEx.description}
                        onChange={(e) => {
                            setNewOptEx({...newOptEx, description: e.target.value});
                            setFeedback("")
                        }}
                    /></Col>
                </Row>
                <Row className="mb-2">
                    <Col xs={2}><Form.Label>Disclaimer</Form.Label></Col>
                    <Col><Form.Control
                        as={"textarea"}
                        value={newOptEx.disclaimer ?? ""}
                        onChange={(e) => {
                            setNewOptEx({...newOptEx, disclaimer: e.target.value});
                            setFeedback("")
                        }}
                    /></Col>
                </Row>

                <Row>
                    <Col>
                        <InputGroup className="p-0">
                            <Button variant={"success"}
                                    disabled={newOptEx === originalOptEx}
                                    onClick={handleSave}>Save Changes</Button>
                            <Button variant={"danger"}
                                    disabled={newOptEx === originalOptEx}
                                    onClick={handleReset}>Reset</Button>
                        </InputGroup>
                        <p>{feedback}</p>
                    </Col>
                    <Col xs={4} id={"deleteButtonColumn"}>
                        <DeleteFromListButton
                            item={newOptEx}
                            tableName={"optional_extras"}
                            idRowName={"name"}
                            itemId={newOptEx.name}
                            removeAction={() => setOptionalExtras(
                                optionalExtras.filter(optEx => optEx != null && optEx.name !== newOptEx.name)
                            )}
                        />
                    </Col>
                </Row>

            </Form>
        </Accordion.Body>
    </Accordion.Item>
}

export function useGetOptionalExtras() {
    const [optionalExtras, setOptionalExtras] = useState<(OptEx | null)[]>([null]);
    const supabase = createClient();
    useEffect(() => {
        async function fetch() {
            const resp = await supabase.from("optional_extras").select("*")
            setOptionalExtras(resp.data!)
        }
        fetch().then()
    }, [])
    return optionalExtras;
}