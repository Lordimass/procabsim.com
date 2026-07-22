import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import {useGetSimulators} from "@/components/Booking/FormSections/Section1";
import {Simulator, SimulatorOptionalExtra, SupabaseImage} from "@/lib/types/types";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {useEffect, useRef, useState} from "react";
import InputGroup from "react-bootstrap/InputGroup";
import {images} from "next/dist/build/webpack/config/blocks/images";
import {createClient} from "@/lib/supabase/client";
import {DeleteFromListButton} from "@/app/admin/settings/page";
import {getSimulators} from "@/lib/cache";

export default function SimulatorSettings() {
    const sims = useGetSimulators();
    const optExts = useGetOptionalExtras()
    const [simulators, setSimulators] = useState<(Simulator | null)[]>(sims);
    useEffect(() => {
        setSimulators(sims)
    }, [sims]);
    const [newSimulatorId, setNewSimulatorId] = useState("");

    return <><hr/><h2>Simulators</h2><hr/>
        <p>
            Create and modify the simulators that can be booked on the bookings page. Note that this does not create
            new simulator overview pages on the site header. Those must be created manually.
        </p>
        <Accordion className={"mb-2"}>{
            simulators.map(
                simulator => simulator ? <SimulatorComponent
                    simulator={simulator}
                    key={simulator.sim.id}
                    simulators={simulators} setSimulators={setSimulators}
                    optExts={optExts}
                /> : null)
        }</Accordion>
        <InputGroup>
            <Button disabled={newSimulatorId === ""} onClick={()=>{setSimulators([...simulators, {
                sim: {
                    id: newSimulatorId,
                    name: "",
                    price: 0,
                    active: false,
                    created_at: (new Date()).toISOString(),
                    description: "",
                    accessibility_details: ""
                },
                extras: [],
                images: []
            }])
            setNewSimulatorId("")
            }}>Create New</Button>
            <Form.Control value={newSimulatorId} placeholder={"new_simulator_id"} onChange={(e)=>{
                setNewSimulatorId(e.target.value);
            }}/>
        </InputGroup>

    </>
}

