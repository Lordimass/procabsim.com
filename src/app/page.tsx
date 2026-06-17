import Image from "next/image";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
        <Image
          src="/logo.svg"
          alt="Procab Logo"
          width={740}
          height={420}
          priority
        />
    </div>
  );
}
