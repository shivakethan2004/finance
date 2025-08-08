import Image from "next/image";
import DownloadGif from "@/assets/images/gifs/download.gif";
import ScanningGif from "@/assets/images/gifs/scanning.gif";
import NotesGif from "@/assets/images/gifs/notes.gif";
import FeatureCard from "../FeatureCard/FeatureCard";

const FeatureSection = () => {
  return (
    <>
      <div className='flex flex-col items-center mt-14'>
        <h1 className='text-xl sm:text-3xl font-semibold'>
          Accounting made easy with <span className='text-blue-600'>A.I.</span>
        </h1>
        <div className='flex flex-col sm:flex-row justify-around mx-auto gap-4 py-6 my-6'>
          <FeatureCard
            image={DownloadGif}
            index={1}
            title={"Upload invoice"}
            text={
              "Upload your invoices with just a click, whether it's a paper receipt or a digital document. "
            }
          />
          <FeatureCard
            image={ScanningGif}
            index={2}
            title={"AI scans the invoice"}
            text={
              "Fiing AI effortlessly scans and extracts crucial data from your invoices."
            }
          />
          <FeatureCard
            image={NotesGif}
            index={3}
            title={"Accounting is done"}
            text={
              "Fiing automatically categorizes and records your financial transactions."
            }
          />
        </div>
      </div>
    </>
  );
};

export default FeatureSection;