function SimulatorComponent({simulator, simulators, setSimulators, optExts}: {
    simulator: Simulator,
    simulators: (Simulator | null)[],
    setSimulators: (sim: (Simulator | null)[]) => void
    optExts: (SimulatorOptionalExtra | null)[]
}) {
    const [originalSimulator, setOriginalSimulator] = useState<Simulator>(simulator);
    const [newSimulator, setNewSimulator] = useState<Simulator>(originalSimulator);
    const [feedback, setFeedback] = useState("");

    async function handleSave() {
        const supabase = createClient();
        const simulatorUpdateResp = await supabase
            .from("simulators")
            .upsert(newSimulator.sim)
            .eq("id", newSimulator.sim.id);
        if (simulatorUpdateResp.error) {
            console.warn("Simulator upsert error: ", simulatorUpdateResp.error);
            setFeedback(`Something went wrong! ${simulatorUpdateResp}`);
            return;
        }

        const extraNamesToDelete: string[] = []
        originalSimulator.extras.forEach(e => {
            const stillExists = newSimulator.extras.some(newExtra => newExtra.name === e.name)
            if (!stillExists) {extraNamesToDelete.push(e.name)}
        })
        const simulatorExtrasDeleteResponse = await supabase
            .from("simulator_extras")
            .delete()
            .in("extra_name", extraNamesToDelete)
        if (simulatorExtrasDeleteResponse.error) {
            console.warn("Simulator extras deletion error: ", simulatorExtrasDeleteResponse.error);
            setFeedback(`Something went wrong! ${simulatorExtrasDeleteResponse.error.message}`);
            return;
        }

        const simulatorExtrasUpsertResponse = await supabase
            .from("simulator_extras")
            .upsert((newSimulator.extras ?? []).map(e => {return {
                simulator_id: newSimulator.sim.id,
                extra_name: e.name
            }}))
            .eq("id", newSimulator.sim.id);
        if (simulatorExtrasUpsertResponse.error) {
            console.warn("Simulator image upsert error: ", simulatorExtrasUpsertResponse.error);
            setFeedback(`Something went wrong! ${simulatorExtrasUpsertResponse.error.message}`);
            return;
        }

        const imageIdsToDelete: string[] = [];
        (originalSimulator.images ?? []).forEach(image => {
            const stillExists = (newSimulator.images ?? []).some(newImage => newImage.id === image.id)
            if (!stillExists) imageIdsToDelete.push(image.id)
        })
        const simulatorImagesDeleteResp = await supabase
            .from("simulator_images")
            .delete()
            .in("image_id", imageIdsToDelete)
        if (simulatorImagesDeleteResp.error) {
            console.warn("Simulator image deletion error: ", simulatorImagesDeleteResp.error);
            setFeedback(`Something went wrong! ${simulatorImagesDeleteResp.error.message}`);
            return;
        }

        const simulatorImagesUpdateResp = await supabase
            .from("simulator_images")
            .upsert((newSimulator.images ?? []).map((img, i) => {return {
                alt: img.alt,
                image_id: img.id,
                simulator_id: newSimulator.sim.id,
                display_order: i
            }}))
            .eq("id", newSimulator.sim.id);
        if (simulatorImagesUpdateResp.error) {
            console.warn("Simulator image upsert error: ", simulatorImagesUpdateResp.error);
            setFeedback(`Something went wrong! ${simulatorImagesUpdateResp.error.message}`);
            return;
        }
        setOriginalSimulator(newSimulator);
        setFeedback("Saved!");

    }

    function handleReset() {
        setNewSimulator(originalSimulator);
        setFeedback("");
    }

    return <Accordion.Item eventKey={newSimulator.sim.id} className={"simulator-settings"}>
        <Accordion.Header><code>&lt;</code>{newSimulator.sim.name}<code>&gt; [ID: {newSimulator.sim.id}]</code></Accordion.Header>
        <Accordion.Body>
            <Form>
                <Row className="mb-2">
                    <Col>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            value={newSimulator.sim.name}
                            onChange={(e) => {
                                setNewSimulator({...newSimulator, sim: {...newSimulator.sim, name: e.target.value}});
                                setFeedback("")
                            }}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Price (GBP)</Form.Label>
                        <Form.Control
                            type="number"
                            value={newSimulator.sim.price}
                            onChange={(e) => {
                                setNewSimulator({...newSimulator, sim: {...newSimulator.sim, price: Number(e.target.value)}});
                                setFeedback("")
                            }}
                        />
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col xs={2}><Form.Label>Active</Form.Label></Col>
                    <Col><Form.Check
                        checked={newSimulator.sim.active}
                        onChange={(e) => {
                            setNewSimulator({...newSimulator, sim: {...newSimulator.sim, active: e.target.checked}});
                            setFeedback("")
                        }}
                    /></Col>
                </Row>
                <Row className="mb-2">
                    <Col xs={2}><Form.Label>Description</Form.Label></Col>
                    <Col><Form.Control
                        as={"textarea"}
                        value={newSimulator.sim.description}
                        onChange={(e) => {
                            setNewSimulator({...newSimulator, sim: {...newSimulator.sim, description: e.target.value}});
                            setFeedback("")
                        }}
                    /></Col>
                </Row>
                <Row className="mb-2">
                    <Col xs={2}><Form.Label>Accessibility Details</Form.Label></Col>
                    <Col><Form.Control
                        as={"textarea"}
                        value={newSimulator.sim.accessibility_details}
                        onChange={(e) => {
                            setNewSimulator({...newSimulator, sim: {...newSimulator.sim, accessibility_details: e.target.value}});
                            setFeedback("")
                        }}
                    /></Col>
                </Row>
                <h3>Optional Extras</h3>
                <hr/>
                <p>Enable all optional extras which should be available to apply to bookings on this simulator.</p>
                <div className="simulator-settings-optexts">
                    {optExts.map(optEx => {return optEx ? <Form.Check
                        type="switch"
                        key={optEx.name}
                        label={optEx.name}
                        checked={newSimulator.extras.some(e => e.name === optEx.name)}
                        onChange={(e) => {
                            if (e.target.checked) setNewSimulator({...newSimulator, extras: [...newSimulator.extras, optEx]})
                            else {setNewSimulator({
                                ...newSimulator,
                                extras: newSimulator.extras.filter(e => e.name !== optEx.name)
                            })}
                            setFeedback("")
                        }}
                    /> : null})}
                </div>
                <h3>Images</h3>
                <hr/>
                <p>
                    The ID field here is the ID of the storage object in Supabase.
                </p>
                {(newSimulator.images ?? []).map((img, i) => <Row key={i} className={"mb-2"}>
                    <Col xs={1}><b>{i}</b></Col>
                    <Col>
                        <Row>
                            <Col xs={1}><Form.Label>ID</Form.Label></Col>
                            <Col><InputGroup>
                                <Form.Control
                                    value={img.id}
                                    onChange={(e) => {
                                        setNewSimulator({...newSimulator, images: [
                                                ...(newSimulator.images ?? []).slice(0, i),
                                                {...(newSimulator.images ?? [])[i], id: e.target.value},
                                                ...(newSimulator.images ?? []).slice(i+1)]});
                                        setFeedback("")
                                    }}/>
                                <Button onClick={() => {
                                    setNewSimulator({...newSimulator, images: [
                                            ...(newSimulator.images ?? []).slice(0, i),
                                            ...(newSimulator.images ?? []).slice(i+1)]});
                                    setFeedback("")
                                }}>X</Button>
                            </InputGroup></Col>
                        </Row>
                        <Row>
                            <Col xs={1}><Form.Label>Alt</Form.Label></Col>
                            <Col>
                                <Form.Control
                                    value={img.alt}
                                    onChange={(e) => {
                                        setNewSimulator({...newSimulator, images: [
                                                ...(newSimulator.images ?? []).slice(0, i),
                                                {...(newSimulator.images ?? [])[i], alt: e.target.value},
                                                ...(newSimulator.images ?? []).slice(i+1)]});
                                        setFeedback("")
                                    }}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>)}
                <Row className="m-0 mb-2">
                    <Button
                        variant={"outline-primary"}
                        onClick={() => {
                            setNewSimulator({...newSimulator, images: [
                                    ...(newSimulator.images ?? []),
                                    {url: "", alt: "", id: ""}
                                ]})
                            setFeedback("")
                        }}
                    >Add Image</Button>
                </Row>

                <Row>
                    <Col>
                        <InputGroup className="p-0">
                            <Button variant={"success"}
                                    disabled={newSimulator === originalSimulator}
                                    onClick={handleSave}>Save Changes</Button>
                            <Button variant={"danger"}
                                    disabled={newSimulator === originalSimulator}
                                    onClick={handleReset}>Reset</Button>
                        </InputGroup>
                        <p>{feedback}</p>
                    </Col>
                    <Col xs={4} id={"deleteButtonColumn"}>
                        <DeleteFromListButton
                            item={newSimulator}
                            tableName={"simulators"}
                            itemId={newSimulator.sim.id}
                            removeAction={() => setSimulators(
                                simulators.filter(sim => sim != null && sim.sim.id !== newSimulator.sim.id)
                            )}
                        />
                    </Col>
                </Row>

            </Form>
        </Accordion.Body>
    </Accordion.Item>
}

export function useGetOptionalExtras() {
    const [optionalExtras, setOptionalExtras] = useState<(SimulatorOptionalExtra | null)[]>([null]);
    useEffect(() => {
        async function fetch() {
            const supabase = createClient();
            const resp = await supabase
                .from("optional_extras")
                .select("*")
            if (resp.error) {
                console.error(resp.error);
            } else {
                setOptionalExtras(resp.data)
            }
        }
        fetch().then()
    }, [])
    return optionalExtras;
}