"use client";

import { useEffect, useRef, useState } from "react";

const RedactBlock = ({ truth }: { truth: string }) => {
  const [text, setText] = useState("\u00A0".repeat(truth.length * 2));
  const [revealed, setRevealed] = useState(false);
  const intervalRef = useRef<any>(null);

  const onEnter = () => {
    setRevealed(true);
    setText("");
    clearInterval(intervalRef.current);
    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i <= truth.length) {
        setText(truth.slice(0, i));
        i++;
      } else {
        clearInterval(intervalRef.current);
      }
    }, 35);
  };

  const onLeave = () => {
    clearInterval(intervalRef.current);
    setRevealed(false);
    setText("\u00A0".repeat(truth.length * 2));
  };

  return (
    <span 
      className={`redact ${revealed ? 'revealed' : ''}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      dangerouslySetInnerHTML={{ __html: text || "&nbsp;&nbsp;&nbsp;&nbsp;" }}
    />
  );
};

export function Intro() {
  return (
    <section className="intro-section">
      <div className="eyebrow"><span className="num">CH 01 //</span> The premise</div>

      <p className="intro-sub" id="heroSub">
        We don't take money from colleges. We don't run sponsored "rankings."
        We buy the prospectus, <span className="hl">visit the actual campus</span>,
        talk to the actual students, pull the actual NIRF data —
        and publish what we find. Even when it's ugly.
        <br/><br/>
        Now investigating: <RedactBlock truth="VNR VJIET" />,
        <RedactBlock truth="CBIT" />,
        and <RedactBlock truth="[redacted pending legal]" />.
        Drop in Friday.
      </p>



      <div className="intro-cta">
        <a href="#investigations" className="btn btn-primary" data-hover="true" data-magnetic="true">READ THE FILES →</a>
        <a href="#submit" className="btn btn-secondary" data-hover="true" data-magnetic="true">SUBMIT A TIP 🗲</a>
      </div>
    </section>
  );
}
