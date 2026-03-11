import { redirect } from "next/navigation"

// /courses → redirect to the courses section on the landing page (or the programs page)
export default function CoursesPage() {
    redirect("/programs")
}
