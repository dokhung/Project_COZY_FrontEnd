// components/project/ViewMode.tsx
type ViewProject = {
    projectId: number;
    projectName: string;
    description: string;
    ownerName: string;
    devInterest: string;
    gitHubUrl: string | null;
    createdAt: string; // ISO
};

export default function ViewMode({
                                     data,
                                     onEdit,
                                     onDelete,
                                 }: {
    data: ViewProject;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const created = data.createdAt?.slice(0, 10);

    return (
        <section className="mt-6 rounded-xl bg-white/70 ring-1 ring-stone-300/60 shadow">
            <div className="flex items-center justify-between border-b p-5">
                <div>
                    <h2 className="text-lg font-semibold text-stone-900">{data.projectName}</h2>
                    <p className="mt-1 text-xs text-stone-500">Created: {created}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-900"
                    >
                        Edit
                    </button>
                    <button
                        onClick={onDelete}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                <div className="rounded-xl border border-stone-200 bg-white/70 p-5">
                    <h3 className="mb-3 text-sm font-semibold text-stone-700">Overview</h3>
                    <dl className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-3 text-sm">
                        <dt className="text-stone-500">Owner</dt>
                        <dd className="font-medium text-stone-800">{data.ownerName}</dd>

                        <dt className="text-stone-500">DevInterest</dt>
                        <dd>
              <span className="inline-flex items-center rounded-full border border-stone-300 bg-stone-50 px-2 py-0.5 text-xs font-medium text-stone-700">
                {data.devInterest}
              </span>
                        </dd>

                        <dt className="text-stone-500">Git</dt>
                        <dd>
                            {data.gitHubUrl ? (
                                <a
                                    className="underline underline-offset-2 hover:opacity-80 break-all"
                                    href={data.gitHubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {data.gitHubUrl}
                                </a>
                            ) : (
                                <span className="text-stone-400">No Git URL</span>
                            )}
                        </dd>
                    </dl>
                </div>

                <div className="rounded-xl border border-stone-200 bg-white/70 p-5">
                    <h3 className="mb-3 text-sm font-semibold text-stone-700">Description</h3>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-stone-800">
                        {data.description || "No description"}
                    </p>
                </div>
            </div>
        </section>
    );
}
