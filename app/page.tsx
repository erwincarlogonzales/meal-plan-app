import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MealPlanner from '@/components/MealPlanner'

export default function Home() {
  return (
    <main className="p-4">
      {/* Test Components */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Test Button</Button>
        </CardContent>
      </Card>

      {/* Main MealPlanner Component */}
      <MealPlanner />
    </main>
  )
}