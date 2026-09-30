import { Component } from '@angular/core';

@Component({
  selector: 'impact',
  templateUrl: './impact.html',
  styleUrl: './impact.css',
})
export class Impact {
  protected readonly highlights = [
    {
      label: 'Solution concepts',
      text: 'Shaped AI and data-platform solution concepts across telecom, media, sports and ad-tech opportunities.',
    },
    {
      label: 'Discovery to demo',
      text: 'Led the discovery-to-demo path for a family-safety product: personas, design system, user testing, and a handoff package for engineering.',
    },
    {
      label: 'Leadership visibility',
      text: 'Presented research and prototype work to senior lab leadership, including contributions to model-routing and evaluation proposals.',
    },
  ];
}
