import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Calendar, Utensils, Sun, Moon, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MealPlanner = () => {
  const [meals, setMeals] = useState({ lunch: [], dinner: [] });
  const [newMeal, setNewMeal] = useState('');
  const [mealType, setMealType] = useState('lunch');
  const [weeks, setWeeks] = useState(1);
  const [schedule, setSchedule] = useState(null);

  const addMeal = () => {
    if (newMeal.trim() && !meals[mealType].includes(newMeal.trim())) {
      setMeals({
        ...meals,
        [mealType]: [...meals[mealType], newMeal.trim()]
      });
      setNewMeal('');
    }
  };

  const removeMeal = (index, type) => {
    setMeals({
      ...meals,
      [type]: meals[type].filter((_, i) => i !== index)
    });
  };

  const generateSchedule = () => {
    if (meals.lunch.length < 7 || meals.dinner.length < 7) {
      alert('Please add at least 7 meals for both lunch and dinner to generate a schedule');
      return;
    }

    const schedule = [];
    const recentLunches = [];
    const recentDinners = [];
    
    for (let week = 0; week < weeks; week++) {
      const weekMeals = {
        lunch: [],
        dinner: []
      };
      
      const availableLunches = [...meals.lunch];
      const availableDinners = [...meals.dinner];
      
      for (let day = 0; day < 7; day++) {
        // Handle lunch
        const validLunches = availableLunches.filter(meal => !recentLunches.includes(meal));
        let lunchMeal;
        if (validLunches.length === 0) {
          const randomIndex = Math.floor(Math.random() * availableLunches.length);
          lunchMeal = availableLunches[randomIndex];
          availableLunches.splice(randomIndex, 1);
        } else {
          const randomIndex = Math.floor(Math.random() * validLunches.length);
          lunchMeal = validLunches[randomIndex];
          availableLunches.splice(availableLunches.indexOf(lunchMeal), 1);
        }
        weekMeals.lunch.push(lunchMeal);
        recentLunches.push(lunchMeal);
        if (recentLunches.length > 14) recentLunches.shift();

        // Handle dinner
        const validDinners = availableDinners.filter(meal => !recentDinners.includes(meal));
        let dinnerMeal;
        if (validDinners.length === 0) {
          const randomIndex = Math.floor(Math.random() * availableDinners.length);
          dinnerMeal = availableDinners[randomIndex];
          availableDinners.splice(randomIndex, 1);
        } else {
          const randomIndex = Math.floor(Math.random() * validDinners.length);
          dinnerMeal = validDinners[randomIndex];
          availableDinners.splice(availableDinners.indexOf(dinnerMeal), 1);
        }
        weekMeals.dinner.push(dinnerMeal);
        recentDinners.push(dinnerMeal);
        if (recentDinners.length > 14) recentDinners.shift();
      }
      schedule.push(weekMeals);
    }
    setSchedule(schedule);
  };

  const getDayName = (index) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[index];
  };

  const downloadSchedule = () => {
    if (!schedule) return;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Meal Plan Schedule</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              text-align: center;
              color: #333;
            }
            .week {
              margin-bottom: 30px;
            }
            .week-title {
              font-size: 24px;
              margin-bottom: 15px;
              color: #444;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 10px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            @media print {
              .week {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <h1>${weeks}-Week Meal Plan</h1>
          ${schedule.map((week, weekIndex) => `
            <div class="week">
              <h2 class="week-title">Week ${weekIndex + 1}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Lunch</th>
                    <th>Dinner</th>
                  </tr>
                </thead>
                <tbody>
                  ${week.lunch.map((_, dayIndex) => `
                    <tr>
                      <td>${getDayName(dayIndex)}</td>
                      <td>${week.lunch[dayIndex]}</td>
                      <td>${week.dinner[dayIndex]}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `).join('')}
        </body>
      </html>
    `;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meal-schedule.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-6 h-6" />
            Meal Planner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Meal Input */}
            <div className="flex gap-2">
              <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Meal Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lunch">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Lunch
                    </div>
                  </SelectItem>
                  <SelectItem value="dinner">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Dinner
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={newMeal}
                onChange={(e) => setNewMeal(e.target.value)}
                placeholder="Enter a meal name"
                onKeyPress={(e) => e.key === 'Enter' && addMeal()}
                className="flex-1"
              />
              <Button onClick={addMeal} className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Add Meal
              </Button>
            </div>

            {/* Meal Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lunch List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Lunch Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {meals.lunch.map((meal, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                        <span>{meal}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMeal(index, 'lunch')}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Dinner List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Dinner Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {meals.dinner.map((meal, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                        <span>{meal}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMeal(index, 'dinner')}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Week Selection and Generate Button */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <span>Weeks:</span>
                {[1, 2, 3, 4].map((num) => (
                  <Button
                    key={num}
                    variant={weeks === num ? "default" : "outline"}
                    onClick={() => setWeeks(num)}
                    className="w-10 h-10"
                  >
                    {num}
                  </Button>
                ))}
              </div>
              <Button
                onClick={generateSchedule}
                className="ml-auto flex items-center gap-2"
                disabled={meals.lunch.length < 7 || meals.dinner.length < 7}
              >
                <Calendar className="w-4 h-4" />
                Generate Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Display */}
      {schedule && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Your {weeks}-Week Meal Schedule
            </CardTitle>
            <Button onClick={downloadSchedule} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Schedule
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {schedule.map((week, weekIndex) => (
                <div key={weekIndex} className="space-y-4">
                  <h3 className="font-semibold text-xl">Week {weekIndex + 1}</h3>
                  <div className="grid gap-4">
                    {week.lunch.map((_, dayIndex) => (
                      <div key={dayIndex} className="space-y-2">
                        <div className="font-medium text-lg">{getDayName(dayIndex)}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center p-3 bg-blue-50 rounded">
                            <Sun className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="font-medium mr-2">Lunch:</span>
                            <span>{week.lunch[dayIndex]}</span>
                          </div>
                          <div className="flex items-center p-3 bg-purple-50 rounded">
                            <Moon className="w-4 h-4 mr-2 text-purple-500" />
                            <span className="font-medium mr-2">Dinner:</span>
                            <span>{week.dinner[dayIndex]}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MealPlanner;