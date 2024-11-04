'use client'
import Image from "next/image";
import MailForm from "./components/MailForm";
import SmartMailer from './components/Frontend/SmartMailer';



export default function Home() {
  
  return (
    <div>
      <h1>Welcome to the Smart Mailer</h1>
  {/*     <MailForm />  */}
      <SmartMailer />
    </div>
  );
}