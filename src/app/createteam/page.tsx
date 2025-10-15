import {CreateTeamForm} from "@/components/team/CreateTeamForm";

export default function CreateTeamPage() {
    return (
        <div className={"min-h-screen bg-gray-200 flex items-center justify-center px-4"}>
            <div className={"w-full max-w-3xl"}>

                <div className={"bg-white rounded-2xl shadow-xl ring-4 ring-sky-100 p-10 sm:p-14"}>
                    <h1 className={"text-center text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800"}>Can you suggest a cool
                        <br className={"hidden sm:block"}/>
                        team name?
                    </h1>
                    <CreateTeamForm />
                    {/*여백*/}
                    <div className={"h-28 sm:h-32"}/>
                </div>
            </div>
        </div>
    )
}