'use client';

import React from 'react';
import Two from '../../utils/selecteddata/prone.json';
import Dialogue from './dialogue';
import { Mic } from 'lucide-react';
import Link from "next/link"
import { Button } from "@/components/ui/button"

const Home = () => {
  return (
    <div>
      <div className="text-xl font-bold p-4 text-center">Interview Monitor</div>

      {/* Centered mic with pulsing circle */}
      <div className="flex justify-center p-4">
        <div className="relative flex items-center justify-center">
          {/* Pulsing circle */}
          <span className="absolute w-25 h-25 rounded-full bg-gray-500 opacity-75 animate-ping" />
          {/* Mic stays steady on top */}
          <Mic size={128} className="text-gray-600 relative z-10" />
        </div>
      </div>

     <div className="flex justify-center space-x-4 p-4">
      <Link href="/prone/">
        <Button>Errors</Button>
      </Link>
      <Link href="/prone/message">
        <Button>Messaging</Button>
      </Link>
    </div>

       

      <Dialogue selectedData={Two} />
    </div>
  );
};

export default Home;
