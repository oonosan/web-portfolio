// All portfolio copy lives here so the scene and the DOM chapters stay in sync.

export type Vec3 = [number, number, number];

export type CameraPose = {
  position: Vec3;
  target: Vec3;
  fov: number;
  /** Vertical FOV on portrait screens; defaults to `fov * 1.45`. */
  portraitFov?: number;
};

export type ChapterId =
  'top' | 'what-i-do' | 'domains' | 'impact' | 'toolkit' | 'background' | 'crew' | 'contact';

export type Chapter = {
  id: ChapterId;
  nav: string;
  /** The object in the room this chapter is "about". Shown as a hint in the panel. */
  prop: string;
  camera: CameraPose;
};

export const chapters: Chapter[] = [
  {
    id: 'top',
    nav: 'Home',
    prop: 'The studio',
    camera: { position: [9.5, 8, 9.5], target: [0, 0.9, 0], fov: 32, portraitFov: 62 },
  },
  {
    id: 'what-i-do',
    nav: 'What I do',
    prop: 'The desk',
    camera: { position: [0.75, 1.75, -0.5], target: [-0.95, 1.12, -2.75], fov: 42 },
  },
  {
    id: 'domains',
    nav: 'Domains',
    prop: 'The globe by the window',
    camera: { position: [0.55, 1.65, 0.4], target: [1.55, 1.45, -2.9], fov: 44 },
  },
  {
    id: 'impact',
    nav: 'Impact',
    prop: 'The frames on the wall',
    camera: { position: [-0.35, 2.05, 0.7], target: [-1.25, 2.2, -3], fov: 40 },
  },
  {
    id: 'toolkit',
    nav: 'Toolkit',
    prop: 'The corkboard',
    camera: { position: [0.6, 1.75, -0.45], target: [-3, 1.65, -1.05], fov: 40 },
  },
  {
    id: 'background',
    nav: 'Background',
    prop: 'The bookshelf',
    camera: { position: [0.9, 1.7, 2.1], target: [-3, 1.2, 0.95], fov: 42 },
  },
  {
    id: 'crew',
    nav: 'The crew',
    prop: 'The rug',
    camera: { position: [3.9, 2.4, 3.9], target: [0.7, 0.35, 0.5], fov: 40 },
  },
  {
    id: 'contact',
    nav: 'Contact',
    prop: 'Evening at the studio',
    camera: { position: [11, 9.5, 11], target: [0, 0.8, 0], fov: 30, portraitFov: 60 },
  },
];

export const hero = {
  name: 'Karen Ono',
  role: 'AI Discovery & Prototyping Consultant',
  intro:
    'I take ambiguous business problems and early-stage ideas from sales and strategy leaders and turn them into concrete, testable solution concepts. I do this through discovery research, product and flow design, and rapid prototyping.',
};

export const pipeline = [
  { step: 'Brief', note: 'Open-ended ask from sales & strategy' },
  { step: 'Problem statement', note: 'Research, competitors, pain points' },
  { step: 'Concept & flows', note: 'Personas, journeys, design system' },
  { step: 'Prototype', note: 'Executive-facing, clickable, AI-assisted' },
  { step: 'Tested', note: 'Moderated sessions with real users' },
  { step: 'Handoff', note: 'Evidence-backed package for engineering' },
];

export const whatIDo = [
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

export const domains = [
  { name: 'Telecommunications & wireless', detail: 'Family safety, household plans' },
  { name: 'Media & entertainment', detail: '' },
  { name: 'Sports', detail: '' },
  { name: 'Advertising technology', detail: '' },
  { name: 'Enterprise data platforms', detail: '' },
];

export const impact = [
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

export const tools = [
  'Discovery research',
  'Competitive analysis',
  'Persona and journey design',
  'Design systems',
  'Rapid prototyping',
  'Moderated user testing',
  'AI-assisted development and design tools',
  'Engineering handoff',
];

export const experiences = [
  {
    company: 'Endava: Finthrive',
    duration: 'Dec 2024 - Oct 2025',
    role: 'Full Stack Developer | Healthcare',
    description:
      'As a Full Stack Developer, I play a role in the design, development and optimization of web applications, with a strong focus on frontend technologies.',
    responsibilities: [
      'Technical Research & Planning: Conducting epic research, spikes and writing user stories to drive well-informed technical decisions.',
      'Frontend Expertise & Problem-Solving: Providing technical advice, primarily in frontend development, and assisting the team in solving programming challenges.',
      'Code Quality & Best Practices: Performing code reviews, offering constructive feedback, and implementing refactors to enhance code maintainability and performance.',
      'Architecture & Design: Collaborating on the design and architecture of frontend applications, ensuring scalability, modularity, and efficiency.',
      'Cross-Team Collaboration: Working closely with UX/UI designers and backend developers to integrate seamless, intuitive, and high-performing interfaces.',
      'Testing & Reliability: Implementing unit tests and ensuring robust testing practices to maintain application stability.',
      'Microservices & Scalable Solutions: Developing and maintaining applications within microservices architectures, leveraging best practices for distributed systems.',
    ],
    technologies: [
      'NET C#',
      'gRPC',
      'CosmosDB',
      'MediatR',
      'CQRS',
      'SQL Service',
      'xUnit',
      'Entity Framework',
      'Angular',
      'RxJs',
      'NgRx',
      'HTML',
      'CSS',
      'SCSS/SASS',
      'Bootstrap',
      'Signals',
      'Jasmine/Karma',
      'Git',
      'Azure DevOps',
      'Azure CosmosDB',
    ],
  },
  {
    company: 'Endava: Kinetic Advantage',
    duration: 'Mar 2024 - Nov 2024',
    role: 'Full Stack Developer | Financial Services',
    description:
      'Spearheaded the migration to Angular 17, delivering UX modernization and interface optimization within a fast-paced Scrum environment.',
    responsibilities: [
      'Feature Development: Collaborating with stakeholders to define requirements and deliver high-quality features within tight deadlines.',
      'Performance Optimization: Identifying and resolving performance bottlenecks, improving application responsiveness and user experience.',
      'Code Review & Quality Assurance: Conducting thorough code reviews to maintain code quality and adherence to architectural standards.',
    ],
    technologies: ['Angular', 'Jest', 'Azure Pipelines', 'Git'],
  },
];

export type PetId = 'shiba' | 'calico' | 'black' | 'balinese' | 'tabby';

export const pets: Record<PetId, { name: string; breed: string; spot: string; quirk: string }> = {
  shiba: {
    name: 'Momo',
    breed: 'Shiba Inu',
    spot: 'Napping on the rug',
    quirk: 'Head of security. Mostly asleep on the job.',
  },
  calico: {
    name: 'Airi',
    breed: 'Calico',
    spot: 'On the desk, next to the monitor',
    quirk: 'Reviews every pull request by sitting on the keyboard.',
  },
  black: {
    name: 'Taka',
    breed: 'Black cat',
    spot: 'On top of the bookshelf',
    quirk: 'Watches everything from the highest shelf available.',
  },
  balinese: {
    name: 'Tabi',
    breed: 'Siamese Balinese',
    spot: 'On the cat tree by the window',
    quirk: 'In charge of bird surveillance and loud opinions.',
  },
  tabby: {
    name: 'Kiki',
    breed: 'Tabby',
    spot: 'Chasing yarn across the rug',
    quirk: 'Unit-tests every object by knocking it over.',
  },
};

export const contactLinks = [
  { label: 'Email', href: 'mailto:karen.ono@example.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/karen-ono/' },
  { label: 'GitHub', href: 'https://github.com/oonosan' },
];
