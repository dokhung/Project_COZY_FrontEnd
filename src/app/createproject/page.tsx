import CreateProjectForm from "@/components/CreateProject/CreateProjectForm";

export default function CreateProject() {
    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-4">Create Project</h1>
                <p className="text-gray-600 text-center mb-6">
                    사용할 프로젝트의 이름을 작성하세요!
                </p>
                <CreateProjectForm />
            </div>
        </div>
    )
}