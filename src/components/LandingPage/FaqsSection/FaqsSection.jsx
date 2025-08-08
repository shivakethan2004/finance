import Accordion from "../Accordion/Accordion";

const FaqsSection = () => {
  return (
    <>
      <>
        {/* Container for demo purpose */}
        <div className="container my-24 mx-auto md:px-6 xl:px-24">
          {/* Section: Design Block */}
          <section className="mb-32">
            <h2 className="mb-6 pl-6 text-3xl font-semibold">
              Frequently Asked Questions
            </h2>
            <div id="accordionFlushExample">
              <Accordion
                question={"Can Fiing handle both paper and digital invoices?"}
                answer={
                  "Developing cutting-edge OCR technology capable of scanning and accurately populating invoices with a 100% precision rate."
                }
              />
              <Accordion
                question={"How secure is my financial data with Fiing?"}
                answer={
                  "The security of your financial data with Fiing is paramount. We employ robust measures to safeguard your information, including encryption protocols, access controls, and regular security audits. We prioritize compliance with industry standards and regulations to ensure the highest level of data protection. Rest assured, your financial data is handled with the utmost care and security when using Fiing."
                }
              />
              <Accordion
                question={
                  "Can Fiing integrate with other accounting software we currently use?"
                }
                answer={
                  "Yes, Fiing is designed to seamlessly integrate with a variety of accounting software solutions commonly used by businesses. Our platform supports integration with popular accounting software such as Tally, Zoho, QuickBooks, FreshBooks, and many others. This integration streamlines your workflow by allowing Fiing to synchronize data with your existing accounting system, ensuring consistency and efficiency across your financial processes. If you have specific integration requirements, our team can work with you to tailor the integration to suit your needs."
                }
              />
              <Accordion
                question={"Is Fiing suitable for businesses of all sizes?"}
                answer={
                  "Yes, Fiing is designed to cater to businesses of all sizes, from small startups to large enterprises. Our flexible OCR solution can scale to meet the needs of businesses at any stage of growth. Whether you're a sole proprietor managing a small operation or a multinational corporation with complex invoicing processes, Fiing can be tailored to suit your requirements. We offer customizable features and pricing plans to accommodate businesses of varying sizes and industries. Our goal is to provide an efficient and effective OCR solution that meets the diverse needs of businesses across the spectrum."
                }
              />
            </div>
          </section>
          {/* Section: Design Block */}
        </div>
        {/* Container for demo purpose */}
      </>
    </>
  );
};
export default FaqsSection;
