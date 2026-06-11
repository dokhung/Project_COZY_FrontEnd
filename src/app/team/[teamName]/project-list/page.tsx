import { ProjectList } from "@/components/landings/ProjectList";
import TeamProjectListHeader from "@/components/project/TeamProjectListHeader";

export default function ProjectListPage() {
  return (
    <main className="theme-page min-h-[calc(100vh-4rem)]">
      <div className="theme-glow-1" />
      <div className="theme-glow-2" />
      <div className="theme-glow-3" />
      <div className="theme-stars" />

      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <section className="max-w-4xl mx-auto">
          <TeamProjectListHeader />

          <div className="mt-6">
            <ProjectList />
          </div>
        </section>
      </div>
    </main>
  );
}
