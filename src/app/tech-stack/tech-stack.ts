
import { Component } from '@angular/core';

@Component({
  selector: 'tech-stack',
  templateUrl: './tech-stack.html',
  styleUrl: './tech-stack.css',
  standalone: true
})
export class TechStack {
  techStacks = [
    {
      name: 'Frontend',
      technologies: ['Angular', 'RxJs', 'Typescript', 'JavaScript', 'HTML', 'CSS', 'SCSS/SASS', 'Bootstrap', 'Material UI', 'Tailwind CSS', 'NgRx', 'Signals', 'Jasmine/Karma'],
    },
    {
      name: 'Backend',
      technologies: ['NET C#', 'ASP.NET Core', 'Entity Framework Core', 'SQL Server', 'MongoDB', 'SignalR', 'RESTful APIs', 'CQRS', 'MediatR', 'xUnit', 'Moq'],
    },
    {
      name: 'DevOps & Tools',
      technologies: ['Git', 'GitHub', 'Azure DevOps', 'Azure Cosmos DB'],
    },
    {
      name: 'Development Workflow & Tools',
      technologies: ['Agile Methodologies', 'Scrum', 'Kanban', 'Jira', 'Visual Studio Code'],
    }
  ];
}
