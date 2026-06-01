import Image from "next/image";

export function LogoHeader() {
  return (
    <header className="logo-header">
      <Image className="brand-logo" src="/assets/logo-aigs-v2.png" alt="AI Growth Studio" width={882} height={256} priority />
    </header>
  );
}
