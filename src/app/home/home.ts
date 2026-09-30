import { Component, signal } from '@angular/core';
import { WhatIDo } from '../what-i-do/what-i-do';
import { Domains } from '../domains/domains';
import { Impact } from '../impact/impact';
import { Toolkit } from '../toolkit/toolkit';
import { Experience } from '../experience/experience';
import { Contact } from '../contact/contact';

@Component({
  selector: 'app-home',
  imports: [WhatIDo, Domains, Impact, Toolkit, Experience, Contact],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly menuOpen = signal(false);

  protected readonly links = [
    { label: 'What I do', href: '#what-i-do' },
    { label: 'Domains', href: '#domains' },
    { label: 'Impact', href: '#impact' },
    { label: 'Toolkit', href: '#toolkit' },
    { label: 'Background', href: '#background' },
    { label: 'Contact', href: '#contact' },
  ];

  protected readonly pipeline = [
    { step: 'Brief', note: 'Open-ended ask from sales & strategy' },
    { step: 'Problem statement', note: 'Research, competitors, pain points' },
    { step: 'Concept & flows', note: 'Personas, journeys, design system' },
    { step: 'Prototype', note: 'Executive-facing, clickable, AI-assisted' },
    { step: 'Tested', note: 'Moderated sessions with real users' },
    { step: 'Handoff', note: 'Evidence-backed package for engineering' },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
