-- Inserimento corsi di esempio
INSERT INTO courses (
    title,
    slug,
    description,
    category,
    level,
    language,
    price,
    duration_hours,
    ects_max,
    image_url
) VALUES 
(
    'Sviluppo Web con React e Next.js',
    'sviluppo-web-react-nextjs-2024',
    'Impara a creare applicazioni web moderne con React e Next.js. Questo corso copre i fondamenti di React, Hooks, Server Components, e le best practices per lo sviluppo di applicazioni web performanti e SEO-friendly.',
    'Sviluppo Web',
    'Intermedio',
    'Italiano',
    299.99,
    24,
    3,
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070'
),
(
    'Python per Data Science e Machine Learning',
    'python-data-science-machine-learning-2024',
    'Scopri come utilizzare Python per l''analisi dei dati e il machine learning. Il corso include pandas, numpy, matplotlib, scikit-learn e TensorFlow per creare modelli predittivi avanzati.',
    'Data Science',
    'Avanzato',
    'Italiano',
    399.99,
    32,
    4,
    'https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=2070'
),
(
    'UI/UX Design Fundamentals',
    'ui-ux-design-fundamentals-2024',
    'Impara i principi fondamentali del design delle interfacce utente e dell''esperienza utente. Crea prototipi interattivi, impara a condurre test di usabilità e a progettare per diverse piattaforme.',
    'Design',
    'Base',
    'Italiano',
    249.99,
    16,
    2,
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2064'
),
(
    'DevOps e CI/CD con Docker e Kubernetes',
    'devops-cicd-docker-kubernetes-2024',
    'Masterizza le pratiche DevOps e l''integrazione continua. Impara Docker, Kubernetes, e come automatizzare il deployment delle applicazioni in ambienti cloud.',
    'DevOps',
    'Avanzato',
    'Italiano',
    449.99,
    40,
    5,
    'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=2070'
),
(
    'Mobile App Development con React Native',
    'mobile-app-development-react-native-2024',
    'Sviluppa applicazioni mobile cross-platform con React Native. Impara a creare app performanti per iOS e Android utilizzando un unico codice base.',
    'Mobile Development',
    'Intermedio',
    'Italiano',
    349.99,
    28,
    3,
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070'
),
(
    'Cybersecurity Fundamentals',
    'cybersecurity-fundamentals-2024',
    'Impara i principi fondamentali della sicurezza informatica. Copriamo threat modeling, penetration testing, sicurezza delle applicazioni web e best practices per la protezione dei dati.',
    'Cybersecurity',
    'Base',
    'Italiano',
    299.99,
    20,
    2,
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070'
),
(
    'Cloud Computing con AWS',
    'cloud-computing-aws-2024',
    'Scopri i servizi AWS e impara a progettare, implementare e gestire applicazioni cloud-native. Il corso copre EC2, S3, Lambda, e altri servizi fondamentali.',
    'Cloud Computing',
    'Intermedio',
    'Italiano',
    399.99,
    36,
    4,
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070'
); 