// import Data from '../../../utils/thirteen.json'

'use client'

// import One from '../../../utils/selecteddata/1.json'
// import Two from '../../../utils/selecteddata/2.json'
import Two from '../../../utils/selecteddata/mobile2.json';


// import { useMemo } from 'react'
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Star } from "lucide-react";
import {TOTALSTARS} from '../../../utils/values.js'
import Chart from './chart'


import { useSearchParams } from 'next/navigation'
type VersionProps = {
  id: string
  fileName?: string
}


// The `params` object is passed as a prop to the component.
export default function Version({ id, fileName }: VersionProps) {
  const numericId = Number(id)

  console.log("Numeric ID:", numericId)
  console.log("fileName:", fileName)

  // Example: load JSON depending on id
  // const data = useMemo(() => {
  //   // pick One or Two or something dynamic
  //   return numericId === 1 ? require('../../../utils/selecteddata/mobile2.json') : require('../../../utils/selecteddata/mobile2.json')
  // }, [numericId])

  const data = Two

  const selectedDialogue = data.Dialogue.find((d: unknown) => d.Id === numericId)

  if (!selectedDialogue) {
    return <div className="p-6">Dialogue not found for id {id}</div>
  }


  
  
  console.log("selectedDialogue", selectedDialogue)

  // Handle case where no data is found for the ID.
  if (!selectedDialogue) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Dialogue Not Found</h1>
        <p>The dialogue with ID &quot;{fileName}&quot; does not exist.</p>
      </div>
    );
  }

  // Create a new array with only the part before the first hyphen
  // ErrorsCompound extract

    function getBeforeDelimiter(data, delimiter = " - ") {
      return data.map(item => item.split(delimiter)[0]);
      }

    const beforeHyphen = getBeforeDelimiter(selectedDialogue.ErrorsCompound, " - ");

    console.log("beforeHyphen", beforeHyphen);

  // check match errors
  
  const highlightText = (text, errors) => {
  if (!errors || errors.length === 0) return text;

  const escapedErrors = errors.map(error =>
    error.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").trim()
  );
  const regex = new RegExp(`(${escapedErrors.join("|")})`, "gi");

  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-red-200">
        {part}
      </span>
    ) : (
      part
    )
  );
};


// end error match


  // truncate transcript

  function getTruncatedTranscript(transcript) {
    if (!transcript) return "";
    const words = transcript.split(" ");
    const truncated = words.slice(0, 7).join(" ");
    return truncated + "...";
  }

  // count stars

    const renderStarsDialogue = (count) => {
      
      return (
        <span className="inline-flex items-baseline">
          {[...Array(TOTALSTARS)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < count ? "text-black" : "text-black"}
              fill={i < count ? "black" : "white"} // fills star instead of outline
            />
          ))}
        </span>
      );
    };

  // New component for the Learn More buttons
  function LearnMoreButtons({ learnMoreData }) {
    const chatGPTBaseUrl = "https://chat.openai.com/";

    return (
      <div className="flex flex-wrap gap-2 pt-2">
        {learnMoreData.map((item, index) => {
          // Use item.Topic and item.Prompt directly
          const encodedPrompt = encodeURIComponent(item.Prompt);
          const chatGPTUrl = `${chatGPTBaseUrl}?q=${encodedPrompt}`;

          return (
            <Button
              key={index}
              asChild
              variant="outline"
            >
              <a href={chatGPTUrl} target="_blank" rel="noopener noreferrer">
                {item.Topic}
              </a>
            </Button>
          );
        })}
      </div>
    );
  }

  // If found, display all the values.
  return (
    <div className="p-6">
      <div className="pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/mobileone">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>&ldquo;{getTruncatedTranscript(selectedDialogue.Transcript)}&ldquo;</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

        <div className="">
            

        <p className="font-bold pb-2">
          Assessment{" "}
          <span className="inline-flex items-baseline">
            {selectedDialogue.ResponseRating > 0 &&
              renderStarsDialogue(selectedDialogue.ResponseRating)}
          </span>
        </p>


        <div className="pb-2">
          {/* <div className="pb-2">{selectedDialogue.SegmentedSynopsis}</div> */}
          <div className="">{selectedDialogue.ResponseAssess}</div>
        </div>
              <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>


        <p className="font-bold pb-2">Metrics</p>
        <div className=""><Chart /></div>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>


        <p className="font-bold pb-2">Follow Up Questions</p>
        <div className="">
          <ul className="list-disc pl-5">
            {selectedDialogue.QuestionsFollowUp?.map((question, index) => (
              <li key={index} className="">
                &ldquo;{question}&rdquo;
              </li>
            ))}
          </ul>
        </div>


      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>



       <p className="font-bold pb-2">Potential Errors</p>
        <div className="">
          {selectedDialogue.ErrorsCompound && selectedDialogue.ErrorsCompound.length > 0 ? (
            <ul className="list-none">
              {selectedDialogue.ErrorsCompound.map((error, index) => {
                const [claim, explanation] = error.split(" - ");
                return (
                  <li key={index} className="">
                    <span className="font-semibold">&ldquo;{claim.trim()}&ldquo;</span>
                    {explanation ? ` - ${explanation.trim()}` : ""}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No potential errors found</p>
          )}
        </div>

      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>


        {/* --- Learn More Section --- */}
          <p className="font-bold pb-2">Explore Topics</p>
          {/* Render the new component only if there is "LearnMore" data */}
          <div className="">{selectedDialogue.LearnMore && Array.isArray(selectedDialogue.LearnMore) && selectedDialogue.LearnMore.length > 0 && (
            <LearnMoreButtons learnMoreData={selectedDialogue.LearnMore} />
          )}</div>

      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        <p className="font-bold pb-2">Entire Transcript</p>

        <div
          className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 rounded-xl shadow-sm text-sm sm:text-base ${
            selectedDialogue.Speaker === "Allison Nathan"
              ? 'bg-blue-500 text-white rounded-bl-sm'
              : 'bg-gray-200 text-gray-800 rounded-br-sm'
          }`}
        >
          <div className="font-semibold mb-1">{selectedDialogue.Speaker}</div>
          <p>
            {highlightText(selectedDialogue.Transcript, beforeHyphen)}
          </p>
        </div>
      </div>
    </div>
  );
}