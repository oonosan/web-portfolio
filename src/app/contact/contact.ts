import { Component } from '@angular/core';

@Component({
  selector: 'contact',
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  protected readonly links = [
    { label: 'Email', href: 'mailto:karen.ono@example.com' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/karen-ono/' },
    { label: 'GitHub', href: 'https://github.com/oonosan' },
  ];
}
