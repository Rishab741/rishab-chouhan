export interface PortfolioData {
    name: string;
    role: string;
    bio: string;
    contact: {
        email: string;
        linkedin: string;
        github: string;
        phone: string;
        location: string;
    };
    skills: {
        [category: string]: string[];
    };
    experience: {
        role: string;
        company: string;
        duration: string;
        description: string;
    }[];
    projects: {
        title: string;
        description: string;
        technologies: string[];
        contribution: string;
        liveUrl?: string;
        repoUrl?: string;
    }[];
    education: {
        degree: string;
        institution: string;
        duration: string;
    }[];
}

export interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export interface SectionHeaderProps {
    subtitle: string;
    title: string;
    highlight: string;
    className?: string;
}