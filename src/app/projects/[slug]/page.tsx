import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectView } from "@/components/projects/ProjectView";
import { getNextProject, getProject, projects } from "@/data/projects";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Төсөл олдсонгүй" };

  return {
    title: project.name,
    description: `${project.summary} Жишээ үзүүлэн, бодит захиалагчийн ажил биш.`,
    openGraph: {
      title: project.name,
      description: project.summary,
      images: [{ url: project.cover, alt: project.coverAlt }],
    },
  };
}

export default function ProjectPage({ params }: RouteParams) {
  return (
    <Suspense fallback={<ProjectFallback />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: RouteParams) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const nextProject = getNextProject(slug);
  if (!nextProject) notFound();

  return (
    <main id="main" className="page-in">
      <ProjectView project={project} nextProject={nextProject} />
    </main>
  );
}

function ProjectFallback() {
  return <main id="main" className="min-h-[100svh] bg-ink" aria-busy="true" />;
}
