import { Component } from '@angular/core';

@Component({
  selector: 'domains',
  templateUrl: './domains.html',
  styleUrl: './domains.css',
})
export class Domains {
  protected readonly domains = [
    { name: 'Telecommunications & wireless', detail: 'Family safety, household plans' },
    { name: 'Media & entertainment', detail: '' },
    { name: 'Sports', detail: '' },
    { name: 'Advertising technology', detail: '' },
    { name: 'Enterprise data platforms', detail: '' },
  ];
}
