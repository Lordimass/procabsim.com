import {Dispatch, RefObject, SetStateAction, useState} from "react";
import Button from "react-bootstrap/esm/Button";
import {ButtonProps} from "react-bootstrap/cjs";

export function ConfirmationButton(
    {
        onConfirmed,
        content,
        confirmationContent,
        confirmationVariant = "outline-danger",
        setConfirmationRef,
        ...props
    }: {
        onConfirmed?: (event: any) => void
        content: React.ReactNode
        confirmationContent: React.ReactNode
        confirmationVariant?: ButtonProps["variant"]
        setConfirmationRef?: RefObject<Dispatch<SetStateAction<boolean>>>
    } & ButtonProps) {
    const [confirmation, setConfirmation] = useState(false);

    async function handleConfirmation() {
        if (!confirmation) {
            window.setTimeout(() => {
                setConfirmation(true);
            }, 250)
            return
        }
        if (onConfirmed) onConfirmed(confirmation);
    }

    return <Button
        {...props}
        variant={confirmation ? props.variant : confirmationVariant}
        onClick={handleConfirmation}
    >
        {confirmation ?  confirmationContent : content}
    </Button>
}