import Image from "next/image";
import "./Footer.scss";

export default function Footer() {
  return (
    <div className="footer">
      <p className="footer-policy-links">
        <a href={"/privacy"}>Privacy Policy</a>
        <span className="policy-separator" aria-hidden="true">/</span>
        <a href={"/cancellations"}>Cancellation Policy</a>
      </p>
      <br />
      <p className="additional-links">
        <a href="https://www.instagram.com/procabsim" target="_blank">
          <Image src="/instagram.svg" alt="Facebook Logo" width={20} height={20}/>
        </a>{" "}
        <span className="policy-separator" aria-hidden="true">/</span>
        <a href="https://www.youtube.com/@ProCabSim" target="_blank">
          <Image src="/youtube.svg" alt="Facebook Logo" width={20} height={20}/>
        </a>{" "}
        <span className="policy-separator" aria-hidden="true">/</span>
        <a href="https://www.facebook.com/procabsim/" target="_blank">
          <Image src="/facebook.svg" alt="Facebook Logo" width={20} height={20}/>
        </a>{" "}
        <br />
      </p>
      <br />
      <p>
        Website made by <a href="https://lordimass.net">Sam Knight</a> <br />
      </p>
      <br />
      <p className="footer-company-information">
        <Copyright />
        <span className="policy-separator" aria-hidden="true">/</span>
        <span>Company No. XXXXXXXX</span>
        <span className="policy-separator" aria-hidden="true">/</span>
        <span>Registered in England & Wales [[ADDRESS HERE]]</span>
      </p>
    </div>
  );
}

function Copyright() {
  return (
    <>
      {"\u00A9"} {/* <- Copyright character */} 2026{" "}
      <a href="https://lordimass.net">Sam Knight</a>. Licensed exclusively to ProCab Simulators
    </>
  );
}
