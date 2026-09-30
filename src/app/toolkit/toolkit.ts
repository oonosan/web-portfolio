import { Component } from '@angular/core';

@Component({
  selector: 'toolkit',
  templateUrl: './toolkit.html',
  styleUrl: './toolkit.css',
})
export class Toolkit {
  protected readonly tools = [
    'Discovery research',
    'Competitive analysis',
    'Persona and journey design',
    'Design systems',
    'Rapid prototyping',
    'Moderated user testing',
    'AI-assisted development and design tools',
    'Engineering handoff',
  ];
}
