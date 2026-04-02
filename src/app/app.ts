import { Component, signal } from '@angular/core';
import { AboutMe } from "./about-me/about-me";
import { TechStack } from "./tech-stack/tech-stack";
import { Experience } from "./experience/experience";
import { Contact } from "./contact/contact";
import { Projects } from './projects/projects';

@Component({
  selector: 'app-root',
  imports: [AboutMe, TechStack, Experience, Contact, Projects],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('web-portfolio');
}
