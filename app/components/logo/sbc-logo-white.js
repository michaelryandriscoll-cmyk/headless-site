import Image from "next/image";

const LogoWhite = () => (
  <Image
    src="/logo/sbc-logo-white.png"
    alt="Small Business Capital"
    width={180}
    height={50}
    style={{ objectFit: "contain" }}
    priority
  />
);

export default LogoWhite;