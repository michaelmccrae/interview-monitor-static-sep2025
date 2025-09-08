'use client'

import Two from '../../../utils/selecteddata/prone.json';
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
import { TOTALSTARS } from '../../../utils/values.js'
// import Chart from './chart'

type VersionProps = {
  id: string
  fileName?: string
}

export interface LearnMoreItem {
  Topic: string
  Prompt: string
}

export interface DialogueItem {
  Id: number
  SegmentedSynopsis: string
  Speaker: string
  SpeakerNumber: number
  Transcript: string
  TranscriptCount: number
  ResponseRating: number | null
  ResponseAssessGood: string | null
  ResponseAssessBad: string | null
  ErrorsCompound: string[]
  QuestionsFollowUp: string[]
  LearnMore: LearnMoreItem[]
}

export interface TranscriptData {
  SynopsisOverall: string
  Speakers: string[]
  Dialogue: DialogueItem[]
}

export default function Version({ id, fileName }: VersionProps) {
  const numericId = Number(id)

  console.log("Numeric ID:", numericId)
  console.log("fileName:", fileName)

  // For now always using mobile2.json
  // Later: pick dataset dynamically with fileName if needed
  const data = Two as TranscriptData

  const selectedDialogue = data.Dialogue.find((d) => d.Id === numericId)

  if (!selectedDialogue) {
    return <div className="p-6">Dialogue not found for id {id}</div>
  }

  // --- Error highlighting ---
  function getBeforeDelimiter(data: string[], delimiter = " - ") {
    return data.map(item => item.split(delimiter)[0]);
  }
  const beforeHyphen = getBeforeDelimiter(selectedDialogue.ErrorsCompound, " - ");

  const highlightText = (text: string, errors: string[]) => {
    if (!errors?.length) return text;
    const escapedErrors = errors.map(error =>
      error.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").trim()
    );
    const regex = new RegExp(`(${escapedErrors.join("|")})`, "gi");
    return text.split(regex).map((part, index) =>
      part.match(regex) ? (
        <span key={index} className="bg-red-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // --- Transcript truncate ---
  function getTruncatedTranscript(transcript: string) {
    if (!transcript) return "";
    const words = transcript.split(" ");
    const truncated = words.slice(0, 7).join(" ");
    return truncated + "...";
  }

  // --- Stars ---
  const renderStarsDialogue = (count: number) => {
    return (
      <span className="inline-flex items-baseline">
        {[...Array(TOTALSTARS)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className="text-black"
            fill={i < count ? "black" : "white"}
          />
        ))}
      </span>
    );
  };

  // --- Learn More buttons ---
  function LearnMoreButtons({ learnMoreData }: { learnMoreData: LearnMoreItem[] }) {
    const chatGPTBaseUrl = "https://chat.openai.com/";

    return (
      <div className="flex flex-wrap gap-2 pt-2">
        {learnMoreData.map((item, index) => {
          const encodedPrompt = encodeURIComponent(item.Prompt);
          const chatGPTUrl = `${chatGPTBaseUrl}?q=${encodedPrompt}`;

          return (
            <Button key={index} asChild variant="outline">
              <a href={chatGPTUrl} target="_blank" rel="noopener noreferrer">
                {item.Topic}
              </a>
            </Button>
          );
        })}
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="p-6">
      <div className="pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/prone">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                &ldquo;{getTruncatedTranscript(selectedDialogue.Transcript)}&ldquo;
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
       

         <p className="font-bold pb-2">Potential Errors</p>
        {selectedDialogue.ErrorsCompound?.length > 0 ? (
          <ul className="list-none">
            {selectedDialogue.ErrorsCompound.map((error, index) => {
              const [claim, explanation] = error.split(" - ");
              return (
                <li key={index}>
                  <span className="font-semibold">&ldquo;{claim.trim()}&ldquo;</span>
                  {explanation ? ` - ${explanation.trim()}` : ""}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No potential errors found</p>
        )}
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

        


       
        <p className="font-bold pb-2">Entire Transcript</p>
        <div
          className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 rounded-xl shadow-sm text-sm sm:text-base ${
            selectedDialogue.Speaker === "Allison Nathan"
              ? "bg-blue-500 text-white rounded-bl-sm"
              : "bg-gray-200 text-gray-800 rounded-br-sm"
          }`}
        >
          <div className="font-semibold mb-1">{selectedDialogue.Speaker}</div>
          <p>{highlightText(selectedDialogue.Transcript, beforeHyphen)}</p>
        </div>

                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />


        
            <div>
            <p className="font-bold pb-2">Messaging</p>
            <ul className="list-disc pl-5 space-y-1 pb-2">
                <li>Experienced team</li>
                <li>Well financed</li>
                <li>High insider ownership</li>
                <li className="text-gray-400">Safe jurisdiction</li>
                <li className="text-gray-400">Good infrastructure</li>
            </ul>
            </div>


      </div>
    </div>
  );
}
