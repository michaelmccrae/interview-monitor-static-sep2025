'use client';

import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { TRANSCRIPTLIMIT, TOTALSTARS } from '../../utils/values.js';

// ---- Types ----
interface LearnMoreItem {
  Topic: string;
  Prompt: string;
}

interface DialogueEntry {
  Id: number;
  SegmentedSynopsis: string;
  Speaker: string;
  SpeakerNumber: number;
  Transcript: string;
  TranscriptCount: number;
  ResponseRating?: number | null;
  ResponseAssess?: string | null;
  ResponseAssessGood?: string;
  ResponseAssessBad?: string;
  ErrorsCompound: string[];
  MessagesCompound?: string[];
  QuestionsFollowUp: string[];
  LearnMore: LearnMoreItem[]; // in JSON, sometimes objects, sometimes []
}

interface SelectedData {
  SynopsisOverall: string;
  Speakers: string[];
  Dialogue: DialogueEntry[];
  FileName?: string; // your JSON didn’t have FileName, so optional
}

interface AppProps {
  selectedData: SelectedData;
}

// ---- Component ----
const App: React.FC<AppProps> = ({ selectedData }) => {
  const transcriptData = selectedData.Dialogue;
  const fileName = selectedData.FileName ?? 'unknown';

  const [visibleCount, setVisibleCount] = useState(0);

  // Reveal transcript items one by one without a loop/interval
  useEffect(() => {
    if (!transcriptData || transcriptData.length === 0) return;

    let index = 0;

    const revealNext = () => {
      setVisibleCount((prev) => prev + 1);
      index++;

      if (index < transcriptData.length) {
        const delay = 800 + index * 100;
        setTimeout(revealNext, delay);
      }
    };

    setTimeout(revealNext, 400);
  }, [transcriptData]);

  const renderStarsDialogue = (count: number) => (
    <span className="inline-flex items-baseline">
      {[...Array(TOTALSTARS)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < count ? 'text-black' : 'text-black'}
          fill={i < count ? 'black' : 'white'}
        />
      ))}
    </span>
  );

  function getBeforeDelimiter(errors: string[] = [], delimiter = ' - ') {
    if (!Array.isArray(errors) || errors.length === 0) return [];
    return errors.map((item) =>
      item.split(delimiter)[0].trim().replace(/^"|"$/g, '')
    );
  }

  const highlightText = (text: string, errors: string[]) => {
    if (!errors || errors.length === 0) return text;
    const escapedErrors = errors.map((error) =>
      error.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim()
    );
    const regex = new RegExp(`(${escapedErrors.join('|')})`, 'gi');

    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-blue-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col items-left p-4 min-h-screen">
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl space-y-4">
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

        {transcriptData.slice(0, visibleCount).map((message, index) => {
          const beforeHyphen = getBeforeDelimiter(message.MessagesCompound ?? []);
          const isLinked = message.TranscriptCount >= TRANSCRIPTLIMIT;

          const content = (
            <div
              className={`flex ${
                isLinked ? 'cursor-pointer hover:opacity-60 transition' : ''
              } ${message.Id % 2 === 0 ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 rounded-xl shadow-sm text-sm sm:text-base
                ${
                  {
                    1: 'bg-blue-300 rounded-bl-sm',
                    2: 'bg-stone-300 rounded-br-sm',
                    3: 'bg-purple-300 rounded-bl-sm',
                    4: 'bg-orange-300 rounded-br-sm',
                    5: 'bg-red-300 rounded-bl-sm',
                  }[message.SpeakerNumber] || 'bg-gray-200 text-gray-800'
                }`}
              >
                <div className="font-semibold mb-1">
                  <span>
                    <span
                      style={{
                        verticalAlign: 'middle',
                        textDecoration: isLinked ? 'underline' : 'none',
                      }}
                    >
                      {message.Speaker}
                    </span>
                    {isLinked && message.ResponseRating && message.ResponseRating > 0 && (
                      <span
                        style={{
                          display: 'inline-block',
                          verticalAlign: 'middle',
                          marginLeft: '4px',
                        }}
                      >
                        {renderStarsDialogue(message.ResponseRating)}
                      </span>
                    )}
                  </span>
                </div>
                <div className="pb-2"></div>
                <p>{highlightText(message.Transcript, beforeHyphen)}</p>
              </div>
            </div>
          );

          return isLinked ? (
            <Link
              key={index}
              href={{
                pathname: `/prone/explaining/${index}`,
                query: { fileName: fileName },
              }}
              className="block"
            >
              {content}
            </Link>
          ) : (
            <div key={index}>{content}</div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
