"use client"

import { useState } from "react";


const Accordion = ({question, answer}) => {

    const [show, setShow] = useState(false);

    return(
        <>
        <div className="rounded-none border border-t-0 border-l-0 border-r-0 border-neutral-200">
          <h2 className="mb-0" id="flush-headingOne">
            <button
              className="group relative flex w-full items-center rounded-none border-0 py-4 px-5 text-left text-base text-neutral-700 font-semibold transition hover:z-[2] focus:z-[3] focus:outline-none"
              onClick={()=>setShow(!show)}
            >
              {question}
              <span className={show?"ml-auto h-5 w-5 shrink-0 rotate-[-180deg] transition-transform duration-200 ease-in-out motion-reduce:transition-none":"ml-auto h-5 w-5 shrink-0 rotate-0 transition-transform duration-200 ease-in-out motion-reduce:transition-none"}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </span>
            </button>
          </h2>
          <div
            className={show?"!visible border-0":"!visible hidden border-0"}
          >
            <div className="py-4 px-5 text-neutral-700">
              {answer}
            </div>
          </div>
        </div>
        </>
    )
}

export default Accordion;