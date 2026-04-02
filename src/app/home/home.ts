import { Component } from '@angular/core';
import { Projects } from '../projects/projects';
import { Contact } from '../contact/contact';
import { Experience } from '../experience/experience';
import { TechStack } from '../tech-stack/tech-stack';
import { AboutMe } from '../about-me/about-me';

@Component({
  selector: 'app-home',
  imports: [AboutMe, TechStack, Experience, Contact, Projects ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
