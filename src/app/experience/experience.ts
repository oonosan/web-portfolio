import { Component } from '@angular/core';

@Component({
  selector: 'experience',
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience {
  experiences = [
    {
      company: 'Endava: Finthrive',
      duration: 'Dec 2024 - Oct 2025',
      role: 'Full Stack Developer | Healthcare',
      description: 'As a Full Stack Developer, I play a role in the design, development and optimization of web applications, with a strong focus on frontend technologies.',
      responsabilities: [
        'Technical Research & Planning: Conducting epic research, spikes and writing user stories to drive well-informed technical decisions.',
        'Frontend Expertise & Problem-Solving: Providing technical advice, primarily in frontend development, and assisting the team in solving programming challenges.',
        'Code Quality & Best Practices: Performing code reviews, offering constructive feedback, and implementing refactors to enhance code maintainability and performance.',
        'Architecture & Design: Collaborating on the design and architecture of frontend applications, ensuring scalability, modularity, and efficiency.',
        'Cross-Team Collaboration: Working closely with UX/UI designers and backend developers to integrate seamless, intuitive, and high-performing interfaces.',
        'Testing & Reliability: Implementing unit tests and ensuring robust testing practices to maintain application stability.',
        'Microservices & Scalable Solutions: Developing and maintaining applications within microservices architectures, leveraging best practices for distributed systems.',
      ],
      technologies: [
        'NET C#', 'gRPC', 'CosmosDB', 'MediatR', 'CQRS', 'SQL Service', 'xUnit', 'Entity Framework',
        'Angular', 'RxJs', 'NgRx', 'HTML', 'CSS', 'SCSS/SASS', 'Bootstrap', 'Signals', 'Jasmine/Karma',
        'Git', 'Azure DevOps', 'Azure CosmosDB'],
    },
    {
      company: 'Endava: Kinetic Advantage',
      duration: 'Mar 2024 - Nov 2024',
      role: 'Full Stack Developer | Financial Services',
      description: 'Spearheaded the migration to Angular 17, delivering UX modernization and interface optimization within a fast-paced Scrum environment.',
      responsabilities: [
        'Feature Development: Collaborating with stakeholders to define requirements and deliver high-quality features within tight deadlines.',
        'Performance Optimization: Identifying and resolving performance bottlenecks, improving application responsiveness and user experience.',
        'Code Review & Quality Assurance: Conducting thorough code reviews to maintain code quality and adherence to architectural standards.',
      ],
      technologies: [
        'Angular', 'Jest', 'Azure Pipelines', 'Git'
      ]
    }
  ];
}
