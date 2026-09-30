import { Component } from '@angular/core';

@Component({
  selector: 'what-i-do',
  templateUrl: './what-i-do.html',
  styleUrl: './what-i-do.css',
})
export class WhatIDo {
  protected readonly items = [
    {
      title: 'Frame and research',
      body: 'I turn open-ended briefs into clear problem statements. Then I run industry, competitor and technology research to understand customer pain points and to check whether the problem is already solved in the market.',
    },
    {
      title: 'Design products and flows',
      body: 'I redesign end-to-end experiences: personas, journeys, screen states, design systems and product principles. The goal is for each user type to see a materially different experience, not one dashboard with the name swapped.',
    },
    {
      title: 'Connect design to business outcomes',
      body: "I translate a client's commercial objective into a visible product moment, for example a flow that shows a household growing from one subscriber to several.",
    },
    {
      title: 'Prototype with AI-assisted workflows',
      body: 'I build executive-facing demos and clickable prototypes using AI coding and design tools. I work with engineers who build the working version, and I keep the design documentation aligned with what ships.',
    },
    {
      title: 'Test with real users',
      body: 'I plan and moderate user-testing sessions with screened participants, capture usability and product feedback, and iterate on the prototypes.',
    },
    {
      title: 'Propose solution approaches',
      body: 'I recommend architecture considerations, such as what runs on the web, natively or at the network layer. Architecture and engineering leadership then evaluate them.',
    },
    {
      title: 'Keep the work defensible',
      body: 'I use a repeatable, AI-assisted discovery process with claim auditing, so every statement in a deck or proposal traces back to evidence.',
    },
    {
      title: 'Collaborate daily',
      body: 'I sync with pre-sales and strategic sales solution leaders to refine concepts and demo direction.',
    },
  ];
}
