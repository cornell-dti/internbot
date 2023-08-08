"use client";

import { HelpCircle } from "lucide-react";

const Help = ({ text }: { text: string }) => (
    <label className='text-gray-400 py-2 hover:cursor-pointer'>
        <HelpCircle className='inline-block' onClick={() => alert(text)} />
    </label>
);

export default Help;
